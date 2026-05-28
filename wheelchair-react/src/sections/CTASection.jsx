import { useState } from 'react'
import Icon from '../components/Icon'
import { useLang } from '../hooks/useLang'
import { tx } from './tx'

export default function CTASection({ settings = {} }) {
  const { lang } = useLang()
  const [phone, setPhone] = useState('')
  const label = tx(settings.label, lang)
  const heading = tx(settings.heading, lang)
  const body = tx(settings.body, lang)
  const placeholder = tx(settings.phonePlaceholder, lang) || '+998'
  const button = tx(settings.buttonLabel, lang) || 'Send'

  return (
    <section className="max-w-container mx-auto px-4 md:px-6 mb-10 md:mb-24">
      <div className="signature-gradient rounded-3xl p-6 md:p-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-white relative overflow-hidden shadow-ambient-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/30 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="z-10 text-center md:text-left">
          {label ? (
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-bold text-secondary-fixed mb-3">
              {label}
            </span>
          ) : null}
          {heading ? (
            <h2 className="text-2xl md:text-5xl font-extrabold font-headline mb-3 md:mb-4 leading-tight">
              {heading}
            </h2>
          ) : null}
          {body ? <p className="text-blue-100 max-w-lg opacity-90 text-sm md:text-base">{body}</p> : null}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto"
        >
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:px-6 md:py-4 text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-secondary-fixed w-full sm:w-64 backdrop-blur"
            placeholder={placeholder}
            type="tel"
          />
          <button
            type="submit"
            className="bg-secondary-fixed text-on-secondary-fixed px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2"
          >
            {button} <Icon name="call" size={18} />
          </button>
        </form>
      </div>
    </section>
  )
}
