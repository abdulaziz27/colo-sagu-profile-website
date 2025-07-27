#!/bin/bash

echo "🚀 Preparing deployment for subdomain setup..."
echo "Frontend: colosagu.id (shared hosting)"
echo "Backend: api.colosagu.id (VPS)"
echo ""

# Build the React app
echo "📦 Building frontend..."
npm run build

# Create deployment folders
mkdir -p frontend-deploy
mkdir -p backend-deploy

# Copy frontend files
echo "📁 Copying frontend files..."
cp -r dist/* frontend-deploy/
cp public/.htaccess frontend-deploy/ 2>/dev/null || echo "No .htaccess found"

# Copy backend files
echo "📁 Copying backend files..."
cp -r server/* backend-deploy/
cp package.json backend-deploy/
cp .env backend-deploy/ 2>/dev/null || echo "⚠️  No .env file found - create one manually"

# Create .htaccess for frontend
cat > frontend-deploy/.htaccess << 'EOF'
RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [QSA,L]

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
EOF

# Create nginx config for backend
cat > backend-deploy/nginx.conf << 'EOF'
server {
    listen 80;
    server_name api.colosagu.id;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Create PM2 ecosystem file
cat > backend-deploy/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'colo-sagu-api',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
EOF

# Create start script for backend
cat > backend-deploy/start.sh << 'EOF'
#!/bin/bash
echo "Starting Colo Sagu API..."
npm install
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
echo "API started successfully!"
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs colo-sagu-api"
EOF

chmod +x backend-deploy/start.sh

echo ""
echo "✅ Deployment packages ready!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. FRONTEND (colosagu.id - Shared Hosting):"
echo "   - Upload folder 'frontend-deploy/' to public_html/"
echo "   - Point domain colosagu.id to shared hosting"
echo ""
echo "2. BACKEND (api.colosagu.id - VPS):"
echo "   - Upload folder 'backend-deploy/' to /var/www/api.colosagu.id/"
echo "   - Create .env file with database and Midtrans credentials"
echo "   - Run: cd /var/www/api.colosagu.id && ./start.sh"
echo "   - Setup nginx: sudo ln -s /var/www/api.colosagu.id/nginx.conf /etc/nginx/sites-available/api.colosagu.id"
echo "   - Enable site: sudo ln -s /etc/nginx/sites-available/api.colosagu.id /etc/nginx/sites-enabled/"
echo "   - Restart nginx: sudo systemctl restart nginx"
echo ""
echo "3. DATABASE:"
echo "   - Create database on VPS or shared hosting"
echo "   - Import server/db_seed.sql"
echo "   - Update .env file with database credentials"
echo ""
echo "4. DNS:"
echo "   - colosagu.id → shared hosting IP"
echo "   - api.colosagu.id → VPS IP"
echo ""
echo "📁 Files created:"
echo "- frontend-deploy/ (for shared hosting)"
echo "- backend-deploy/ (for VPS)" 