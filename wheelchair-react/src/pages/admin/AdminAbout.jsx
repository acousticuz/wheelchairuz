import { useEffect, useState } from 'react'
import Icon from '../../components/Icon'
import { contentApi } from '../../hooks/useApi'
import { aboutDefaults, mergeAbout } from '../../data/aboutContent'

const LANGS = ['uz', 'ru', 'en']

const getPath = (obj, path) =>
  path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)

// Stable module-level component so editing one input never remounts the rest
// (which would steal focus mid-typing).
function Section({ icon, title, children }) {
  return (
    <section className="bg-surface-container-lowest rounded-2xl ambient-shadow p-5 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
          <Icon name={icon} size={18} />
        </div>
        <h3 className="font-headline font-bold text-lg text-primary">{title}</h3>
      </div>
      {children}
    </section>
  )
}

export default function AdminAbout() {
  const [pageId, setPageId] = useState(null)
  const [data, setData] = useState(null)
  const [lang, setLang] = useState('uz')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    const init = async () => {
      setLoading(true)
      setError(null)
      try {
        let page
        try {
          page = await contentApi.get('about')
        } catch {
          // Self-heal: create the about page if it does not exist yet.
          page = await contentApi.create({
            slug: 'about',
            title: { uz: 'Biz haqimizda', ru: 'О нас', en: 'About Us' },
            body: { uz: '', ru: '', en: '' },
            meta: aboutDefaults,
          })
        }
        if (!active) return
        setPageId(page.id)
        setData(mergeAbout(page.meta))
      } catch (err) {
        if (active) setError(err.message || "Ma'lumotni olishda xato")
      } finally {
        if (active) setLoading(false)
      }
    }
    init()
    return () => { active = false }
  }, [])

  const setPath = (path, val) => {
    setData((prev) => {
      const next = structuredClone(prev)
      const keys = path.split('.')
      let o = next
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]]
      o[keys[keys.length - 1]] = val
      return next
    })
  }

  const save = async () => {
    if (!pageId) return
    setSaving(true)
    setError(null)
    try {
      await contentApi.update(pageId, { meta: data })
      setSavedAt(Date.now())
    } catch (err) {
      setError(err.message || 'Saqlashda xato')
    } finally {
      setSaving(false)
    }
  }

  const resetDefaults = () => {
    if (!confirm("Barcha matnlarni boshlang'ich (default) holatga qaytarasizmi? Saqlamaguncha o'zgarmaydi.")) return
    setData(structuredClone(aboutDefaults))
  }

  // Render helpers — invoked as functions (not JSX components) so the inputs
  // are reconciled in place and keep focus while typing.
  const ml = (label, path, textarea = false) => (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant">
        {label} <span className="text-primary">({lang.toUpperCase()})</span>
      </span>
      {textarea ? (
        <textarea
          className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-[90px]"
          value={getPath(data, `${path}.${lang}`) || ''}
          onChange={(e) => setPath(`${path}.${lang}`, e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm"
          value={getPath(data, `${path}.${lang}`) || ''}
          onChange={(e) => setPath(`${path}.${lang}`, e.target.value)}
        />
      )}
    </label>
  )

  const txt = (label, path, hint) => (
    <label className="block">
      <span className="text-xs font-bold text-on-surface-variant">{label}</span>
      <input
        className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm"
        value={getPath(data, path) || ''}
        onChange={(e) => setPath(path, e.target.value)}
      />
      {hint ? <span className="text-[10px] text-on-surface-variant">{hint}</span> : null}
    </label>
  )

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-surface-container animate-pulse rounded-2xl" />
        ))}
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="p-4 bg-error-container/40 text-on-error-container rounded-lg text-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-28 md:pb-8">
      {/* Sticky toolbar */}
      <div className="sticky top-16 z-20 -mx-4 md:mx-0 mb-6 px-4 md:px-5 py-3 bg-white/90 backdrop-blur border border-outline-variant/15 md:rounded-2xl flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {LANGS.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                lang === l ? 'bg-primary text-white' : 'bg-surface-container-low text-on-surface-variant'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {savedAt ? (
            <span className="text-xs text-secondary font-semibold inline-flex items-center gap-1">
              <Icon name="check_circle" size={14} /> Saqlandi
            </span>
          ) : null}
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant border border-outline-variant/30 px-3 py-2 rounded-xl hover:bg-surface-container-low"
          >
            <Icon name="open_in_new" size={14} /> Ko'rish
          </a>
          <button
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant border border-outline-variant/30 px-3 py-2 rounded-xl hover:bg-surface-container-low"
          >
            <Icon name="restart_alt" size={14} /> Tiklash
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-container disabled:opacity-60"
          >
            <Icon name={saving ? 'sync' : 'save'} size={16} className={saving ? 'animate-spin' : ''} />
            {saving ? 'Saqlanmoqda…' : 'Saqlash'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mb-4 p-3 bg-error-container/40 text-on-error-container rounded-lg text-sm">{error}</div>
      ) : null}

      <div className="space-y-5">
        <Section icon="badge" title="Hero (yuqori qism)">
          <div className="grid md:grid-cols-2 gap-4">
            {ml('Sarlavha (mobil)', 'hero.title')}
            {ml('Quyi sarlavha (mobil)', 'hero.subtitle')}
            {ml('Sarlavha 1-qator (desktop)', 'hero.headline1')}
            {ml('Sarlavha 2-qator (desktop)', 'hero.headline2')}
            {ml("Tarix yorlig'i", 'hero.storyTag')}
            {ml('Tarix sarlavhasi', 'hero.storyTitle')}
          </div>
          {ml('Tarix matni', 'hero.storyText', true)}
          <div className="grid md:grid-cols-2 gap-4">
            {txt('Tajriba raqami (masalan 25+)', 'hero.experienceValue')}
            {ml("Tajriba yorlig'i", 'hero.experienceLabel')}
          </div>
        </Section>

        <Section icon="insights" title="Statistika">
          <div className="grid md:grid-cols-2 gap-4">
            {txt('Mijozlar soni (5k+)', 'stats.clients')}
            {ml("Mijozlar yorlig'i", 'stats.clientsLabel')}
            {txt("Qo'llab-quvvatlash (24/7)", 'stats.support')}
            {ml("Qo'llab-quvvatlash yorlig'i", 'stats.supportLabel')}
            {ml('Viloyatlar (matn)', 'stats.regions')}
            {ml("Viloyatlar yorlig'i", 'stats.regionsLabel')}
          </div>
        </Section>

        <Section icon="business" title="Bizning kompaniya">
          <div className="grid md:grid-cols-2 gap-4">
            {txt('Nomi (brend)', 'company.name')}
            {ml('Yorliq', 'company.tag')}
          </div>
          {ml('Kompaniya matni', 'company.text', true)}
          <div className="grid md:grid-cols-2 gap-4">
            {txt('Tashkil etilgan yil', 'company.foundedYear')}
            {ml("Yil yorlig'i", 'company.foundedLabel')}
            {txt('Tajriba raqami', 'company.experienceValue')}
            {ml("Tajriba yorlig'i", 'company.experienceLabel')}
          </div>
        </Section>

        <Section icon="favorite" title="Missiya va qadriyatlar">
          {ml('Sarlavha', 'mission.title')}
          {ml('Quyi sarlavha', 'mission.subtitle', true)}
          <div className="space-y-4">
            {(data.mission.values || []).map((_, i) => (
              <div key={i} className="border border-outline-variant/20 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Qadriyat #{i + 1}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {txt('Ikonka (Material Symbol nomi)', `mission.values.${i}.icon`)}
                  {ml('Sarlavha', `mission.values.${i}.title`)}
                </div>
                {ml('Matn', `mission.values.${i}.text`, true)}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {ml('Mahalliy ishlab chiqarish sarlavhasi', 'mission.localTitle')}
            {ml('Mahalliy ishlab chiqarish matni', 'mission.localText', true)}
          </div>
        </Section>

        <Section icon="precision_manufacturing" title="Ishlab chiqarish jarayoni">
          <div className="grid md:grid-cols-2 gap-4">
            {ml('Sarlavha', 'production.title')}
            {ml('Quyi sarlavha', 'production.subtitle')}
            {ml('Video sarlavhasi', 'production.videoTitle')}
            {ml('Video izohi', 'production.videoSubtitle')}
          </div>
        </Section>

        <Section icon="verified" title="Sertifikatlar">
          {ml('Sarlavha', 'certificates.title')}
          {ml('Matn', 'certificates.text', true)}
          <div className="grid md:grid-cols-2 gap-4">
            {(data.certificates.items || []).map((_, i) => (
              <div key={i} className="border border-outline-variant/20 rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Sertifikat #{i + 1}</p>
                {txt('Ikonka', `certificates.items.${i}.icon`)}
                {ml('Nomi', `certificates.items.${i}.label`)}
              </div>
            ))}
          </div>
        </Section>

        <Section icon="campaign" title="CTA (chaqiruv bloki)">
          {ml('Sarlavha', 'cta.title')}
          {ml('Matn', 'cta.text', true)}
          <div className="grid md:grid-cols-2 gap-4">
            {txt('Telefon raqami', 'cta.phone')}
            {txt('Telegram havolasi (URL)', 'cta.telegramUrl')}
          </div>
          {ml('Telegram tugma matni', 'cta.telegramLabel')}
        </Section>
      </div>
    </div>
  )
}
