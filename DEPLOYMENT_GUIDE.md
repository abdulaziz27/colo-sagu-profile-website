# Deployment Guide for Colo Sagu Website

This guide outlines the steps to deploy the Colo Sagu website to a VPS at Niagahoster with the domain colosagu.id. The project uses a monorepo structure with both frontend (React/Vite) and backend (Express) in the same repository.

## Prerequisites

- A VPS server at Niagahoster
- SSH access to the VPS
- Domain (colosagu.id) configured to point to your VPS IP
- Node.js (v16+) installed on your VPS
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed on your VPS
- MySQL installed on your VPS

## Directory Structure on VPS

The site will be deployed to `/home/user/colosagu` with the following structure:

```
/home/user/colosagu/          # Main project folder
  ├─ server/                  # Backend Express (managed by PM2)
  ├─ dist/                    # Frontend build output (served by Nginx)
  ├─ package.json             # Project dependencies
  ├─ ecosystem.config.js      # PM2 configuration
  └─ (Other source files)     # Not served publicly
  
/srv/data/colosagu/           # Persistent uploads storage
  ├─ gallery/                 # Gallery image uploads
  ├─ blog-images/             # Blog post images
  └─ lovable-uploads/         # Other uploads
```

## Step 1: Initial Server Setup

```bash
# Connect to your VPS via SSH
ssh user@your-vps-ip

# Create project directories
mkdir -p /home/user/colosagu
mkdir -p /srv/data/colosagu/{gallery,blog-images,lovable-uploads}

# Set correct permissions for upload directories
chmod -R 755 /srv/data/colosagu
chown -R www-data:www-data /srv/data/colosagu  # Or your web server user
```

## Step 2: Clone and Configure Project

```bash
# Clone the repository
cd /home/user
git clone https://github.com/your-username/colo-sagu-profile-website.git colosagu

# Navigate to project directory
cd colosagu

# Create .env file for backend configuration
cat > .env << EOL
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
MYSQL_DATABASE=colo_sagu_db
MYSQL_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=production

# Midtrans Configuration (if using)
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_MERCHANT_ID=your_merchant_id
EOL
```

## Step 3: Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build the frontend
npm run build
```

## Step 4: Database Setup

```bash
# Create database and user
mysql -u root -p
```

In MySQL prompt:

```sql
CREATE DATABASE colo_sagu_db;
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON colo_sagu_db.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Import the database schema:

```bash
mysql -u your_db_user -p colo_sagu_db < server/db_seed.sql
```

## Step 5: Configure Nginx

```bash
# Create Nginx configuration file
sudo cp nginx.conf /etc/nginx/sites-available/colosagu.id

# Create symlink to enable the site
sudo ln -s /etc/nginx/sites-available/colosagu.id /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# If the test is successful, restart Nginx
sudo systemctl restart nginx
```

## Step 6: Start the Application with PM2

```bash
# Start the backend server with PM2
npm run start:pm2

# Ensure PM2 starts on system reboot
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u user --hp /home/user
pm2 save
```

## Step 7: SSL Configuration with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d colosagu.id -d www.colosagu.id

# Certbot will modify your Nginx config automatically
# Test Nginx configuration again
sudo nginx -t

# If the test is successful, restart Nginx
sudo systemctl restart nginx
```

## Maintenance and Updates

### Updating the Website

```bash
# Navigate to project directory
cd /home/user/colosagu

# Pull latest changes
git pull

# Install dependencies if there are changes
npm install

# Build the frontend
npm run build

# Restart the backend server
npm run restart
```

### Monitoring

```bash
# View application logs
npm run logs

# Monitor PM2 processes
pm2 monit
```

### Common Issues and Troubleshooting

1. **Permission Issues**: If you have permission problems with upload directories:
   ```bash
   sudo chown -R www-data:www-data /srv/data/colosagu
   sudo chmod -R 755 /srv/data/colosagu
   ```

2. **Nginx Configuration**: If Nginx isn't serving your site correctly:
   ```bash
   sudo nginx -t  # Test configuration
   sudo journalctl -u nginx  # Check Nginx logs
   ```

3. **Node.js Application**: If the backend isn't working:
   ```bash
   npm run logs  # Check PM2 logs
   ```

4. **Database Connection**: If database connection fails:
   ```bash
   mysql -u your_db_user -p  # Test database connection
   ```

## Additional Notes

- Ensure your firewall allows traffic on ports 80 (HTTP), 443 (HTTPS), and any other ports you need.
- Consider setting up automated backups for your database and upload directories.
- Monitor server resources regularly to ensure optimal performance.