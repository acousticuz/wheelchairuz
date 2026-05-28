import { useLang } from '../hooks/useLang'
import Icon from '../components/Icon'
import { tx } from './tx'

export default function SearchSection({ settings = {} }) {
  const { lang } = useLang()
  const placeholder = tx(settings.placeholder, lang) || 'Search...'

  return (
    <section className="md:hidden px-4 mt-6 mb-8">
      <div className="glass-strong border border-primary/10 p-3 rounded-2xl flex items-center gap-3 shadow-ambient-sm">
        <Icon name="search" className="text-outline" />
        <input
          className="bg-transparent border-none focus:ring-0 text-sm flex-1 font-medium outline-none placeholder:text-outline"
          placeholder={placeholder}
          type="text"
        />
        <button className="signature-gradient text-white p-2 rounded-lg" aria-label="Filter">
          <Icon name="tune" size={18} />
        </button>
      </div>
    </section>
  )
}
