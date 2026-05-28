import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SmartImage from '../components/SmartImage'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

export default function AboutSection({ settings = {} }) {
  const { lang } = useLang()
  const label = tx(settings.label, lang)
  const heading = tx(settings.heading, lang)
  const paragraphs = settings.paragraphs || []
  const image = settings.image
  const stat = settings.stat
  const features = settings.features || []
  const ctaLabel = tx(settings.ctaLabel, lang)
  const ctaHref = settings.ctaHref || '/about'

  return (
    <section className="hidden md:block py-24 bg-surface-container-low/30 relative overflow-hidden">
      <div className="glow-orb glow-orb-primary w-[400px] h-[400px] top-1/2 right-0 -translate-y-1/2 opacity-30" />
      <div className="relative max-w-container mx-auto px-6 grid grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="absolute -bottom-6 -left-6 w-full h-full signature-gradient opacity-10 rounded-3xl -z-10" />
          <SmartImage
            src={image}
            alt={heading || 'About'}
            className="rounded-3xl shadow-ambient-xl w-full h-[500px] object-cover"
            placeholderClass="rounded-3xl w-full h-[500px]"
          />
          {stat ? (
            <div className="absolute top-8 right-8 glass-strong border border-primary/10 p-6 rounded-2xl shadow-ambient max-w-[210px]">
              <p className="text-gradient-accent font-headline font-extrabold text-5xl mb-1 leading-none">
                {stat.value}
              </p>
              <p className="text-on-surface-variant text-sm font-semibold">{tx(stat.label, lang)}</p>
            </div>
          ) : null}
        </div>

        <div>
          {label ? (
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-bold text-secondary mb-3">
              {label}
            </span>
          ) : null}
          {heading ? (
            <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-gradient-hero mb-8 leading-tight">
              {heading}
            </h2>
          ) : null}
          <div className="space-y-5 text-on-surface-variant leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{tx(p, lang)}</p>
            ))}
          </div>
          {features.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-6">
              {features.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl signature-gradient flex items-center justify-center text-white flex-shrink-0">
                    <Icon name={item.icon || 'verified'} size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{tx(item.title, lang)}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{tx(item.text, lang)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {ctaLabel ? (
            <Link
              to={ctaHref}
              className="inline-flex items-center gap-2 mt-10 signature-gradient text-white px-7 py-3.5 rounded-xl font-bold shadow-ambient-xl hover:shadow-glow transition-all active:scale-95 group"
            >
              {ctaLabel}{' '}
              <Icon
                name="arrow_forward"
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
