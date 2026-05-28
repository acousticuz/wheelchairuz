import { useEffect, useState } from 'react'
import { translations } from '../i18n/translations'
import { LangContext } from './langContext'

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('wheelchair_lang') || 'uz')

  useEffect(() => {
    localStorage.setItem('wheelchair_lang', lang)
  }, [lang])

  const t = (key) => {
    const keys = key.split('.')
    let val = translations[lang]
    for (const k of keys) val = val?.[k]
    return val || key
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}
