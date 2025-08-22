# Perbaikan Sederhana Status Transaksi Donasi

## 🎯 Requirement

Sistem transaksi donasi yang simple dengan 3 kondisi:

1. **User close Snap tanpa bayar** → Status: `pending`
2. **Pembayaran gagal/error** → Status: `failed`
3. **Pembayaran berhasil** → Status: `settlement`

Semua otomatis tanpa campur tangan admin.

## 🔧 Perbaikan yang Dilakukan

### 1. Backend (server/index.js)

**Perbaikan Error `snapToken is not defined`:**

- Memindahkan `res.json({ snapToken, orderId })` ke dalam try block yang benar
- Menambahkan logging untuk debugging

**Endpoint `/api/check-transaction` yang diperbaiki:**

- Sekarang menerima parameter `manual_status` untuk update status langsung dari frontend
- Jika `manual_status` tidak ada, baru cek ke Midtrans
- Mendukung update status berdasarkan callback Snap

### 2. Frontend (src/components/Donate.tsx)

**Snap Payment Callbacks yang disederhanakan:**

```javascript
window.snap.pay(snapToken, {
  onSuccess: function (result) {
    // Pembayaran berhasil → langsung update ke 'settlement'
    updateTransactionStatus(orderId, "settlement");
    setSuccessMsg("Terima kasih, donasi Anda berhasil!");
    fetchTotal();
  },
  onPending: function (result) {
    // Pembayaran pending → tetap 'pending', tunggu callback
    setSuccessMsg("Donasi Anda sedang diproses. Terima kasih!");
    fetchTotal();
  },
  onError: function (result) {
    // Pembayaran error → update ke 'failed'
    updateTransactionStatus(orderId, "failed");
    alert("Pembayaran gagal");
  },
  onClose: function () {
    // User close Snap → status tetap 'pending'
    // Tidak ada action, biarkan status pending
  },
});
```

**Function `updateTransactionStatus`:**

- Menggantikan `checkTransactionStatus` yang kompleks
- Langsung update status ke backend dengan parameter `manual_status`
- Lebih simple dan direct

## 🔄 Flow yang Benar

1. **User buat donasi** → Status: `pending` di database
2. **Snap muncul** → User bisa bayar atau close
3. **Kondisi:**
   - **onSuccess** → Status: `settlement` (masuk total donasi)
   - **onError** → Status: `failed` (tidak masuk total)
   - **onClose** → Status: `pending` (tidak masuk total)

## 🧪 Testing

Untuk test di lokal:

1. Jalankan `npm run dev:server`
2. Buat donasi baru
3. Test 3 kondisi:
   - Bayar sampai selesai → cek status jadi `settlement`
   - Simulasi error → cek status jadi `failed`
   - Close Snap → cek status tetap `pending`

## 📝 Catatan

- Status `pending` dan `failed` tidak masuk ke total donasi
- Hanya status `settlement` yang masuk ke total donasi
- Semua otomatis, tidak perlu intervensi admin
- Logging lengkap untuk debugging
