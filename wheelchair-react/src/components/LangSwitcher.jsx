import { useLang } from '../hooks/useLang'

export default function LangSwitcher({ mobile = false }) {
  const { lang, setLang } = useLang()
  const langs = ['UZ', 'RU', 'EN']

  if (mobile) {
    return (
      <div className="flex bg-surface-container rounded-full px-1 py-1">
        {langs.map(l => (
          <button
            key={l}
            onClick={() => setLang(l.toLowerCase())}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full transition-all ${
              lang === l.toLowerCase()
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center bg-surface-container-high rounded-full p-1">
      {langs.map(l => (
        <button
          key={l}
          onClick={() => setLang(l.toLowerCase())}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
            lang === l.toLowerCase()
              ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-low'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
