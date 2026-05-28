import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import BentoCard from '../components/BentoCard'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

const TONES = ['dark', 'light', 'sand', 'brand']
const VIEW_ALL = { uz: 'Barchasini ko‘rish', ru: 'Смотреть все', en: 'View all' }
const NEW_BADGE = { uz: 'Yangi', ru: 'Новинка', en: 'New' }
const VIEW_DETAILS = { uz: 'Batafsil', ru: 'Подробнее', en: 'View details' }

export default function FeaturedSection({ settings = {}, products = [] }) {
  const { lang } = useLang()
  const label = tx(settings.label, lang)
  const heading = tx(settings.heading, lang)
  const subtitle = tx(settings.subtitle, lang)
  const max = Number(settings.max) || 4

  const items = products.slice(0, max).map((p, i) => {
    const name = p.name?.[lang] || p.name?.uz || ''
    const excerpt = p.excerpt?.[lang] || p.excerpt?.uz || ''
    return {
      title: name,
      description: excerpt,
      image: p.image,
      imageAlt: name,
      badge: p.badge ? { label: p.badge } : { label: tx(NEW_BADGE, lang), icon: 'auto_awesome' },
      href: `/products/${p.slug}`,
      tone: TONES[i % TONES.length],
      variant: 'compact',
      cta: tx(VIEW_DETAILS, lang),
      priceLabel:
        p.showPrice !== false && p.price
          ? `${new Intl.NumberFormat('uz-UZ').format(p.price)} UZS`
          : null,
      ariaLabel: `${name} — ${tx(VIEW_DETAILS, lang)}`,
    }
  })

  return (
    <section className="relative py-12 md:py-20 px-4 md:px-6 md:bg-white border-t border-outline-variant/15 overflow-hidden">
      <div className="hidden md:block glow-orb glow-orb-primary w-[400px] h-[400px] -top-32 -left-32 opacity-25" />
      <div className="relative max-w-container mx-auto">
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

        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {items.map((p) => (
              <BentoCard key={p.href} {...p} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-h-[260px] md:min-h-[320px] rounded-[28px] bg-surface-container animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
