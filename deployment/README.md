# Panduan Deployment Monorepo

Dokumen ini berisi panduan struktur project dan deployment untuk monorepo Colo Sagu.

## Struktur Project

```
/home/colosagu/              # Root project di server
  ├─ dist/                   # Hasil build frontend (Vite)
  ├─ server/                 # Backend Express (dijalankan dengan PM2)
  ├─ src/                    # Source code frontend
  ├─ public/                 # File publik untuk development
  ├─ ecosystem.config.cjs    # Konfigurasi PM2
  └─ ...

/srv/data/colosagu/          # Persistent data storage
  ├─ gallery/                # Upload gallery
  ├─ blog-images/            # Upload gambar blog
  └─ lovable-uploads/        # Upload lain
```

## Konfigurasi Deployment

1. **Nginx**: File `nginx.conf` berisi konfigurasi untuk web server:

   - Mendukung SSL/HTTPS dengan Let's Encrypt
   - Dikonfigurasi untuk bekerja dengan Cloudflare
   - Routing ke API dan static files

2. **PM2**: File `ecosystem.config.cjs` mengatur proses backend:
   - Nama proses: `colosagu-api`
   - Path script: `server/index.js`
   - Otomatis restart jika crash

## Penggunaan untuk Project Baru

Untuk menggunakan struktur ini pada project baru:

1. Clone repository baru ke server:

   ```bash
   git clone https://github.com/username/project-baru.git /home/project-baru
   ```

2. Salin dan sesuaikan konfigurasi:

   ```bash
   cp /home/colosagu/ecosystem.config.cjs /home/project-baru/
   ```

3. Buat direktori persistent data:

   ```bash
   mkdir -p /srv/data/project-baru/{uploads,images}
   chmod -R 755 /srv/data/project-baru
   chown -R www-data:www-data /srv/data/project-baru
   ```

4. Buat konfigurasi Nginx baru:

   ```bash
   cp /etc/nginx/sites-available/colosagu.id /etc/nginx/sites-available/project-baru.id
   # Edit file sesuai kebutuhan
   nano /etc/nginx/sites-available/project-baru.id
   ```

5. Aktifkan site dan restart Nginx:

   ```bash
   ln -s /etc/nginx/sites-available/project-baru.id /etc/nginx/sites-enabled/
   nginx -t && systemctl restart nginx
   ```

6. Install dependencies dan build:

   ```bash
   cd /home/project-baru
   npm install
   npm run build
   ```

7. Jalankan dengan PM2:
   ```bash
   pm2 start ecosystem.config.cjs
   pm2 save
   ```

## Tips Optimasi

1. Gunakan mode SSL "Full (Strict)" di Cloudflare
2. Pastikan CORS dikonfigurasi dengan benar untuk aset statis
3. Manfaatkan caching untuk aset statis
4. Beri perhatian pada security headers untuk keamanan
