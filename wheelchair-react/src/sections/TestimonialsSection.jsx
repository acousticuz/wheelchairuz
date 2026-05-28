import Icon from '../components/Icon'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

export default function TestimonialsSection({ settings = {} }) {
  const { lang } = useLang()
  const label = tx(settings.label, lang)
  const heading = tx(settings.heading, lang)
  const items = settings.items || []
  if (!items.length) return null

  return (
    <section className="px-4 md:px-0 mb-10 md:py-24 md:bg-surface-container-low/40 relative overflow-hidden">
      <div className="hidden md:block glow-orb glow-orb-accent w-[400px] h-[400px] top-1/2 -right-32 opacity-40" />
      <div className="relative max-w-container md:mx-auto md:px-6">
        <div className="text-center mb-8 md:mb-14">
          {label ? (
            <span className="hidden md:inline-block text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-2">
              {label}
            </span>
          ) : null}
          {heading ? (
            <h2 className="text-xl md:text-4xl font-headline font-extrabold text-gradient-hero">
              {heading}
            </h2>
          ) : null}
        </div>

        {/* Mobile snap */}
        <div className="md:hidden flex overflow-x-auto gap-4 px-4 hide-scrollbar snap-x snap-mandatory -mx-4">
          {items.map((tm, i) => (
            <article
              key={i}
              className="flex-none w-[280px] snap-start glass-strong border border-primary/10 rounded-2xl p-5 shadow-ambient-sm"
            >
              <Icon name="format_quote" className="text-secondary/60" size={28} />
              <p className="text-sm text-on-surface leading-relaxed mt-2 mb-4">{tx(tm.text, lang)}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full signature-gradient text-white font-bold flex items-center justify-center text-sm">
                  {(tm.name || '?').charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary leading-tight">{tm.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{tx(tm.role, lang)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-6">
          {items.map((tm, i) => (
            <article
              key={i}
              className="relative bg-white border border-outline-variant/20 rounded-3xl p-8 shadow-ambient-sm lift"
            >
              <Icon name="format_quote" className="text-secondary/50" size={36} />
              <p className="text-base text-on-surface leading-relaxed mt-3 mb-6">"{tx(tm.text, lang)}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full signature-gradient text-white font-bold flex items-center justify-center">
                  {(tm.name || '?').charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-primary leading-tight">{tm.name}</p>
                  <p className="text-xs text-on-surface-variant">{tx(tm.role, lang)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
