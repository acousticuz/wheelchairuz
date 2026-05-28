import { Link } from 'react-router-dom'
import Icon from './Icon'
import SmartImage from './SmartImage'

const OVERLAY_HEIGHTS = {
  feature: 'min-h-[360px] md:min-h-[460px]',
  standard: 'min-h-[360px] md:min-h-[460px]',
}

const SPLIT_IMAGE_RATIO = {
  compact: 'aspect-[4/3]',
  product: 'aspect-[4/3]',
}

const TONES = {
  dark: {
    overlay:
      'bg-gradient-to-t from-black/75 via-black/35 to-black/10 group-hover:from-black/80',
    title: 'text-white',
    description: 'text-white/85',
    cta: 'text-brand-orange',
    badgeBg: 'bg-white/15 text-white ring-1 ring-inset ring-white/25',
    iconBg: 'bg-white/15 text-white ring-1 ring-inset ring-white/25',
  },
  brand: {
    overlay:
      'bg-gradient-to-t from-brand-blue/85 via-brand-blue/45 to-transparent group-hover:from-brand-blue/90',
    title: 'text-white',
    description: 'text-white/85',
    cta: 'text-brand-orange',
    badgeBg: 'bg-white/15 text-white ring-1 ring-inset ring-white/25',
    iconBg: 'bg-white/15 text-white ring-1 ring-inset ring-white/25',
  },
  light: {
    overlay:
      'bg-gradient-to-t from-white via-white/70 to-transparent group-hover:from-white',
    title: 'text-brand-ink',
    description: 'text-on-surface-variant',
    cta: 'text-brand-green',
    badgeBg: 'bg-brand-ink/10 text-brand-ink ring-1 ring-inset ring-brand-ink/15',
    iconBg: 'bg-brand-blue text-white',
  },
  sand: {
    overlay:
      'bg-gradient-to-t from-[#FFF7EE] via-[#FFF7EE]/60 to-transparent group-hover:from-[#FFF7EE]',
    title: 'text-brand-ink',
    description: 'text-on-surface-variant',
    cta: 'text-brand-orange',
    badgeBg: 'bg-brand-orange/15 text-brand-orange ring-1 ring-inset ring-brand-orange/25',
    iconBg: 'bg-brand-orange text-white',
  },
}

const SPLIT_BG = {
  dark: 'bg-brand-ink text-white',
  brand: 'bg-brand-blue text-white',
  light: 'bg-white text-brand-ink',
  sand: 'bg-[#FFF7EE] text-brand-ink',
}

const SPLIT_IMAGE_BG = {
  dark: 'bg-brand-ink/5',
  brand: 'bg-brand-blue/5',
  light: 'bg-surface-container-low',
  sand: 'bg-[#FFF7EE]',
}

const SPLIT_CTA = {
  dark: 'text-brand-orange',
  brand: 'text-brand-orange',
  light: 'text-brand-green',
  sand: 'text-brand-orange',
}

const SPLIT_DESC = {
  dark: 'text-white/70',
  brand: 'text-white/70',
  light: 'text-on-surface-variant',
  sand: 'text-on-surface-variant',
}

const SPLIT_BADGE = {
  dark: 'bg-white/90 text-brand-ink',
  brand: 'bg-white/90 text-brand-blue',
  light: 'bg-brand-ink text-white',
  sand: 'bg-brand-orange text-white',
}

export default function BentoCard({
  title,
  description,
  badge,
  image,
  href = '#',
  icon,
  cta,
  priceLabel,
  variant = 'standard',
  tone = 'dark',
  className = '',
  ariaLabel,
  imageAlt,
}) {
  const t = TONES[tone] || TONES.dark
  const isSplit = variant === 'compact' || variant === 'product'

  const baseLink =
    'group relative isolate flex flex-col overflow-hidden rounded-[24px] md:rounded-[28px] bg-white shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-300'

  // ── SPLIT LAYOUT (compact + product) ────────────────────────
  if (isSplit) {
    const ratio = SPLIT_IMAGE_RATIO[variant]
    const splitBg = SPLIT_BG[tone] || SPLIT_BG.light
    const imgBg = SPLIT_IMAGE_BG[tone] || SPLIT_IMAGE_BG.light
    const splitCta = SPLIT_CTA[tone] || SPLIT_CTA.light
    const splitDesc = SPLIT_DESC[tone] || SPLIT_DESC.light
    const splitBadge = SPLIT_BADGE[tone] || SPLIT_BADGE.light

    return (
      <Link
        to={href}
        aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
        className={`${baseLink} ${splitBg} ${className}`}
      >
        {/* Image */}
        <div className={`relative w-full ${ratio} overflow-hidden ${imgBg}`}>
          <SmartImage
            src={image}
            alt={imageAlt || (typeof title === 'string' ? title : '')}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            placeholderClass="absolute inset-0"
            placeholderIcon="image"
          />

          {badge ? (
            <span
              className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${splitBadge}`}
            >
              {badge.icon ? <Icon name={badge.icon} size={11} /> : null}
              {badge.label}
            </span>
          ) : null}

          {icon ? (
            <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-brand-ink shadow-sm backdrop-blur">
              <Icon name={icon} size={16} />
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3.5 md:p-5 gap-1">
          <h3 className="font-headline font-extrabold leading-tight text-sm md:text-base line-clamp-2">
            {title}
          </h3>
          {description ? (
            <p className={`text-[11px] md:text-xs leading-snug line-clamp-1 hidden md:block ${splitDesc}`}>
              {description}
            </p>
          ) : null}

          {cta || priceLabel ? (
            <div className="mt-auto pt-2 flex items-center justify-between gap-2">
              {priceLabel ? (
                <span className="text-sm md:text-base font-headline font-extrabold text-brand-orange leading-none">
                  {priceLabel}
                </span>
              ) : (
                <span />
              )}
              {cta ? (
                <span
                  className={`inline-flex items-center gap-1 text-[11px] md:text-xs font-bold ${splitCta}`}
                >
                  {cta}
                  <Icon
                    name="arrow_forward"
                    size={12}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>
    )
  }

  // ── OVERLAY LAYOUT (feature + standard) ─────────────────────
  const height = OVERLAY_HEIGHTS[variant] || OVERLAY_HEIGHTS.standard

  return (
    <Link
      to={href}
      aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
      className={`group relative isolate flex overflow-hidden rounded-[28px] bg-surface-container-low shadow-sm hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-surface transition-all duration-300 ${height} ${className}`}
    >
      {image ? (
        <img
          src={image}
          alt={imageAlt || (typeof title === 'string' ? title : '')}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 signature-gradient" />
      )}

      <div className={`absolute inset-0 ${t.overlay} transition-opacity duration-300`} />

      <div className="absolute top-5 left-5 right-5 flex items-start justify-between gap-3 z-10">
        {badge ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold uppercase tracking-wider backdrop-blur-md ${t.badgeBg}`}
          >
            {badge.icon ? <Icon name={badge.icon} size={12} /> : null}
            {badge.label}
          </span>
        ) : (
          <span />
        )}
        {icon ? (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.iconBg} backdrop-blur-md shadow-ambient-sm`}
          >
            <Icon name={icon} size={20} />
          </span>
        ) : null}
      </div>

      <div className="relative mt-auto w-full p-5 md:p-7 z-10">
        <h3
          className={`font-headline font-extrabold leading-tight ${t.title} ${
            variant === 'feature' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          {title}
        </h3>
        {description ? (
          <p className={`mt-2 text-sm md:text-[15px] leading-relaxed line-clamp-2 ${t.description}`}>
            {description}
          </p>
        ) : null}
        {cta || priceLabel ? (
          <div className="mt-4 flex items-end justify-between gap-3">
            {priceLabel ? (
              <span className="text-base md:text-lg font-headline font-extrabold text-brand-orange leading-none">
                {priceLabel}
              </span>
            ) : (
              <span />
            )}
            {cta ? (
              <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${t.cta}`}>
                {cta}
                <Icon
                  name="arrow_forward"
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
