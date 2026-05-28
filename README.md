# wheelchair.uz — To'liq loyiha

React + NestJS + PostgreSQL + Telegram Bot

---

## Tez ishga tushirish (Docker bilan)

### Talab: Docker Desktop o'rnatilgan bo'lsin

```bash
# 1. Barcha fayllarni bir papkaga soling:
#    wheelchair-backend/
#    wheelchair-react/
#    docker-compose.yml

# 2. Bitta buyruq bilan ishga tushiring
./wheelchair start

# To'xtatish / qayta yoqish
./wheelchair stop
./wheelchair restart

# Holat, loglar va URLlar
./wheelchair status
./wheelchair logs
./wheelchair urls

# Tayyor! Ochiladi:
#   http://localhost        → Sayt
#   http://localhost/admin  → Admin panel
#   http://localhost:3000/api/docs  → Swagger
```

**Admin:** `admin@wheelchair.uz` / `admin123`

### Ishga tushirish va toxtatishni avtomatlashtirish

```bash
# Lokal muhit
./wheelchair start
./wheelchair status
./wheelchair restart
./wheelchair stop
./wheelchair logs

# Production muhit
MODE=prod ./wheelchair start
MODE=prod ./wheelchair restart
MODE=prod ./wheelchair rebuild
```

Docker konteynerlarda `restart: unless-stopped` yoqilgan. Server qayta yoqilganda yoki process yiqilganda servislar avtomatik kotariladi. Backend holatini tekshirish endpointi: `http://localhost:3000/api/v1/health`.

---

## Manuel ishga tushirish (Docker isiz)

### 1. PostgreSQL

```bash
# PostgreSQL o'rnatilgan bo'lsin
createdb wheelchair_db
createuser wheelchair_user
psql -c "ALTER USER wheelchair_user WITH PASSWORD 'your_password';"
psql -c "GRANT ALL ON DATABASE wheelchair_db TO wheelchair_user;"
```

### 2. Backend

> Backend NestJS 11 bilan ishlaydi, manual ishga tushirish uchun Node.js 20+ kerak. Docker build allaqachon Node 20 ishlatadi.

```bash
cd wheelchair-backend
cp .env.example .env
# .env ni tahrirlang (kamida DB parol va JWT secret)
nano .env

npm install
npm run start:dev
# → http://localhost:3000/api/docs
```

### 3. Frontend

> Frontend Node.js 18.19+ bilan build qilinadi.

```bash
cd wheelchair-react
# .env.development ni tekshiring
# VITE_API_URL=http://localhost:3000/api/v1

npm install
npm run dev
# → http://localhost:5173
```

---

## .env to'ldirish tartibi

```bash
cd wheelchair-backend
cp .env.example .env
```

**Majburiy o'zgartiriladigan qatorlar:**

| Kalit | Nima kiritish |
|-------|---------------|
| `DB_PASSWORD` | PostgreSQL parol |
| `JWT_SECRET` | Kamida 64 ta tasodifiy belgi |
| `ADMIN_PASSWORD` | Admin panel paroli |
| `TELEGRAM_BOT_TOKEN` | @BotFather dan olingan token |
| `TELEGRAM_ADMIN_CHAT_ID` | Bot bilan `/start` bosib olinadigan ID |

**Telegram bot sozlash:**
1. Telegram'da `@BotFather` ga `/newbot` yuboring
2. Bot nomini kiriting, token oling
3. `.env` ga yozing: `TELEGRAM_BOT_TOKEN=...`
4. Botni ochib `/start` yuboring
5. Kelgan `chat ID` ni yozing: `TELEGRAM_ADMIN_CHAT_ID=...`
6. Backend restart qiling

---

## API Endpoints

```
Ommaviy (token shart emas):
  GET  /api/v1/categories           Kategoriyalar
  GET  /api/v1/categories/:slug     Bir kategoriya
  GET  /api/v1/products             Mahsulotlar (filter, search, page)
  GET  /api/v1/products/:slug       Bir mahsulot
  GET  /api/v1/products/:slug/related  O'xshash mahsulotlar
  POST /api/v1/inquiries            Forma yuborish → Telegram xabar

Admin (Bearer token kerak):
  POST   /api/v1/auth/login         Kirish → token olish
  GET    /api/v1/auth/me            Joriy admin
  GET    /api/v1/products/admin/all Barcha mahsulotlar (nofaollar ham)
  POST   /api/v1/products           Yangi mahsulot
  PUT    /api/v1/products/:id       Mahsulotni yangilash
  PATCH  /api/v1/products/:id/toggle Faol/nofaol
  DELETE /api/v1/products/:id       O'chirish
  GET    /api/v1/categories         ...
  POST   /api/v1/categories         ...
  GET    /api/v1/inquiries          So'rovlar ro'yxati
  GET    /api/v1/inquiries/stats    Statistika
  PUT    /api/v1/inquiries/:id      Holat yangilash
  DELETE /api/v1/inquiries/:id      O'chirish
  POST   /api/v1/media/upload       Rasm yuklash
  GET    /api/v1/media              Rasmlar ro'yxati
  DELETE /api/v1/media/:id          Rasm o'chirish
```

---

## VPS ga Deploy qilish

```bash
# 1. Server tayyorlash
apt-get update && apt-get install -y nginx certbot python3-certbot-nginx postgresql nodejs npm
npm install -g pm2

# 2. PostgreSQL
sudo -u postgres psql
  CREATE USER wheelchair_user WITH PASSWORD 'STRONG_PASSWORD';
  CREATE DATABASE wheelchair_db OWNER wheelchair_user;
  \q

# 3. Backend
mkdir -p /var/www/wheelchair-backend
# — kodni serverga ko'chiring —
cd /var/www/wheelchair-backend
cp .env.example .env && nano .env   # to'ldiring
npm install && npm run build
pm2 start ecosystem.config.js
pm2 save && pm2 startup

# 4. Frontend
cd wheelchair-react && npm run build
mkdir -p /var/www/wheelchair-frontend
cp -r dist/* /var/www/wheelchair-frontend/

# 5. Nginx
cp wheelchair-backend/nginx.conf /etc/nginx/sites-available/wheelchair-uz
ln -sf /etc/nginx/sites-available/wheelchair-uz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 6. SSL
certbot --nginx -d wheelchair.uz -d www.wheelchair.uz -d admin.wheelchair.uz

# 7. Test
curl https://wheelchair.uz/api/v1/categories
```

---

## Loyiha tuzilmasi

```
wheelchair-backend/
├── src/
│   ├── main.ts                Swagger, CORS, ValidationPipe
│   ├── app.module.ts          TypeORM, Throttler, ServeStatic
│   ├── config/
│   │   ├── app.config.ts      .env o'quvchi
│   │   └── database.seeder.ts Admin + kategoriya + mahsulot seed
│   └── modules/
│       ├── auth/              JWT login/strategy/guard
│       ├── users/             User entity + service
│       ├── categories/        CRUD
│       ├── products/          CRUD + filter + paginate
│       ├── inquiries/         Contact form → Telegram
│       ├── telegram/          Bot service
│       └── media/             Rasm upload (multer)
├── .env.example               ← .env ga nusxa olib to'ldiring
├── ecosystem.config.js        PM2 cluster config
├── nginx.conf                 Nginx VPS config
├── Dockerfile                 Docker image
└── DEPLOY.md                  Batafsil deploy qo'llanma

wheelchair-react/
├── src/
│   ├── hooks/
│   │   ├── useApi.js          API client (auth, products, inquiries, media)
│   │   └── useLang.jsx        UZ/RU/EN til tizimi
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── CatalogPage.jsx
│   │   ├── ProductPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx    → real API
│   │   └── admin/
│   │       ├── AdminLogin.jsx    → real API
│   │       ├── AdminDashboard.jsx → real API
│   │       ├── AdminProducts.jsx  → real API
│   │       └── AdminInquiries.jsx → real API
│   └── components/
├── .env.development           VITE_API_URL=http://localhost:3000/api/v1
├── .env.production            VITE_API_URL=/api/v1
├── Dockerfile
└── nginx-docker.conf

docker-compose.yml             Lokal dev uchun
```
