const fs = require('fs');
const path = require('path');
const sharp = require('../wheelchair-backend/node_modules/sharp');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'sayqal.json');
const OUT = path.join(__dirname, 'sayqal-products-seed.json');
const UPLOAD_DIR = path.join(ROOT, 'wheelchair-backend', 'uploads', 'products');

const CATEGORY_MAP = [
  [/yurish|ходун/i, 'walkers'],
  [/hassa|trost|трость|qoltiq|kostyl|костыл/i, 'canes'],
];

const TAGS = [
  [/elektr|электр|skuter|скутер/i, 'electric'],
  [/bolalar|дет/i, 'children'],
  [/sanitar|санитар/i, 'sanitary'],
  [/rollator|роллатор/i, 'rollator'],
  [/yigil|склад/i, 'foldable'],
];

function slugify(input) {
  const map = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'j', з: 'z', и: 'i', й: 'y',
    к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
    х: 'x', ц: 's', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: '', э: 'e', ю: 'yu', я: 'ya',
    ғ: 'g', қ: 'q', ў: 'o', ҳ: 'h',
  };
  return String(input || '')
    .toLowerCase()
    .replace(/[а-яёғқўҳ]/g, (ch) => map[ch] || ch)
    .replace(/o['‘’`]/g, 'o')
    .replace(/g['‘’`]/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function categorySlug(product) {
  const text = `${product.category?.uz || ''} ${product.category?.ru || ''} ${product.title?.uz || ''} ${product.title?.ru || ''}`;
  return CATEGORY_MAP.find(([rx]) => rx.test(text))?.[1] || 'wheelchairs';
}

function tags(product) {
  const text = `${product.category?.uz || ''} ${product.category?.ru || ''} ${product.title?.uz || ''} ${product.title?.ru || ''} ${product.description?.uz || ''} ${product.description?.ru || ''}`;
  const found = TAGS.filter(([rx]) => rx.test(text)).map(([, tag]) => tag);
  found.push(categorySlug(product).replace('wheelchairs', 'manual'));
  return [...new Set(found.filter(Boolean))];
}

function specs(product) {
  const uz = product.specifications?.SIZE?.items?.uz || [];
  const ru = product.specifications?.SIZE?.items?.ru || [];
  return uz.map((item, idx) => ({
    label_uz: item.label || '',
    label_ru: ru[idx]?.label || item.label || '',
    label_en: item.label || '',
    value: item.value || ru[idx]?.value || '',
  })).filter((item) => item.label_uz && item.value);
}

async function downloadWebp(url, filePath) {
  if (fs.existsSync(filePath)) return;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const input = Buffer.from(await res.arrayBuffer());
  const output = await sharp(input, { animated: true, failOn: 'none', limitInputPixels: false })
    .rotate()
    .webp({ quality: 84, effort: 4 })
    .toBuffer();
  fs.writeFileSync(filePath, output);
}

async function main() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const source = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  const products = [];

  for (let idx = 0; idx < source.products.length; idx += 1) {
    const product = source.products[idx];
    const slug = `${slugify(product.title?.uz || product.title?.ru)}-${product.id}`;
    const imageUrls = [];

    for (let i = 0; i < (product.images || []).length; i += 1) {
      const filename = `${slug}-${i + 1}.webp`;
      await downloadWebp(product.images[i], path.join(UPLOAD_DIR, filename));
      imageUrls.push(`/uploads/products/${filename}`);
    }

    products.push({
      slug,
      sku: `SAYQAL-${product.id}`,
      category_slug: categorySlug(product),
      name: {
        uz: product.title?.uz || '',
        ru: product.title?.ru || '',
        en: product.title?.uz || product.title?.ru || '',
      },
      excerpt: {
        uz: product.shortDescription?.uz || '',
        ru: product.shortDescription?.ru || '',
        en: product.shortDescription?.uz || product.shortDescription?.ru || '',
      },
      description: {
        uz: product.description?.uz || product.shortDescription?.uz || '',
        ru: product.description?.ru || product.shortDescription?.ru || '',
        en: product.description?.uz || product.description?.ru || '',
      },
      price: 0,
      showPrice: false,
      mainImage: imageUrls[0] || '',
      images: imageUrls,
      specs: specs(product),
      tags: tags(product),
      badge: idx < 4 ? 'new' : null,
      rating: Number(product.rating || 0),
      reviewCount: Number(product.reviews_count || 0),
      isActive: true,
      isFeatured: idx < 6,
      sortOrder: idx + 1,
      sourceUrl: product.url || '',
      ordersCount: Number(product.orders_count || 0),
    });
  }

  fs.writeFileSync(OUT, `${JSON.stringify({
    shop: source.shop,
    products_count: products.length,
    products,
  }, null, 2)}\n`);
  console.log(`Imported ${products.length} products and images -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
