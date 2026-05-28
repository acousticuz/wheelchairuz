import { useLang } from '../hooks/useLang'
import { tx } from './tx'

export default function StatsSection({ settings = {} }) {
  const { lang } = useLang()
  const items = settings.items || []
  if (!items.length) return null

  return (
    <section className="relative bg-white border-y border-outline-variant/20">
      <div className="max-w-container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-outline-variant/20">
        {items.map((s, i) => (
          <div key={i} className="py-6 md:py-8 px-3 md:px-6 text-center">
            <p className="text-2xl md:text-4xl font-headline font-extrabold text-gradient-accent">
              {s.value}
            </p>
            <p className="mt-1 text-[10px] md:text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              {tx(s.label, lang)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
