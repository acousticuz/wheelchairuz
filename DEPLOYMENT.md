# wheelchair.uz — Hostingga joylash (Node.js + MySQL)

Bu loyiha **NestJS (Node.js)** backend va **React (Vite)** frontend'dan iborat.
Ma'lumotlar bazasi **MySQL**'ga moslangan. "Oddiy PHP hosting" bilan birga
**Node.js qo'llab-quvvatlaydigan** (masalan, cPanel "Setup Node.js App") hostingga
joylash uchun quyidagi qadamlardan boring.

> Eslatma: faqat PHP ishlovchi (Node.js'siz) hostingga bu dasturni joylab
> bo'lmaydi — backend Node.js'da ishlaydi. Sizning hostingda Node.js bor, shu
> sababli bitta Node ilovasi hamma narsani (API + sayt + rasmlar) beradi.

## 1. Talablar

- **Node.js 18+** (hostingda mavjud)
- **MySQL 8.0.13+** yoki **MariaDB 10.4.3+** (JSON ustunlar uchun shart)

## 2. Lokalda build qilish

```bash
# Backend
cd wheelchair-backend
npm install
npm run build          # -> dist/

# Frontend
cd ../wheelchair-react
npm install
npm run build          # -> dist/

# Build qilingan saytni backend ichiga "client" deb nusxalang
cd ..
cp -r wheelchair-react/dist wheelchair-backend/client
```

Natijada `wheelchair-backend/` papkasi quyidagilarni o'z ichiga oladi:
`dist/` (kompilyatsiya), `client/` (React sayt), `uploads/` (mahsulot rasmlari),
`scripts/sayqal-products-seed.json`, `package.json`, `node_modules/`.

## 3. Hostingga yuklash

Hostingdagi Node ilova papkasiga (masalan `~/wheelchairuz/`) quyidagilarni yuklang:

- `dist/`
- `client/`
- `uploads/`  ← mahsulot rasmlari shu yerda (90 ta `.webp`)
- `scripts/`
- `package.json` va `package-lock.json`
- `.env` (4-bo'limga qarang)

`node_modules`ni hostingda o'rnatish tavsiya etiladi:
```bash
npm ci --omit=dev    # yoki: npm install --production
```

## 4. `.env` faylini sozlash

`wheelchair-backend/.env.example`dan nusxa oling va to'ldiring:

```env
PORT=3000
NODE_ENV=production

DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=wheelchair_user
DB_PASSWORD=KUCHLI_PAROL
DB_DATABASE=wheelchair_db

# Birinchi marta jadval yaratish uchun (pastga qarang)
DB_SYNC=false

JWT_SECRET=KAMIDA_64_BELGILI_TASODIFIY_SATR
ADMIN_EMAIL=admin@wheelchair.uz
ADMIN_PASSWORD=KUCHLI_ADMIN_PAROL

FRONTEND_URL=https://wheelchair.uz
ADMIN_URL=https://wheelchair.uz
SWAGGER_ENABLED=false
```

## 5. Ma'lumotlar bazasini tayyorlash

cPanel "MySQL Databases" bo'limidan bazani va foydalanuvchini yarating
(`wheelchair_db`, `wheelchair_user`), foydalanuvchiga bazaga to'liq huquq bering.

Jadvallar **TypeORM** orqali avtomatik yaratiladi. Migratsiya yo'q, shuning uchun
**bir martagina** sxemani sinxronlash kerak:

```bash
# Faqat BIRINCHI ishga tushirishda — jadval + admin + kategoriya + mahsulotlarni yaratadi:
DB_SYNC=true SEED_PRODUCTS=true NODE_ENV=development node dist/main.js
# Konsolda "Database seeding complete" va "Server running" chiqqach to'xtating (Ctrl+C).
```

So'ng `.env`da `NODE_ENV=production` va `DB_SYNC=false` qilib qo'ying
(`DB_SYNC` production'da xavfsizlik uchun umuman ishlamaydi).

> `SEED_PRODUCTS=true` — SAYQAL katalogidan 20 ta demo mahsulotni yuklaydi.
> Keyin uni `false` qiling (yoki olib tashlang).

## 6. cPanel "Setup Node.js App"

1. **Application root**: yuklagan papka (masalan `wheelchairuz`)
2. **Application URL**: domeningiz (masalan `wheelchair.uz`)
3. **Application startup file**: `dist/main.js`
4. **Node.js version**: 18 yoki undan yuqori
5. **Environment variables**: `.env`dagi qiymatlarni shu yerga ham kiriting
   (yoki ilova `.env` faylini o'qiydi).
6. **Run NPM Install** tugmasini bosing, so'ng **Restart**.

Ilova ishga tushgach, `https://wheelchair.uz` saytni ko'rsatadi,
`https://wheelchair.uz/api/v1/...` API'ni, `https://wheelchair.uz/uploads/...`
rasmlarni beradi — barchasi bitta Node jarayonidan.

## 7. Tekshirish

- `https://domen/` → sayt ochiladi
- `https://domen/api/v1/products` → JSON mahsulotlar ro'yxati
- `https://domen/api/docs` → faqat `SWAGGER_ENABLED=true` bo'lsa
- Admin panelga `ADMIN_EMAIL` / `ADMIN_PASSWORD` bilan kiring

## Eslatmalar

- **Postgres**'ga qaytmoqchi bo'lsangiz: `.env`da `DB_TYPE=postgres`, `DB_PORT=5432`
  qiling va `pg` paketi allaqachon o'rnatilgan.
- Rasmlar `uploads/` papkasida saqlanadi — uni hostingda **yozish huquqi bilan**
  saqlang (admin paneldan yangi rasm yuklash uchun).
- Sxema o'zgarsa, qayta `DB_SYNC=true` (development'da) bir marta ishga tushiring,
  yoki TypeORM migratsiyalarini qo'shing.
