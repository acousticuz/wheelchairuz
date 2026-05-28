const CATEGORY_VISUALS = {
  wheelchairs: { color: 'bg-blue-50 text-primary', icon: 'wheelchair_pickup' },
  walkers: { color: 'bg-teal-50 text-secondary', icon: 'blind' },
  canes: { color: 'bg-orange-50 text-tertiary-container', icon: 'nordic_walking' },
  support: { color: 'bg-slate-100 text-outline', icon: 'support' },
}

export function normalizeCategory(category, productCount = 0) {
  const visuals = CATEGORY_VISUALS[category.slug] || CATEGORY_VISUALS.support
  return {
    id: category.slug,
    slug: category.slug,
    icon: category.icon || visuals.icon,
    color: visuals.color,
    name_uz: category.name?.uz || category.slug,
    name_ru: category.name?.ru || category.slug,
    name_en: category.name?.en || category.slug,
    count: productCount,
  }
}

export function normalizeProduct(product) {
  return {
    id: product.id,
    slug: product.slug,
    category: product.category?.slug || product.categoryId || 'wheelchairs',
    badge: product.badge || null,
    image: product.mainImage || product.images?.[0] || '',
    images: product.images?.length ? product.images : [product.mainImage].filter(Boolean),
    name: product.name || { uz: '', ru: '', en: '' },
    excerpt: product.excerpt || product.description || { uz: '', ru: '', en: '' },
    description: product.description || { uz: '', ru: '', en: '' },
    price: Number(product.price || 0),
    showPrice: product.showPrice !== false,
    currency: 'UZS',
    rating: Number(product.rating || 0),
    reviews: Number(product.reviewCount || 0),
    sku: product.sku || '',
    specs: product.specs || [],
    tags: product.tags || [],
  }
}
