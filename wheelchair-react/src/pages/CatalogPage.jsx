import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { categoriesApi, productsApi } from '../hooks/useApi'
import { normalizeCategory, normalizeProduct } from '../utils/publicData'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'

const PAGE_SIZE = 8
const FEATURED_CATEGORY_IDS = ['wheelchairs', 'walkers']

export default function CatalogPage() {
  const { t, lang } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [search, setSearch] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)

  const activeCategory = searchParams.get('cat') || 'all'
  const copy = {
    heroTitle: {
      uz: 'Siz uchun eng mos harakatlanish vositasini toping',
      ru: 'Найдите идеальное средство передвижения',
      en: 'Find Your Perfect Mobility Match',
    },
    heroSubtitle: {
      uz: 'Sizning qulayligingiz va mustaqilligingiz uchun sertifikatlangan mahsulotlar katalogi',
      ru: 'Каталог сертифицированных товаров для вашего комфорта и независимости',
      en: 'Browse our clinical-grade inventory of premium mobility equipment.',
    },
    all: { uz: 'Barchasi', ru: 'Все', en: 'All' },
    categoryDesc: {
      wheelchairs: {
        uz: 'Mexanik, elektr va bolalar aravachalari',
        ru: 'Механические, электрические и детские коляски',
        en: 'Manual, electric, and pediatric wheelchairs',
      },
      walkers: {
        uz: 'Barqarorlikka yo‘naltirilgan yurgichlar va rollatorlar',
        ru: 'Ходунки и роллаторы для устойчивости',
        en: 'Stability-focused walkers and rollators',
      },
      canes: {
        uz: 'Yengil tayanch vositalari',
        ru: 'Лёгкие опорные средства',
        en: 'Lightweight support tools',
      },
    },
    featureElectric: { uz: 'Elektr / Quvvatli', ru: 'Электро / С приводом', en: 'Electric / Power' },
    featureSport: { uz: 'Sport', ru: 'Спорт', en: 'Sport' },
    resetFilters: { uz: 'Filtrlarni tiklash', ru: 'Сбросить фильтры', en: 'Reset Filters' },
    notFoundTitle: { uz: 'Mahsulot topilmadi', ru: 'Товары не найдены', en: 'No products found' },
    notFoundText: {
      uz: "Filtrlarni o'zgartiring yoki boshqa qidiruvni sinab ko'ring",
      ru: 'Измените фильтры или попробуйте другой запрос',
      en: 'Change filters or try a different search query',
    },
    clear: { uz: 'Tozalash', ru: 'Очистить', en: 'Clear' },
    clearAll: { uz: 'Barchasini tozalash', ru: 'Очистить всё', en: 'Clear All' },
    modalCategory: { uz: 'Kategoriya', ru: 'Категория', en: 'Category' },
    modalFeatures: { uz: 'Xususiyatlar', ru: 'Характеристики', en: 'Features' },
  }

  const filtered = useMemo(() => {
    let list = [...products]
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (search) list = list.filter(p => p.name[lang].toLowerCase().includes(search.toLowerCase()))
    if (selectedFeatures.length) list = list.filter(p => selectedFeatures.every(f => p.tags.includes(f)))
    if (sortBy === 'price_low') list.sort((a, b) => a.price - b.price)
    if (sortBy === 'price_high') list.sort((a, b) => b.price - a.price)
    if (sortBy === 'newest') list.sort((a, b) => b.id - a.id)
    return list
  }, [activeCategory, search, selectedFeatures, sortBy, lang, products])

  const visibleCategories = useMemo(
    () => categories.filter((cat) => FEATURED_CATEGORY_IDS.includes(cat.id)),
    [categories],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, search, selectedFeatures, sortBy])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [productsRes, categoryRes] = await Promise.all([
          productsApi.list({ limit: 400, sort: 'newest' }),
          categoriesApi.list(),
        ])
        if (!active) return

        const productItems = (productsRes?.data || []).map(normalizeProduct)
        const counts = productItems.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1
          return acc
        }, {})
        setProducts(productItems)
        setCategories((categoryRes || []).map((c) => normalizeCategory(c, counts[c.slug] || 0)))
      } catch (err) {
        console.error('Failed to load catalog data', err)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const toggleFeature = (f) =>
    setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  return (
    <div className="pb-20 md:pb-0">
      {/* ── DESKTOP: Hero Search ── */}
      <section className="hidden md:block pt-24">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-on-surface-variant text-xs mb-8 uppercase tracking-wider">
            <Link to="/" className="hover:text-primary">{t('bottom_nav.home')}</Link>
            <Icon name="chevron_right" size={14} />
            <span className="text-primary font-semibold">{t('catalog.title')}</span>
          </nav>

          <div className="bg-surface-container-low rounded-3xl p-10 md:p-16 text-center space-y-8 mb-12">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tight">
                {copy.heroTitle[lang]}
              </h1>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
                {copy.heroSubtitle[lang]}
              </p>
            </div>
            <div className="max-w-3xl mx-auto relative">
              <Icon name="search" className="absolute left-6 top-1/2 -translate-y-1/2 text-outline" />
              <input
                className="w-full pl-16 pr-8 py-5 rounded-2xl bg-surface-container-lowest border-none shadow-ambient focus:ring-2 focus:ring-secondary/20 transition-all text-on-surface placeholder:text-outline text-lg outline-none"
                placeholder={t('catalog.search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Foldable', 'Electric', 'Bariatric', 'Sport'].map(tag => (
                <button key={tag} onClick={() => setSearch(tag)}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden pt-16 px-4">
        <div className="sticky top-16 bg-white/80 backdrop-blur-md z-30 pb-2">
          {/* Category tabs */}
          <div className="flex overflow-x-auto gap-6 py-3 hide-scrollbar border-b border-slate-50">
            <button onClick={() => setSearchParams({})}
              className={`whitespace-nowrap font-headline font-bold text-sm pb-1 ${
                activeCategory === 'all' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500'
              }`}>
              {copy.all[lang]}
            </button>
            {visibleCategories.map(cat => (
              <button key={cat.id} onClick={() => setSearchParams({ cat: cat.id })}
                className={`whitespace-nowrap font-headline font-bold text-sm pb-1 ${
                  activeCategory === cat.id ? 'text-blue-700 border-b-2 border-blue-700' : 'text-slate-500'
                }`}>
                {cat[`name_${lang}`]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-end my-6">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-primary tracking-tight">{t('catalog.title')}</h1>
            <p className="text-on-surface-variant text-sm mt-1">{t('catalog.found')} {filtered.length} {t('catalog.results')}</p>
          </div>
          <button onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-xl font-semibold text-sm">
            <Icon name="tune" size={18} /> {t('catalog.filters')}
          </button>
        </div>
      </div>

      {/* ── DESKTOP CATEGORIES ── */}
      <section className="hidden md:block">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-headline font-bold text-primary">{t('catalog.categories')}</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-12">
            {visibleCategories.map(cat => (
              <Link key={cat.id} to={`/catalog?cat=${cat.id}`}
                className={`group cursor-pointer bg-surface-container-lowest rounded-2xl overflow-hidden shadow-ambient hover:shadow-lg transition-all duration-300 ${
                  activeCategory === cat.id ? 'ring-2 ring-primary' : ''
                }`}>
                <div className="relative h-48">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    src={cat.id === 'wheelchairs'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEDh_g9FyrGxxzu7wDx2eXz8xneLLoW222LasW4nXAsa1THGPH4Fi_GS9gfb2jzfMiXI2WOjg93GmU2wwGZWsJoEfnWxPY_Wmh6A8jTpO2b9E6KB1Rz18V9msSGymMT_vgYtpQL5t_KIc9GADCGlXpZkJsnzQWcPJWI6jWPBAJwfqU1oaCEvBFxDlmSXFrBGnXgeV1qB23jS7vtb4IU_XmibhrNyrTnJIcM0kpLd782makm_aZdvHXp8V-OAD0hPiU1ge6xlHrGzU'
                      : cat.id === 'walkers'
                      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVlVioAE59my-5W1RirhSwj4EwB3sjJQ_cCbXgd99RkLIzzreI1FC6b5TMJ6-VUujiNH28Y6c-ZqmRl9U_Ai-TAMvfrx31QXpaUJQNWGH2dhguSGk7mZD4SWFm5lcqqmyGW0n9J6VD6mSHt7LQB648EOG6BfZKBBQJJ6Mi0PCD_ZFW49EzxNTetPDlHo4Q4SO2tfQaXFvzhCp-ggPH3AeQdEAqe1X1o7u4SjIsv54i0D91c-fzoCc9E49PaJnqITbgCyBjLZC-F4M'
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzAor-fZ7hiNPKHbEHSQlZiBXl5lKGK1NUrs94eh2STYUm66tGKt4edNPlejSPm7uILnJTNePxf_F-6YLMz8UxIvQGymBiXUO-pa8vwhbdyyoNNWO4lpoBEY2GBJasHISI9g1O7s-MpmiYB7B_-TbQFuiTURv1cYkkv-Om11IQ23biVQO0J16pcgeHBadFt9nia6X-3aF-6JoVr1zcl-LD3izgu4IPP2r6oSXfKgWijDinly4ZVmWS7yTRtoj0oGxA6P-JLpfuEGY'
                    }
                    alt={cat[`name_${lang}`]} />
                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                    {cat.count}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-headline font-bold text-primary mb-2">{cat[`name_${lang}`]}</h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{
                    cat.id === 'wheelchairs' ? copy.categoryDesc.wheelchairs[lang] :
                    cat.id === 'walkers' ? copy.categoryDesc.walkers[lang] :
                    copy.categoryDesc.canes[lang]
                  }</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESKTOP: Sidebar + Grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Desktop: result count + sort */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <p className="text-on-surface-variant text-sm">
            {t('catalog.found')} <span className="font-bold text-primary">{filtered.length}</span> {t('catalog.results')}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">{t('catalog.sort_by')}:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-bold text-primary focus:ring-0 cursor-pointer outline-none">
              <option value="popular">{t('catalog.most_popular')}</option>
              <option value="price_low">{t('catalog.price_low')}</option>
              <option value="newest">{t('catalog.newest')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 space-y-10 shrink-0">
            <div>
              <h4 className="font-headline font-bold text-primary mb-4 flex items-center justify-between">
                {t('catalog.categories')}
              </h4>
              <div className="space-y-2">
                <button onClick={() => setSearchParams({})}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === 'all' ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'
                  }`}>
                  {copy.all[lang]}
                </button>
                {visibleCategories.map(cat => (
                  <button key={cat.id} onClick={() => setSearchParams({ cat: cat.id })}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'
                    }`}>
                    {cat[`name_${lang}`]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-headline font-bold text-primary mb-4">{t('catalog.features')}</h4>
              <div className="space-y-3">
                {[
                  { id: 'foldable', label: t('catalog.foldable') },
                  { id: 'adjustable', label: t('catalog.adjustable') },
                  { id: 'all_terrain', label: t('catalog.all_terrain') },
                  { id: 'electric', label: copy.featureElectric[lang] },
                  { id: 'sport', label: copy.featureSport[lang] },
                ].map(f => (
                  <label key={f.id} className="flex items-center gap-3 group cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(f.id)}
                      onChange={() => toggleFeature(f.id)}
                      className="w-5 h-5 rounded border-outline-variant text-secondary focus:ring-secondary"
                    />
                    <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {(selectedFeatures.length > 0 || search) && (
              <button onClick={() => { setSelectedFeatures([]); setSearch('') }}
                className="w-full py-3 border border-outline-variant text-primary rounded-xl font-bold hover:bg-surface-container-low transition-colors text-sm">
                {copy.resetFilters[lang]}
              </button>
            )}
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Mobile list */}
            <div className="md:hidden grid grid-cols-2 gap-3">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-3 gap-5">
              {paginated.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length > PAGE_SIZE && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  disabled={page === 1}
                  className="h-10 w-10 rounded-lg border border-outline-variant text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low"
                >
                  <Icon name="chevron_left" size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
                  <button
                    key={item}
                    onClick={() => setPage(item)}
                    className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition-colors ${
                      page === item ? 'bg-primary text-on-primary' : 'border border-outline-variant text-primary hover:bg-surface-container-low'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                <button
                  onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                  disabled={page === totalPages}
                  className="h-10 w-10 rounded-lg border border-outline-variant text-primary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container-low"
                >
                  <Icon name="chevron_right" size={20} />
                </button>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-24">
                <Icon name="search_off" size={64} className="text-outline-variant mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary mb-2">{copy.notFoundTitle[lang]}</h3>
                <p className="text-on-surface-variant mb-6">{copy.notFoundText[lang]}</p>
                <button onClick={() => { setSelectedFeatures([]); setSearch(''); setSearchParams({}) }}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-xl">
                  {copy.clear[lang]}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER MODAL ── */}
      {filterOpen && (
        <div className="fixed inset-0 z-[60] bg-on-surface/20 backdrop-blur-sm">
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 shadow-2xl">
            <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-6" />
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-headline font-extrabold text-primary">{t('catalog.filters')}</h2>
              <button onClick={() => { setSelectedFeatures([]); setSearch('') }}
                className="text-primary font-bold text-sm">{copy.clearAll[lang]}</button>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="font-bold mb-4">{copy.modalCategory[lang]}</h3>
                <div className="flex flex-wrap gap-2">
                  {visibleCategories.map(cat => (
                    <button key={cat.id} onClick={() => setSearchParams({ cat: cat.id })}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
                      }`}>
                      {cat[`name_${lang}`]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4">{copy.modalFeatures[lang]}</h3>
                <div className="flex flex-wrap gap-2">
                  {['foldable', 'electric', 'sport', 'adjustable'].map(f => (
                    <button key={f} onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        selectedFeatures.includes(f) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
                      }`}>
                      {f === 'foldable'
                        ? t('catalog.foldable')
                        : f === 'electric'
                        ? copy.featureElectric[lang]
                        : f === 'sport'
                        ? copy.featureSport[lang]
                        : t('catalog.adjustable')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setFilterOpen(false)}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg mt-10 active:scale-95 transition-all">
              {t('catalog.found')} {filtered.length} {t('catalog.results')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
