import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import { useInquirySubmit } from '../hooks/useApi'
import Icon from '../components/Icon'

export default function ContactPage() {
  const { t, lang } = useLang()
  const [searchParams] = useSearchParams()
  const { submit, loading, success, error, reset } = useInquirySubmit()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const copy = {
    firstNamePlaceholder: { uz: 'Aziz', ru: 'Иван', en: 'John' },
    lastNamePlaceholder: { uz: 'Rahimov', ru: 'Иванов', en: 'Doe' },
    messagePlaceholder: {
      uz: 'Sizni qiziqtirgan savolni yozing...',
      ru: 'Напишите ваш вопрос...',
      en: 'How can we help?',
    },
    telegramReceived: {
      uz: 'Telegram orqali ham qabul qilinadi',
      ru: 'Также принимается через Telegram',
      en: 'Also received via Telegram',
    },
    quickHelpTitle: { uz: 'Tezkor yordam', ru: 'Быстрая помощь', en: 'Quick Help' },
    quickHelpText: {
      uz: 'Telegram botimiz orqali ham murojaat qilishingiz mumkin.',
      ru: 'Вы также можете обратиться через нашего Telegram-бота.',
      en: 'You can also reach us via our Telegram bot.',
    },
  }

  const validate = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = true
    if (!form.lastName.trim()) e.lastName = true
    if (!form.phone.trim()) e.phone = true
    return e
  }

  useEffect(() => {
    const productName = searchParams.get('product')
    if (!productName) return

    const template = {
      uz: `${productName} bo'yicha ma'lumot bermoqchiman.`,
      ru: `Хочу получить информацию по товару: ${productName}.`,
      en: `I would like more information about: ${productName}.`,
    }

    setForm((prev) => (
      prev.message.trim()
        ? prev
        : { ...prev, message: template[lang] || template.uz }
    ))
  }, [searchParams, lang])

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    await submit(form)
  }

  const inputClass = (field) =>
    `w-full bg-surface-container-high border-none rounded-lg p-4 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all text-sm outline-none ${errors[field] ? 'ring-2 ring-error' : ''}`

  return (
    <div className="pb-20 md:pb-0 pt-16 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-10 md:mb-16 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-primary mb-4 leading-tight">{t('contact.title')}</h1>
          <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-surface-container-lowest p-6 md:p-12 rounded-xl ambient-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary font-headline">{t('contact.first_name')} <span className="text-error">*</span></label>
                  <input className={inputClass('firstName')} placeholder={copy.firstNamePlaceholder[lang]}
                    value={form.firstName} onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setErrors(er => ({ ...er, firstName: false })) }} type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-primary font-headline">{t('contact.last_name')} <span className="text-error">*</span></label>
                  <input className={inputClass('lastName')} placeholder={copy.lastNamePlaceholder[lang]}
                    value={form.lastName} onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setErrors(er => ({ ...er, lastName: false })) }} type="text" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary font-headline">{t('contact.phone')} <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium text-sm">+998</span>
                  <input className={`${inputClass('phone')} pl-16`} placeholder="90 123 45 67"
                    value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: false })) }} type="tel" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-primary font-headline">{t('contact.message')}</label>
                <textarea className="w-full bg-surface-container-high border-none rounded-lg p-4 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all text-sm outline-none"
                  placeholder={copy.messagePlaceholder[lang]} rows={4}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                  <Icon name="error" size={16} /> {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                <button type="submit" disabled={loading}
                  className="w-full md:w-auto px-10 py-4 signature-gradient text-on-primary font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {loading ? <Icon name="hourglass_empty" className="animate-spin" /> : <Icon name="send" />}
                  {t('contact.send')}
                </button>
                <p className="text-xs text-on-surface-variant flex items-center gap-2">
                  <Icon name="bolt" className="text-secondary" size={16} />
                  {copy.telegramReceived[lang]}
                </p>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-container-low rounded-xl overflow-hidden h-56 relative group">
              <img className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuGSjUMzEmiubjSzz_wbfGhwHVjnlx4IgiEiSUf4YFG8Sxi1a4aYbN1GT2uGACkseL4Om4N8a9tuimBc0A9KYQCITB2qNeGyEXz-kJ2Fer8_mtLhJlN2qv3XQNTAVIjD6WyC4vJ3mDx0rNmM-xhDMPMzwCvvCYP8v4cypNCR01DANZm-q4U9OsdQPCIAM0eUdZPYijVy88M7V2wp38G5jUvu1WEmszDWIUvA6wsxVvV3gdX5WGaAh7VwkXsiOe_veYzS9nLOBerm8"
                alt="Map" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-surface-container-lowest p-4 rounded-xl shadow-lg">
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">{t('contact.showroom')}</p>
                  <p className="text-sm font-medium text-on-surface">{t('contact.address')}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-container/10 rounded-full flex items-center justify-center text-primary"><Icon name="call" /></div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">{t('contact.direct_line')}</p>
                  <p className="text-lg font-headline font-bold text-on-surface">+998 71 200 00 00</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary"><Icon name="schedule" /></div>
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest">{t('contact.hours')}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{t('contact.weekdays')}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{t('contact.sunday')}</p>
                </div>
              </div>
            </div>

            <div className="bg-tertiary-container/5 p-5 rounded-xl border border-tertiary-fixed/20 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-sm font-bold text-tertiary mb-2">{copy.quickHelpTitle[lang]}</p>
                <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed mb-4">
                  {copy.quickHelpText[lang]}
                </p>
                <a href="https://t.me/wheelchairuz_bot" className="inline-flex items-center gap-2 text-sm font-bold text-tertiary hover:underline">
                  @wheelchairuz_bot <Icon name="open_in_new" size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-sm">
          <div className="bg-surface-container-lowest p-10 rounded-2xl ambient-shadow max-w-md text-center">
            <div className="w-20 h-20 bg-secondary-container/30 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="check_circle" filled size={40} className="text-secondary" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-primary mb-2">{t('contact.success_title')}</h3>
            <p className="text-on-surface-variant mb-8">{t('contact.success_text')}</p>
            <button onClick={reset} className="w-full py-4 bg-primary text-on-primary font-bold rounded-xl">{t('contact.close')}</button>
          </div>
        </div>
      )}
    </div>
  )
}
