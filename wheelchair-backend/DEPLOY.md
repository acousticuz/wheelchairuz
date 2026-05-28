# wheelchair.uz — VPS Deployment Guide

## Talablar
- Ubuntu 22.04 LTS
- VPS: kamida 2 GB RAM, 20 GB disk
- Domain: wheelchair.uz (DNS A record → server IP)

---

## 1. Server dastlabki sozlash

```bash
# Root sifatida kiring va yangilang
apt-get update && apt-get upgrade -y

# Asosiy paketlar
apt-get install -y curl git nginx certbot python3-certbot-nginx ufw

# Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Log papkasi
mkdir -p /var/log/wheelchair
```

---

## 2. Node.js o'rnatish

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v   # v20.x bo'lishi kerak
npm -v

# PM2
npm install -g pm2
pm2 startup systemd
```

---

## 3. PostgreSQL o'rnatish

```bash
apt-get install -y postgresql postgresql-contrib

# PostgreSQL ishga tushirish
systemctl start postgresql
systemctl enable postgresql

# Database va user yaratish
sudo -u postgres psql << 'SQL'
CREATE USER wheelchair_user WITH PASSWORD 'YOUR_DB_PASSWORD_HERE';
CREATE DATABASE wheelchair_db OWNER wheelchair_user;
GRANT ALL PRIVILEGES ON DATABASE wheelchair_db TO wheelchair_user;
\q
SQL

# Test
sudo -u postgres psql -c "\l"
```

---

## 4. Backend deploy

```bash
# Papka yaratish
mkdir -p /var/www/wheelchair-backend
cd /var/www/wheelchair-backend

# Kodni ko'chirish (local → server)
# Variant A: SCP
scp -r ./wheelchair-backend/* root@YOUR_SERVER_IP:/var/www/wheelchair-backend/

# Variant B: Git (tavsiya qilinadi)
git clone https://github.com/YOUR_USERNAME/wheelchair-backend.git .

# .env faylini sozlash
cp .env.example .env
nano .env
# ↑ Barcha kerakli qiymatlarni to'ldiring

# Dependencies o'rnatish
npm install --production

# Build
npm run build

# Uploads papkasi
mkdir -p uploads
chmod 755 uploads

# PM2 bilan ishga tushirish
pm2 start ecosystem.config.js
pm2 save

# Test
curl http://localhost:3000/api/v1/categories
```

---

## 5. Frontend deploy

```bash
# Local kompyuterda frontend build
cd wheelchair-react
npm install
npm run build

# Build dist papkasini serverga ko'chirish
mkdir -p /var/www/wheelchair-frontend
scp -r dist/* root@YOUR_SERVER_IP:/var/www/wheelchair-frontend/dist/

# Yoki Git orqali
```

---

## 6. Nginx sozlash

```bash
# Config faylini ko'chirish
cp /var/www/wheelchair-backend/nginx.conf /etc/nginx/sites-available/wheelchair-uz

# Aktivlashtirish
ln -sf /etc/nginx/sites-available/wheelchair-uz /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test
nginx -t

# Reload
systemctl reload nginx
```

---

## 7. SSL sertifikat (Let's Encrypt)

```bash
# Barcha domenlar uchun sertifikat
certbot --nginx \
  -d wheelchair.uz \
  -d www.wheelchair.uz \
  -d admin.wheelchair.uz \
  -d api.wheelchair.uz \
  --non-interactive \
  --agree-tos \
  -m admin@wheelchair.uz

# Test
certbot renew --dry-run

# Auto-renewal (cron)
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -
```

---

## 8. Telegram Bot sozlash

1. Telegram'da `@BotFather` ga `/newbot` yuboring
2. Bot nomini kiriting: `Wheelchair UZ Bot`
3. Username kiriting: `wheelchairuz_admin_bot`
4. Olingan **TOKEN** ni `.env` fayliga yozing: `TELEGRAM_BOT_TOKEN=...`
5. Bot bilan `/start` yuboring — chat ID olish uchun
6. Olingan **CHAT ID** ni `.env` ga yozing: `TELEGRAM_ADMIN_CHAT_ID=...`
7. Backend restart:
   ```bash
   pm2 restart wheelchair-api
   ```

---

## 9. Tekshirish

```bash
# Backend salomatlik
curl https://wheelchair.uz/api/v1/categories
curl https://wheelchair.uz/api/v1/products

# Swagger docs
# https://wheelchair.uz/api/docs

# Admin panel
# https://admin.wheelchair.uz/admin/login
# Login: .env dagi ADMIN_EMAIL / ADMIN_PASSWORD

# PM2 holati
pm2 status
pm2 logs wheelchair-api --lines 50

# Nginx holati
systemctl status nginx
tail -f /var/log/nginx/wheelchair-error.log
```

---

## 10. Yangilanishlar (update)

```bash
cd /var/www/wheelchair-backend
git pull
npm install
npm run build
pm2 restart wheelchair-api

# Frontend yangilash
cd wheelchair-react
npm run build
scp -r dist/* root@SERVER:/var/www/wheelchair-frontend/dist/
```

---

## Muhim eslatmalar

| Fayl | Manzil |
|------|--------|
| Backend kod | `/var/www/wheelchair-backend` |
| Frontend dist | `/var/www/wheelchair-frontend/dist` |
| Rasmlar | `/var/www/wheelchair-backend/uploads` |
| Nginx config | `/etc/nginx/sites-available/wheelchair-uz` |
| PM2 logs | `/var/log/wheelchair/` |
| Nginx logs | `/var/log/nginx/wheelchair-*.log` |

```
API Endpoints:
  GET  /api/v1/categories         → Kategoriyalar
  GET  /api/v1/products           → Mahsulotlar (filter, search, paginate)
  GET  /api/v1/products/:slug     → Mahsulot detail
  POST /api/v1/inquiries          → Forma yuborish (Telegram ga xabar ketadi)
  POST /api/v1/auth/login         → Admin login
  GET  /api/v1/auth/me            → Joriy admin
  ...  (barchasi /api/docs da ko'rinadi)
```
