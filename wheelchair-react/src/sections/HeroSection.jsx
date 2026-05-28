import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SmartImage from '../components/SmartImage'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

export default function HeroSection({ settings = {} }) {
  const { lang } = useLang()
  const {
    badge,
    title,
    subtitle,
    primaryCta,
    secondaryCta,
    image,
    imageBadge,
    trustItems = [],
  } = settings

  return (
    <section className="relative isolate overflow-hidden bg-surface pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="absolute inset-0 hero-grid pointer-events-none" />
      <div className="absolute inset-0 hero-noise pointer-events-none opacity-60" />
      <div className="glow-orb glow-orb-primary w-[520px] h-[520px] -top-24 left-1/2 -translate-x-1/2 animate-glow-pulse" />
      <div className="glow-orb glow-orb-accent w-[420px] h-[420px] bottom-0 -right-20" />
      <div className="glow-orb glow-orb-accent w-[320px] h-[320px] top-1/3 -left-24" />

      <div className="relative max-w-container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6 md:gap-8">
        {badge ? (
          <Link
            to={badge.href || '/about'}
            className="animate-appear appear-delay-100 group inline-flex items-center gap-2 rounded-full glass-strong border border-primary/10 px-3 py-1.5 text-[11px] md:text-xs font-semibold tracking-wider uppercase text-primary hover:border-primary/25 transition-all shadow-ambient-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
            </span>
            <span>{tx(badge.label, lang)}</span>
            {badge.sub ? (
              <>
                <span className="opacity-30">·</span>
                <span className="hidden sm:inline">{tx(badge.sub, lang)}</span>
              </>
            ) : null}
            <Icon
              name="arrow_forward"
              size={14}
              className="text-secondary transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ) : null}

        <h1 className="animate-appear appear-delay-300 text-gradient-hero font-headline font-extrabold tracking-tight text-[40px] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[88px] max-w-5xl drop-shadow-hero">
          {tx(title, lang)}
        </h1>

        {subtitle ? (
          <p className="animate-appear appear-delay-500 text-base md:text-lg lg:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            {tx(subtitle, lang)}
          </p>
        ) : null}

        {(primaryCta || secondaryCta) && (
          <div className="animate-appear appear-delay-700 mt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {primaryCta ? (
              <Link
                to={primaryCta.href || '/catalog'}
                className="signature-gradient text-white px-7 md:px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-ambient-xl hover:shadow-glow transition-all active:scale-95 group"
              >
                {tx(primaryCta.label, lang)}
                <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
            {secondaryCta ? (
              <Link
                to={secondaryCta.href || '/contact'}
                className="glass-strong border border-primary/10 text-primary px-7 md:px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-primary/25 transition-all"
              >
                <Icon name="headset_mic" size={18} />
                {tx(secondaryCta.label, lang)}
              </Link>
            ) : null}
          </div>
        )}

        {trustItems.length > 0 ? (
          <div className="animate-appear appear-delay-1000 mt-3 flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-2 text-[11px] md:text-sm text-on-surface-variant">
            {trustItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <Icon name={item.icon || 'verified'} size={16} className="text-secondary" />
                {tx(item.label, lang)}
              </span>
            ))}
          </div>
        ) : null}

        {image ? (
          <div className="relative w-full max-w-4xl animate-appear-zoom appear-delay-1000 mt-8 md:mt-14">
            <div className="absolute inset-x-12 -bottom-10 h-40 bg-primary/35 blur-3xl rounded-full" />
            <div className="absolute inset-x-24 -bottom-4 h-32 bg-secondary/20 blur-3xl rounded-full" />

            <div className="relative rounded-2xl md:rounded-3xl p-1.5 md:p-2 bg-gradient-to-b from-white/90 to-white/40 backdrop-blur-xl border border-primary/10 shadow-ambient-xl shimmer-border">
              <SmartImage
                src={image}
                alt={tx(title, lang) || 'Hero'}
                className="w-full rounded-xl md:rounded-2xl aspect-[16/10] object-cover"
                placeholderClass="w-full rounded-xl md:rounded-2xl aspect-[16/10]"
              />

              {imageBadge ? (
                <div className="absolute -top-3 left-4 md:top-6 md:left-6 glass-strong px-3 py-2 rounded-xl flex items-center gap-2 animate-float-y border border-primary/10 shadow-ambient-sm">
                  <Icon name="bolt" size={16} className="text-secondary" />
                  <span className="text-[11px] md:text-xs font-bold text-primary">
                    {tx(imageBadge, lang)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
