# 🚀 Deployment Guide - Colo Sagu Website

## 📋 Overview

Website Colo Sagu menggunakan setup **subdomain terpisah**:

- **Frontend**: `colosagu.id` (Shared Hosting)
- **Backend**: `api.colosagu.id` (VPS)

## 🛠️ Prerequisites

### Shared Hosting (colosagu.id)

- cPanel access
- File Manager access
- Domain management

### VPS (api.colosagu.id)

- Ubuntu/Debian server
- Root access
- Domain pointing to VPS IP

## 📦 Build & Deploy

### 1. Build Project

```bash
./deploy-subdomain.sh
```

### 2. Deploy Frontend (Shared Hosting)

**Upload Files:**

1. Buka cPanel → File Manager
2. Masuk ke `public_html/`
3. Upload folder `frontend-deploy/`
4. Extract dan pindahkan semua file ke root `public_html/`

**Setup Domain:**

1. Point domain `colosagu.id` ke shared hosting
2. Aktifkan SSL certificate
3. Test website: `https://colosagu.id`

### 3. Deploy Backend (VPS)

**Upload Files:**

```bash
# Upload ke VPS
scp -r backend-deploy/ user@your-vps-ip:/var/www/api.colosagu.id/
```

**Setup Environment:**

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Masuk ke direktori
cd /var/www/api.colosagu.id/

# Buat .env file
nano .env
```

**Isi .env:**

```env
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=colo_sagu_user
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=colo_sagu_db
MYSQL_PORT=3306

# Midtrans Configuration (Production)
MIDTRANS_SERVER_KEY=your_production_server_key
MIDTRANS_CLIENT_KEY=your_production_client_key
MIDTRANS_MERCHANT_ID=your_merchant_id

# Server Configuration
PORT=3001
NODE_ENV=production
```

**Install & Start:**

```bash
# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2

# Start application
./start.sh
```

### 4. Setup Nginx

**Create Nginx Config:**

```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/api.colosagu.id

# Enable site
sudo ln -s /etc/nginx/sites-available/api.colosagu.id /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 5. Setup Database

**Create Database:**

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE colo_sagu_db;
CREATE USER 'colo_sagu_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON colo_sagu_db.* TO 'colo_sagu_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Import Schema:**

```bash
# Import database schema
mysql -u colo_sagu_user -p colo_sagu_db < db_seed.sql
```

### 6. Setup DNS

**DNS Records:**

```
colosagu.id          A     [shared-hosting-ip]
api.colosagu.id      A     [vps-ip]
```

## 🔧 Management Commands

### VPS Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs colo-sagu-api

# Restart application
pm2 restart colo-sagu-api

# Stop application
pm2 stop colo-sagu-api

# Start application
pm2 start colo-sagu-api
```

### Nginx Commands

```bash
# Test config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

## 🧪 Testing

### Frontend

- ✅ Website: `https://colosagu.id`
- ✅ Admin: `https://colosagu.id/admin`
- ✅ Donation: `https://colosagu.id/donate`

### Backend

- ✅ API Health: `https://api.colosagu.id/api/total-donations`
- ✅ Blog Posts: `https://api.colosagu.id/api/blog-posts`
- ✅ Gallery: `https://api.colosagu.id/api/gallery`

## 🔍 Troubleshooting

### Frontend Issues

- **404 Error**: Check `.htaccess` file
- **CORS Error**: Verify API URL in frontend config
- **SSL Error**: Activate SSL certificate

### Backend Issues

- **Port 3001**: Check if port is open
- **Database**: Verify MySQL connection
- **PM2**: Check application logs

### Common Commands

```bash
# Check if port 3001 is listening
sudo netstat -tlnp | grep :3001

# Check PM2 logs
pm2 logs colo-sagu-api --lines 100

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check application logs
tail -f /var/www/api.colosagu.id/logs/app.log
```

## 📞 Support

Jika ada masalah:

1. Check logs dengan commands di atas
2. Verify environment variables
3. Test API endpoints satu per satu
4. Contact hosting provider untuk masalah server

## 🎉 Success!

Setelah semua setup selesai:

- **Website**: `https://colosagu.id`
- **API**: `https://api.colosagu.id`
- **Admin**: `https://colosagu.id/admin`

Semua berjalan dengan aman dan terpisah! 🚀
