# Setup Webhook Midtrans untuk Callback

## 🚨 Masalah Saat Ini

Status transaksi donasi tidak terupdate otomatis karena:
1. Webhook Midtrans belum dikonfigurasi
2. Callback URL belum diset di dashboard Midtrans
3. Midtrans menggunakan ID yang berbeda untuk tracking transaksi

## 🔧 Solusi: Konfigurasi Webhook

### 1. Login ke Dashboard Midtrans
- Buka https://dashboard.midtrans.com/
- Login dengan akun merchant Anda

### 2. Konfigurasi Webhook URL
1. Buka menu **Settings** → **Configuration**
2. Cari bagian **Webhook URL** atau **Notification URL**
3. Set URL berikut:
   ```
   https://colosagu.id/api/midtrans-callback
   ```

### 3. Konfigurasi Callback URL (Opsional)
Untuk redirect user setelah pembayaran, set callback URLs:
- **Finish URL**: `https://colosagu.id/donate?status=success`
- **Unfinish URL**: `https://colosagu.id/donate?status=pending`
- **Error URL**: `https://colosagu.id/donate?status=error`

### 4. Test Webhook
Setelah konfigurasi, test dengan membuat donasi baru:
1. Buat donasi di website
2. Bayar sampai selesai
3. Cek log server untuk melihat callback diterima

## 📊 Status Transaksi

| Status Midtrans | Status Database | Arti |
|----------------|----------------|------|
| `settlement` | `settlement` | Pembayaran berhasil |
| `capture` | `settlement` | Pembayaran berhasil (credit card) |
| `pending` | `pending` | Menunggu pembayaran |
| `cancel` | `failed` | Dibatalkan user |
| `deny` | `failed` | Ditolak bank |
| `expire` | `failed` | Kadaluarsa |
| `failure` | `failed` | Gagal |

## 🔍 Monitoring

### Cek Log Server
```bash
ssh root@31.97.187.17 "cd /home/colosagu && pm2 logs colosagu-api --lines 20"
```

### Cek Status Donasi
```bash
curl -s "https://colosagu.id/api/donation-status/ORDER_ID"
```

### Cek Total Donasi
```bash
curl -s "https://colosagu.id/api/total-donations"
```

## ⚠️ Catatan Penting

1. **Webhook harus HTTPS**: Midtrans hanya mengirim webhook ke URL HTTPS
2. **Timeout**: Webhook Midtrans memiliki timeout, pastikan server merespons cepat
3. **Retry**: Midtrans akan retry webhook jika gagal
4. **Security**: Validasi signature webhook untuk keamanan (opsional)

## 🧪 Testing Flow

### Test 1: Pembayaran Berhasil
1. Buat donasi baru
2. Bayar sampai selesai
3. **Expected**: Status berubah dari `pending` → `settlement`
4. **Expected**: Total donasi bertambah

### Test 2: Pembayaran Dibatalkan
1. Buat donasi baru
2. Cancel pembayaran
3. **Expected**: Status berubah dari `pending` → `failed`
4. **Expected**: Total donasi tidak bertambah

### Test 3: Pembayaran Gagal
1. Buat donasi baru
2. Tutup Snap tanpa bayar
3. **Expected**: Status tetap `pending`
4. **Expected**: Total donasi tidak bertambah

## 🔧 Troubleshooting

### Webhook tidak diterima
1. Cek URL webhook sudah benar
2. Cek server bisa diakses dari internet
3. Cek firewall tidak memblokir request
4. Cek log server untuk error

### Status tidak terupdate
1. Cek webhook URL sudah dikonfigurasi
2. Cek callback endpoint berfungsi
3. Cek database connection
4. Cek log server untuk error

### Error 404 di Midtrans
1. Order ID tidak ditemukan di Midtrans
2. Gunakan transaction ID yang benar
3. Cek format order ID sesuai dengan Midtrans
