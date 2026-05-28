#!/bin/bash
# wheelchair.uz — Deploy Script
# Server: Ubuntu 22.04 + Nginx
# Run: chmod +x deploy.sh && ./deploy.sh

set -e

DOMAIN="wheelchair.uz"
APP_DIR="/var/www/wheelchair-uz"
REPO_URL="https://github.com/YOUR_USERNAME/wheelchair-uz.git"  # o'zgartiring

echo "🚀 wheelchair.uz deployment starting..."

# 1. System packages
echo "📦 Installing system packages..."
apt-get update -q
apt-get install -y nginx certbot python3-certbot-nginx nodejs npm git

# Check Node version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
  echo "Upgrading Node.js to v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 2. Clone or pull repo
echo "📥 Getting source code..."
if [ -d "$APP_DIR" ]; then
  cd $APP_DIR && git pull
else
  git clone $REPO_URL $APP_DIR
  cd $APP_DIR
fi

# 3. Build
echo "🔨 Building React app..."
npm install
npm run build

# 4. Nginx config
echo "⚙️ Configuring Nginx..."
cp nginx.conf /etc/nginx/sites-available/wheelchair-uz
ln -sf /etc/nginx/sites-available/wheelchair-uz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 5. SSL certificate
echo "🔒 Setting up SSL..."
certbot --nginx -d $DOMAIN -d www.$DOMAIN -d admin.$DOMAIN \
  --non-interactive --agree-tos -m admin@$DOMAIN || echo "SSL already configured"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Public site: https://$DOMAIN"
echo "🔐 Admin panel: https://admin.$DOMAIN/admin/login"
echo "   Login: admin@wheelchair.uz / admin123"
