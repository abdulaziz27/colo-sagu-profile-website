# Perbaikan Masalah Transaksi Donasi

## 🚨 Masalah yang Ditemukan

**Masalah Serius**: Donasi langsung ditandai sebagai "settlement" (berhasil) tanpa menunggu konfirmasi pembayaran dari Midtrans. Ini menyebabkan:

1. **Donasi palsu**: User yang hanya membuka Snap Midtrans tanpa membayar tetap tercatat sebagai donasi berhasil
2. **Total donasi tidak akurat**: Dashboard menampilkan total donasi yang tidak sesuai dengan pembayaran sebenarnya
3. **Kehilangan kepercayaan**: Data donasi tidak reliable untuk pelaporan

## 🔧 Perbaikan yang Dilakukan

### 1. Perbaikan Status Donasi Awal

**Sebelum**:

```javascript
// Insert dengan status 'settlement' langsung (berhasil)
await db.query(
  "INSERT INTO donations (order_id, name, amount, status, snap_token, event_id) VALUES (?, ?, ?, ?, ?, ?)",
  [orderId, name || "Donatur", amount, "settlement", snapToken, event.id]
);
```

**Sesudah**:

```javascript
// Insert dengan status 'pending' - menunggu konfirmasi pembayaran
await db.query(
  "INSERT INTO donations (order_id, name, amount, status, snap_token, event_id) VALUES (?, ?, ?, ?, ?, ?)",
  [orderId, name || "Donatur", amount, "pending", snapToken, event.id]
);
```

### 2. Endpoint Callback Midtrans (Sudah Ada)

Endpoint `/api/midtrans-callback` sudah ada dan berfungsi dengan benar untuk menerima notifikasi status pembayaran dari Midtrans.

### 3. Endpoint Pengecekan Status Transaksi

Menambahkan endpoint baru `/api/check-transaction` untuk mengecek status transaksi secara manual:

```javascript
app.post("/api/check-transaction", async (req, res) => {
  const { order_id } = req.body;

  // Get transaction status from Midtrans
  const transaction = await snap.transaction.status(order_id);
  const transactionStatus = transaction.transaction_status;

  // Update database status based on Midtrans response
  if (transactionStatus === "settlement") {
    await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
      "settlement",
      order_id,
    ]);
  } else if (
    transactionStatus === "cancel" ||
    transactionStatus === "deny" ||
    transactionStatus === "expire"
  ) {
    await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
      "failed",
      order_id,
    ]);
  } else {
    await db.query("UPDATE donations SET status = ? WHERE order_id = ?", [
      transactionStatus,
      order_id,
    ]);
  }

  res.json({
    status: transactionStatus,
    message: "Transaction status updated",
  });
});
```

### 4. Perbaikan Data yang Sudah Ada

Menjalankan query untuk memperbaiki donasi yang sudah ada:

```sql
UPDATE donations
SET status = 'pending'
WHERE status = 'settlement'
AND snap_token IS NOT NULL;
```

## 🔄 Flow Transaksi yang Benar

### 1. User Membuat Donasi

- User mengisi form donasi
- Sistem membuat transaksi di Midtrans
- **Status di database**: `pending`
- User mendapat Snap token untuk pembayaran

### 2. User Membayar

- User membayar melalui Snap Midtrans
- Midtrans mengirim callback ke `/api/midtrans-callback`
- **Status di database**: `settlement` (jika berhasil) atau `failed` (jika gagal)

### 3. User Tidak Membayar

- User menutup Snap tanpa membayar
- **Status di database**: tetap `pending`
- Tidak masuk ke total donasi

### 4. Pengecekan Manual (Opsional)

- Admin bisa mengecek status transaksi manual
- Menggunakan endpoint `/api/check-transaction`
- Berguna untuk transaksi yang tidak mendapat callback

## 📊 Status Transaksi

| Status       | Arti                | Masuk Total Donasi |
| ------------ | ------------------- | ------------------ |
| `pending`    | Menunggu pembayaran | ❌ Tidak           |
| `settlement` | Pembayaran berhasil | ✅ Ya              |
| `failed`     | Pembayaran gagal    | ❌ Tidak           |
| `cancel`     | Dibatalkan user     | ❌ Tidak           |
| `deny`       | Ditolak bank        | ❌ Tidak           |
| `expire`     | Kadaluarsa          | ❌ Tidak           |

## 🧪 Testing

### Test 1: Donasi Baru

1. Buat donasi baru
2. **Expected**: Status `pending` di database
3. **Expected**: Total donasi tidak bertambah

### Test 2: Pembayaran Berhasil

1. Bayar melalui Snap Midtrans
2. **Expected**: Status berubah menjadi `settlement`
3. **Expected**: Total donasi bertambah

### Test 3: Pembayaran Gagal

1. Tutup Snap tanpa membayar
2. **Expected**: Status tetap `pending`
3. **Expected**: Total donasi tidak bertambah

## 🔒 Keamanan

- Semua transaksi sekarang menunggu konfirmasi dari Midtrans
- Tidak ada lagi donasi palsu
- Data donasi reliable untuk pelaporan
- Callback dari Midtrans divalidasi dengan benar

## 📝 Catatan Penting

1. **Donasi yang sudah ada**: Semua donasi dengan status `settlement` yang salah sudah diperbaiki menjadi `pending`
2. **Total donasi**: Sekarang hanya menghitung donasi dengan status `settlement` yang benar
3. **Monitoring**: Perlu monitoring callback dari Midtrans untuk memastikan semua transaksi terupdate dengan benar
4. **Manual check**: Jika ada transaksi yang tidak mendapat callback, bisa dicek manual menggunakan endpoint `/api/check-transaction`
