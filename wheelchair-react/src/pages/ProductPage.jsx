import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { productsApi } from '../hooks/useApi'
import { normalizeProduct } from '../utils/publicData'
import ProductCard from '../components/ProductCard'
import Icon from '../components/Icon'

export default function ProductPage() {
  const { slug } = useParams()
  const { t, lang } = useLang()
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)
  const [activeTab, setActiveTab] = useState('specs')
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const copy = {
    notFoundTitle: { uz: 'Mahsulot topilmadi', ru: 'Товар не найден', en: 'Product not found' },
    backCatalog: { uz: 'Katalogga qaytish', ru: 'Вернуться в каталог', en: 'Back to catalog' },
    premiumSeries: { uz: 'Premium seriya', ru: 'Премиум серия', en: 'Premium Series' },
    tabDescription: { uz: 'Tavsif', ru: 'Описание', en: 'Description' },
    tabDelivery: { uz: 'Yetkazib berish', ru: 'Доставка', en: 'Delivery' },
    priceLabel: { uz: 'Narx', ru: 'Цена', en: 'Price' },
    priceOnRequest: { uz: "Narxni aniqlash uchun bog'laning", ru: 'Уточните цену у менеджера', en: 'Contact us for price' },
    messageAboutProduct: {
      uz: 'Mahsulot bo‘yicha xabar yozish',
      ru: 'Написать по товару',
      en: 'Send message about this product',
    },
    delivery: [
      {
        icon: 'local_shipping',
        title: { uz: "O'zbekiston bo'ylab yetkazish", ru: 'Доставка по Узбекистану', en: 'Delivery across Uzbekistan' },
        text: { uz: '3-7 ish kuni ichida', ru: 'В течение 3-7 рабочих дней', en: 'Within 3-7 business days' },
      },
      {
        icon: 'verified',
        title: { uz: 'Kafolat', ru: 'Гарантия', en: 'Warranty' },
        text: { uz: '12-24 oy kafolat', ru: 'Гарантия 12-24 месяца', en: '12-24 months warranty' },
      },
      {
        icon: 'sync',
        title: { uz: 'Qaytarish', ru: 'Возврат', en: 'Returns' },
        text: { uz: '14 kun ichida qaytarish imkoniyati', ru: 'Возврат в течение 14 дней', en: '14-day return option' },
      },
      {
        icon: 'support_agent',
        title: { uz: 'Texnik yordam', ru: 'Техподдержка', en: 'Technical support' },
        text: { uz: 'Uzluksiz xizmat', ru: 'Круглосуточный сервис', en: 'Continuous support service' },
      },
    ],
  }

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const [productRes, relatedRes] = await Promise.all([
          productsApi.get(slug),
          productsApi.related(slug),
        ])
        if (!active) return
        setProduct(normalizeProduct(productRes))
        setRelated((relatedRes || []).map(normalizeProduct))
      } catch (err) {
        console.error('Failed to load product details', err)
        if (active) {
          setProduct(null)
          setRelated([])
          setNotFound(true)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    if (slug) load()
    return () => {
      active = false
    }
  }, [slug])

  useEffect(() => {
    setActiveImg(0)
    setActiveTab('specs')
  }, [slug])

  if (loading) return (
    <div className="pt-32 text-center">
      <p className="text-on-surface-variant">{t('catalog.found')}...</p>
    </div>
  )

  if (notFound || !product) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold text-primary mb-4">{copy.notFoundTitle[lang]}</h2>
      <button onClick={() => navigate('/catalog')} className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
        {copy.backCatalog[lang]}
      </button>
    </div>
  )

  const formatPrice = (price) =>
    new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ').format(price) + ' UZS'

  return (
    <div className="pb-32 md:pb-0 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <nav className="mb-4 md:mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar text-[11px] md:text-xs font-medium text-outline md:uppercase tracking-normal md:tracking-wider pb-1">
          <Link to="/" className="hover:text-primary">{t('bottom_nav.home')}</Link>
          <Icon name="chevron_right" size={14} />
          <Link to="/catalog" className="hover:text-primary">{t('nav.catalog')}</Link>
          <Icon name="chevron_right" size={14} />
          <span className="text-primary">{product.name[lang]}</span>
        </nav>

        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">

          {/* ── Gallery ── */}
          <div className="lg:col-span-7">
            {/* Mobile carousel */}
            <div className="md:hidden relative -mx-4 bg-surface-container-low overflow-hidden">
              <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
                {product.images.map((img, i) => (
                  <div key={i} className="flex-shrink-0 w-full snap-center aspect-square">
                    <img className="w-full h-full object-contain p-4" src={img} alt={`${product.name[lang]} ${i + 1}`} />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full bg-primary ${i === 0 ? 'w-6' : 'w-1.5 opacity-30'}`} />
                ))}
              </div>
            </div>

            {/* Desktop gallery */}
            <div className="hidden md:block space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low ambient-shadow group relative">
                <img className="block w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
                  src={product.images[activeImg]} alt={product.name[lang]} />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary tracking-widest uppercase">
                    {copy.premiumSeries[lang]}
                  </div>
                )}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`group relative shrink-0 w-[17%] min-w-[86px] max-w-[104px] aspect-square rounded-xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                      activeImg === i
                        ? 'border-primary ring-2 ring-primary/25 bg-white shadow-md'
                        : 'border-outline-variant/25 bg-white hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    <img className="w-full h-full object-contain p-4" src={img} alt={`${product.name[lang]} ${i + 1}`} />
                    {activeImg === i && (
                      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Info Panel ── */}
          <div className="lg:col-span-5 space-y-6 px-0 md:px-0 mt-4 md:mt-0">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">SKU: {product.sku}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface leading-tight">
                {product.name[lang]}
              </h1>
              <p className="text-on-surface-variant font-body leading-relaxed line-clamp-2">{product.excerpt?.[lang] || product.description[lang]}</p>

              <div className="mt-4 rounded-2xl border border-primary/20 bg-white shadow-sm px-4 py-3">
                <p className="text-[11px] uppercase tracking-wider text-outline font-bold mb-1">{copy.priceLabel[lang]}</p>
                <p className="text-2xl md:text-3xl font-black font-headline text-primary">
                  {product.showPrice !== false ? formatPrice(product.price) : copy.priceOnRequest[lang]}
                </p>
              </div>
            </div>

            {/* Bento specs */}
            <div className="grid grid-cols-2 gap-4">
              {product.specs.slice(0, 2).map((spec, i) => (
                <div key={i} className={`bg-surface-container-low p-4 rounded-xl border-l-4 ${i === 0 ? 'border-secondary' : 'border-primary'}`}>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">
                    {spec[`label_${lang}`] || spec.label_en}
                  </span>
                  <span className="text-xl font-bold text-primary font-headline">{spec.value}</span>
                </div>
              ))}
            </div>

            <Link
              to={`/contact?product=${encodeURIComponent(product.name[lang])}`}
              className="w-full signature-gradient text-on-primary font-bold py-5 rounded-xl ambient-shadow active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Icon name="chat" />
              {copy.messageAboutProduct[lang]}
            </Link>

            {/* PDF */}
            <div>
              <button
                className="w-full bg-surface-container-highest text-primary font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
              >
                <Icon name="picture_as_pdf" className="text-error" />
                {t('product.tech_sheet')}
              </button>
            </div>

            {/* Clinical note */}
            <div className="p-5 bg-tertiary-fixed rounded-xl flex items-start gap-4">
              <Icon name="info" className="text-tertiary" size={32} />
              <div>
                <h4 className="font-bold text-tertiary font-headline mb-1">{t('product.clinical_support')}</h4>
                <p className="text-sm text-tertiary/80">{t('product.clinical_text')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs: Specs ── */}
        <div className="mt-10 md:mt-16 space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant pb-4">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-surface-container-low p-1 md:flex md:bg-transparent md:p-0 md:gap-6">
              {['specs', 'description', 'delivery'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`min-h-11 rounded-lg px-2 text-center font-headline font-bold text-[12px] md:text-lg md:rounded-none md:px-0 md:pb-2 md:border-b-2 transition-colors ${
                    activeTab === tab ? 'bg-white text-primary shadow-sm md:bg-transparent md:shadow-none md:border-primary' : 'text-on-surface-variant md:border-transparent hover:text-primary'
                  }`}>
                  {tab === 'specs' ? t('product.specifications') : tab === 'description' ? copy.tabDescription[lang] : copy.tabDelivery[lang]}
                </button>
              ))}
            </div>
            <p className="hidden md:block text-outline font-medium text-sm">{t('product.compliance')}</p>
          </div>

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-x-16 md:gap-y-2">
              {product.specs.map((spec, i) => (
                <div key={i} className="rounded-xl border border-surface-container-high bg-white p-3 md:flex md:flex-row md:justify-between md:gap-4 md:border-0 md:border-b md:bg-transparent md:px-2 md:py-4 md:hover:bg-surface-container-low md:transition-colors">
                  <span className="block text-[11px] leading-snug text-on-surface-variant font-semibold md:text-sm md:font-medium">{spec[`label_${lang}`] || spec.label_en}</span>
                  <span className="mt-1 block text-sm leading-tight text-primary font-extrabold md:mt-0 md:text-on-surface md:text-base md:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'description' && (
            <div className="max-w-2xl rounded-xl bg-surface-container-low p-4 md:bg-transparent md:p-0">
              <p className="text-on-surface-variant leading-relaxed text-base md:text-lg">{product.description[lang]}</p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-2xl">
              {copy.delivery.map(item => (
                <div key={item.title[lang]} className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon name={item.icon} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{item.title[lang]}</h4>
                    <p className="text-sm text-on-surface-variant">{item.text[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold font-headline text-on-surface">{t('product.related')}</h3>
              <Link to="/catalog" className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                {t('product.view_all_category')} <Icon name="arrow_forward" size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
