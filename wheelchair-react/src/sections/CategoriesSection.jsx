import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import BentoCard from '../components/BentoCard'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

const SLUG_ALIASES = { 'canes-crutches': 'canes' }
const TONES = ['dark', 'light', 'sand', 'brand']

const CATEGORY_IMAGES = {
  wheelchairs:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAt_5sBkZ1vKwv-azhrF_1PtT7fD9ec-dBWn9nQUIhoD078Bc9Iuo6Ute9IvS4Ig0ydHjKvcjaLotWXhsDLbTWWrccJkfeEhNoqSNBEKb7zJpUyaUaftL2R3tO40mgYqWoqjyMoNCDhBgMvNkIfnQ4dVR3jpaS6J4BonOZ7DKZcwSrfCvT1pYXzqj92aAc1MkqJsQhVqSIyiS9GNYRNIKmdjV6QR6gpPd4w3W80Y5RPKmcmA9qZJX87sosnsRBsiBkdz5uUOpODBlA',
  walkers:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDGr5NxUVvGnoZspdMoVcGhwQuGcWLd8fYo_0eAc4Gbv5E9xWmIuf3ZBWnFngGoXJk70V7kE1VCq3Y19vJYZyRWX1uHbSjGKoxhUpSLnonyE_ge1xjfyRJDaRVRchbQt-OdfT5bBV3PzIKNVFyfrIWVt2xa3Zagm2z2uC1_wgIU0BSk9UXwYCRXORkHWaiFgoCm8Kf0AOEU45CrZ7rPhexJRErZ8aoZBRrwH5MN7AQSJH7ODte6kSoHep0O76MM3xIfmwQuHmOqF5E',
  canes:
    'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1200&q=80',
  newest:
    'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80',
}

const FALLBACK_DESC = {
  wheelchairs: {
    uz: 'Mexanik va elektr yurituvchi modellar',
    ru: 'Механические и электрические модели',
    en: 'Manual and electric models',
  },
  walkers: {
    uz: 'Xavfsiz va ishonchli tayanch vositalari',
    ru: 'Безопасные и надёжные средства опоры',
    en: 'Safe and reliable support tools',
  },
  canes: {
    uz: "Yurish uchun hassa va qo'ltiqtayoqlar",
    ru: 'Трости и костыли для ходьбы',
    en: 'Canes and crutches for walking',
  },
}

const NEWEST_CARD = {
  title: { uz: 'Yangi kelganlar', ru: 'Новинки', en: 'New arrivals' },
  description: {
    uz: "Eng so'nggi qo'shilgan modellar",
    ru: 'Самые свежие модели в каталоге',
    en: 'Latest additions to the catalogue',
  },
  badge: { uz: 'Yangi', ru: 'Новое', en: 'New' },
}

const VIEW_ALL = { uz: 'Barchasini ko‘rish', ru: 'Смотреть все', en: 'View all' }
const MODELS = { uz: 'ta model', ru: 'моделей', en: 'models' }

export default function CategoriesSection({ settings = {}, categories = [], categoryCounts = {} }) {
  const { lang } = useLang()
  const label = tx(settings.label, lang)
  const heading = tx(settings.heading, lang)
  const subtitle = tx(settings.subtitle, lang)
  const max = Number(settings.max) || 4
  const excludeSlugs = new Set(settings.excludeSlugs || [])
  const includeNewest = settings.includeNewestCard !== false

  // Build real categories — dedupe by alias and drop excluded slugs
  const realMap = new Map()
  for (const cat of categories) {
    if (!cat) continue
    if (excludeSlugs.has(cat.slug)) continue
    const id = SLUG_ALIASES[cat.slug] || cat.slug
    const count = categoryCounts[cat.slug] || 0
    const existing = realMap.get(id)
    if (existing) {
      existing.count = (existing.count || 0) + count
    } else {
      realMap.set(id, { ...cat, slug: id, count })
    }
  }
  const real = Array.from(realMap.values()).slice(0, max)

  const items = real.map((cat) => {
    const name = cat.name?.[lang] || cat.name?.uz || cat.slug
    return {
      title: name,
      description: tx(FALLBACK_DESC[cat.slug], lang) || '',
      image: CATEGORY_IMAGES[cat.slug],
      imageAlt: name,
      badge: cat.count
        ? { label: `${cat.count} ${tx(MODELS, lang)}`, icon: 'inventory_2' }
        : null,
      href: `/catalog?cat=${cat.slug}`,
      icon: cat.icon,
      cta: tx(VIEW_ALL, lang),
      ariaLabel: `${name} — ${tx(VIEW_ALL, lang)}`,
    }
  })

  if (items.length < max && includeNewest) {
    items.push({
      title: tx(NEWEST_CARD.title, lang),
      description: tx(NEWEST_CARD.description, lang),
      image: CATEGORY_IMAGES.newest,
      imageAlt: tx(NEWEST_CARD.title, lang),
      badge: { label: tx(NEWEST_CARD.badge, lang), icon: 'auto_awesome' },
      href: '/catalog?sort=newest',
      icon: 'auto_awesome',
      cta: tx(VIEW_ALL, lang),
      ariaLabel: `${tx(NEWEST_CARD.title, lang)} — ${tx(VIEW_ALL, lang)}`,
    })
  }

  const cards = items.slice(0, max).map((it, i) => ({
    ...it,
    tone: TONES[i % TONES.length],
    variant: 'compact',
  }))

  return (
    <section className="relative py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div className="flex-1 max-w-2xl">
            {label ? (
              <span className="inline-block text-[11px] uppercase tracking-[0.22em] font-bold text-brand-orange mb-2">
                {label}
              </span>
            ) : null}
            {heading ? (
              <h2 className="text-[28px] md:text-5xl font-headline font-extrabold tracking-tight text-brand-ink leading-[1.05]">
                {heading}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="mt-3 text-sm md:text-base text-on-surface-variant max-w-xl leading-relaxed">
                {subtitle}
              </p>
            ) : null}
          </div>
          <Link
            to="/catalog"
            aria-label={tx(VIEW_ALL, lang)}
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-green hover:text-brand-blue rounded-md self-start md:self-end transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            {tx(VIEW_ALL, lang)}
            <Icon name="arrow_forward" size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {cards.map((c) => (
              <BentoCard key={c.href} {...c} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-h-[200px] md:min-h-[280px] rounded-[28px] bg-surface-container animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
