import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import SmartImage from '../components/SmartImage'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

/**
 * Flexible promotional banner. Renders title + optional body + optional CTA,
 * with selectable background tone.
 */
export default function BannerSection({ settings = {} }) {
  const { lang } = useLang()
  const heading = tx(settings.heading, lang)
  const body = tx(settings.body, lang)
  const ctaLabel = tx(settings.ctaLabel, lang)
  const ctaHref = settings.ctaHref || '/'
  const image = settings.image
  const tone = settings.tone || 'brand'

  const toneClasses = {
    brand: 'signature-gradient text-white',
    orange: 'bg-brand-orange text-white',
    ink: 'bg-brand-ink text-white',
    light: 'bg-white text-brand-ink border border-outline-variant/20',
  }

  if (!heading && !body) return null

  return (
    <section className="max-w-container mx-auto px-4 md:px-6 mb-10 md:mb-16">
      <div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-ambient ${toneClasses[tone] || toneClasses.brand}`}
      >
        {image ? (
          <SmartImage src={image} alt={heading} className="absolute inset-0 w-full h-full object-cover opacity-25" placeholderClass="hidden" />
        ) : null}
        <div className="relative z-10 flex-1">
          {heading ? <h3 className="text-xl md:text-3xl font-headline font-extrabold mb-2">{heading}</h3> : null}
          {body ? <p className="text-sm md:text-base opacity-90 max-w-xl">{body}</p> : null}
        </div>
        {ctaLabel ? (
          <Link
            to={ctaHref}
            className="relative z-10 inline-flex items-center gap-2 bg-white text-brand-ink px-6 py-3 rounded-xl font-bold whitespace-nowrap hover:shadow-lg transition-shadow"
          >
            {ctaLabel} <Icon name="arrow_forward" size={16} />
          </Link>
        ) : null}
      </div>
    </section>
  )
}
