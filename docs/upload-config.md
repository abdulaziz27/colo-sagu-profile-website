# Konfigurasi Upload File

Dokumen ini berisi informasi tentang konfigurasi upload file pada aplikasi Colo Sagu.

## Konfigurasi Saat Ini

Konfigurasi upload file telah diperbarui pada tanggal 22 Agustus 2025 dengan spesifikasi berikut:

- **Batas Ukuran File**: 50MB (ditingkatkan dari 10MB)
- **Tipe File yang Diperbolehkan**: Semua tipe file (sebelumnya hanya gambar)
- **Lokasi Penyimpanan**:
  - Gallery: `/srv/data/colosagu/gallery/`
  - Blog Images: `/srv/data/colosagu/blog-images/`
  - Lovable Uploads: `/srv/data/colosagu/lovable-uploads/`

## Implementasi

Konfigurasi ini diimplementasikan menggunakan Multer di file `/home/colosagu/server/index.js`:

```javascript
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB (batas ukuran file)
  },
  fileFilter: (req, file, cb) => {
    // Terima semua tipe file
    if (true) {
      // Terima semua tipe file
      cb(null, true);
    } else {
      cb(new Error("File tidak valid"), false); // Tidak akan pernah dipanggil karena semua file diterima
    }
  },
});
```

## Endpoint Upload

Aplikasi menyediakan beberapa endpoint untuk upload file:

1. **Gallery Upload**:

   ```
   POST /api/gallery/upload
   ```

2. **Blog Images Upload**:
   ```
   POST /api/blog-images/upload
   ```

## Pertimbangan Keamanan

Meskipun konfigurasi saat ini mengizinkan semua tipe file, perhatikan beberapa risiko keamanan:

1. **Eksekusi File Berbahaya**: Pastikan server tidak mengeksekusi file yang diupload
2. **Penyimpanan Terpisah**: File disimpan di direktori terpisah dari kode aplikasi
3. **Validasi Frontend**: Sebaiknya tetap validasi tipe file di frontend untuk UX yang lebih baik

## Troubleshooting

Jika terjadi masalah upload:

1. Periksa log server: `pm2 logs colosagu-api`
2. Pastikan direktori penyimpanan memiliki permission yang benar:
   ```bash
   chmod -R 755 /srv/data/colosagu
   chown -R www-data:www-data /srv/data/colosagu
   ```
3. Periksa konfigurasi Nginx untuk batas ukuran upload:
   ```bash
   # Tambahkan ke konfigurasi server jika diperlukan
   client_max_body_size 50M;
   ```
