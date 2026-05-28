import { useState } from 'react'

const LANGS = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

/**
 * Tabbed uz/ru/en text input. Value is an object { uz, ru, en } and onChange
 * receives the next object.
 */
export default function LocalizedInput({
  value = {},
  onChange,
  label,
  placeholder = '',
  multiline = false,
  rows = 3,
  className = '',
}) {
  const [active, setActive] = useState('uz')
  const safe = value && typeof value === 'object' ? value : {}

  const update = (lang, v) => {
    onChange?.({ ...safe, [lang]: v })
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            {label}
          </label>
          <div className="flex gap-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setActive(l.code)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition ${
                  active === l.code
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {multiline ? (
        <textarea
          value={safe[active] || ''}
          onChange={(e) => update(active, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y bg-white"
        />
      ) : (
        <input
          type="text"
          value={safe[active] || ''}
          onChange={(e) => update(active, e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
        />
      )}
    </div>
  )
}
