import { useEffect, useState } from 'react'
import Icon from '../Icon'
import LocalizedInput from './LocalizedInput'
import ImageUploader from './ImageUploader'

/**
 * Editor for a single home section. Renders per-type fields. Always exposes
 * an "Advanced (JSON)" panel for power users.
 *
 * Props:
 *   section — the section being edited
 *   onSave(updatedSection) — called when user clicks Save
 *   onClose() — close the editor without saving
 */
export default function SectionEditor({ section, onSave, onClose }) {
  const [draft, setDraft] = useState(section)
  const [advanced, setAdvanced] = useState(false)
  const [jsonError, setJsonError] = useState(null)
  const [rawJson, setRawJson] = useState(
    JSON.stringify(section?.settings ?? {}, null, 2),
  )

  useEffect(() => {
    setDraft(section)
    setRawJson(JSON.stringify(section?.settings ?? {}, null, 2))
    setJsonError(null)
  }, [section?.id])

  if (!section) return null

  const settings = draft?.settings || {}
  const updateSettings = (patch) =>
    setDraft({ ...draft, settings: { ...(draft.settings || {}), ...patch } })

  const handleJsonChange = (val) => {
    setRawJson(val)
    try {
      const parsed = JSON.parse(val)
      setJsonError(null)
      setDraft({ ...draft, settings: parsed })
    } catch (err) {
      setJsonError(err.message)
    }
  }

  const handleSave = () => {
    if (advanced && jsonError) return
    onSave?.(draft)
  }

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full sm:w-[520px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant/15 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-brand-orange">
              {section.type}
            </p>
            <h3 className="text-lg font-bold text-brand-ink">{section.key}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container-low rounded-lg"
            aria-label="Close"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Common fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Tartib raqami
              </label>
              <input
                type="number"
                value={draft.sortOrder ?? 0}
                onChange={(e) =>
                  setDraft({ ...draft, sortOrder: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Holat
              </label>
              <button
                type="button"
                onClick={() =>
                  setDraft({ ...draft, isActive: !draft.isActive })
                }
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                  draft.isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {draft.isActive ? '● Yoqilgan' : '○ O‘chirilgan'}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/15" />

          {advanced ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Settings JSON (advanced)
              </label>
              <textarea
                value={rawJson}
                onChange={(e) => handleJsonChange(e.target.value)}
                rows={20}
                className="w-full px-3 py-2 text-xs font-mono border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-slate-50"
              />
              {jsonError ? (
                <p className="text-xs text-error">JSON xato: {jsonError}</p>
              ) : null}
            </div>
          ) : (
            <TypeSpecificForm
              type={section.type}
              settings={settings}
              update={updateSettings}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-outline-variant/15 flex items-center justify-between gap-3 flex-shrink-0 bg-surface-container-low">
          <button
            type="button"
            onClick={() => {
              setAdvanced(!advanced)
              if (!advanced) {
                setRawJson(JSON.stringify(draft.settings || {}, null, 2))
              }
            }}
            className="text-xs font-semibold text-on-surface-variant hover:text-primary flex items-center gap-1"
          >
            <Icon name="code" size={14} />
            {advanced ? 'Oddiy ko‘rinish' : 'Advanced (JSON)'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg"
            >
              Bekor
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={advanced && jsonError}
              className="px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <Icon name="check" size={16} /> Saqlash
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  Per-type form
// ────────────────────────────────────────────────────────────

function TypeSpecificForm({ type, settings, update }) {
  switch (type) {
    case 'hero':
      return <HeroForm settings={settings} update={update} />
    case 'stats':
      return <StatsForm settings={settings} update={update} />
    case 'search':
      return <SearchForm settings={settings} update={update} />
    case 'categories':
      return <CategoriesForm settings={settings} update={update} />
    case 'featured':
      return <FeaturedForm settings={settings} update={update} />
    case 'testimonials':
      return <TestimonialsForm settings={settings} update={update} />
    case 'cta':
      return <CtaForm settings={settings} update={update} />
    case 'about':
      return <AboutForm settings={settings} update={update} />
    case 'banner':
      return <BannerForm settings={settings} update={update} />
    case 'spacer':
      return <SpacerForm settings={settings} update={update} />
    default:
      return (
        <p className="text-sm text-on-surface-variant">
          Ushbu turdagi maxsus forma yo‘q — Advanced (JSON) rejimini ishlating.
        </p>
      )
  }
}

function FieldLabel({ children }) {
  return (
    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
      {children}
    </label>
  )
}

function UrlField({ value, onChange, label, placeholder = '/catalog' }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
      />
    </div>
  )
}

function ImageField({ value, onChange, label = 'Rasm' }) {
  return <ImageUploader value={value} onChange={onChange} label={label} />
}

// ── Hero form ──────────────────────────────────────────────
function HeroForm({ settings, update }) {
  const { badge = {}, primaryCta = {}, secondaryCta = {} } = settings
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Badge label"
        value={badge.label}
        onChange={(v) => update({ badge: { ...badge, label: v } })}
      />
      <LocalizedInput
        label="Badge sub"
        value={badge.sub}
        onChange={(v) => update({ badge: { ...badge, sub: v } })}
      />
      <UrlField
        label="Badge link"
        value={badge.href}
        onChange={(v) => update({ badge: { ...badge, href: v } })}
        placeholder="/about"
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.title}
        onChange={(v) => update({ title: v })}
      />
      <LocalizedInput
        label="Quyi sarlavha"
        value={settings.subtitle}
        onChange={(v) => update({ subtitle: v })}
        multiline
      />
      <ImageField
        value={settings.image}
        onChange={(v) => update({ image: v })}
        label="Hero rasm URL"
      />
      <LocalizedInput
        label="Rasm chip matni"
        value={settings.imageBadge}
        onChange={(v) => update({ imageBadge: v })}
      />
      <div className="grid grid-cols-2 gap-3">
        <LocalizedInput
          label="Asosiy CTA matni"
          value={primaryCta.label}
          onChange={(v) =>
            update({ primaryCta: { ...primaryCta, label: v } })
          }
        />
        <UrlField
          label="Asosiy CTA URL"
          value={primaryCta.href}
          onChange={(v) =>
            update({ primaryCta: { ...primaryCta, href: v } })
          }
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <LocalizedInput
          label="Ikkinchi CTA matni"
          value={secondaryCta.label}
          onChange={(v) =>
            update({ secondaryCta: { ...secondaryCta, label: v } })
          }
        />
        <UrlField
          label="Ikkinchi CTA URL"
          value={secondaryCta.href}
          onChange={(v) =>
            update({ secondaryCta: { ...secondaryCta, href: v } })
          }
          placeholder="/contact"
        />
      </div>
      <ListEditor
        label="Trust items (rasm ostidagi belgilar)"
        items={settings.trustItems || []}
        onChange={(items) => update({ trustItems: items })}
        defaultItem={{ icon: 'verified', label: { uz: '', ru: '', en: '' } }}
        renderItem={(item, onItemChange) => (
          <div className="space-y-2">
            <UrlField
              label="Icon nomi"
              value={item.icon}
              onChange={(v) => onItemChange({ ...item, icon: v })}
              placeholder="verified, local_shipping, …"
            />
            <LocalizedInput
              label="Matn"
              value={item.label}
              onChange={(v) => onItemChange({ ...item, label: v })}
            />
          </div>
        )}
      />
    </div>
  )
}

// ── Stats ──────────────────────────────────────────────────
function StatsForm({ settings, update }) {
  return (
    <ListEditor
      label="Statistika ko‘rsatkichlari"
      items={settings.items || []}
      onChange={(items) => update({ items })}
      defaultItem={{ value: '0', label: { uz: '', ru: '', en: '' } }}
      renderItem={(item, onItemChange) => (
        <div className="space-y-2">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Qiymat (masalan 10K+)</FieldLabel>
            <input
              type="text"
              value={item.value || ''}
              onChange={(e) => onItemChange({ ...item, value: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
            />
          </div>
          <LocalizedInput
            label="Yorlig'i"
            value={item.label}
            onChange={(v) => onItemChange({ ...item, label: v })}
          />
        </div>
      )}
    />
  )
}

// ── Search ─────────────────────────────────────────────────
function SearchForm({ settings, update }) {
  return (
    <LocalizedInput
      label="Placeholder"
      value={settings.placeholder}
      onChange={(v) => update({ placeholder: v })}
    />
  )
}

// ── Categories ─────────────────────────────────────────────
function CategoriesForm({ settings, update }) {
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Kichik yorliq (label)"
        value={settings.label}
        onChange={(v) => update({ label: v })}
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <LocalizedInput
        label="Quyi sarlavha"
        value={settings.subtitle}
        onChange={(v) => update({ subtitle: v })}
        multiline
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Eng ko'p kartlar</FieldLabel>
          <input
            type="number"
            min={1}
            max={8}
            value={settings.max ?? 4}
            onChange={(e) => update({ max: Number(e.target.value) })}
            className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>"Yangi kelganlar" kartini qo'shish</FieldLabel>
          <button
            type="button"
            onClick={() =>
              update({ includeNewestCard: !settings.includeNewestCard })
            }
            className={`px-3 py-2 text-sm font-semibold rounded-lg ${
              settings.includeNewestCard !== false
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            {settings.includeNewestCard !== false ? '● Ha' : '○ Yo‘q'}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Chiqarib tashlanadigan kategoriya slug'lari (vergul bilan)</FieldLabel>
        <input
          type="text"
          value={(settings.excludeSlugs || []).join(',')}
          onChange={(e) =>
            update({
              excludeSlugs: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="support, service"
          className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
        />
      </div>
    </div>
  )
}

// ── Featured products ──────────────────────────────────────
function FeaturedForm({ settings, update }) {
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Kichik yorliq"
        value={settings.label}
        onChange={(v) => update({ label: v })}
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <LocalizedInput
        label="Quyi sarlavha"
        value={settings.subtitle}
        onChange={(v) => update({ subtitle: v })}
        multiline
      />
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Eng ko'p mahsulotlar</FieldLabel>
        <input
          type="number"
          min={1}
          max={12}
          value={settings.max ?? 4}
          onChange={(e) => update({ max: Number(e.target.value) })}
          className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
        />
      </div>
    </div>
  )
}

// ── Testimonials ───────────────────────────────────────────
function TestimonialsForm({ settings, update }) {
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Kichik yorliq"
        value={settings.label}
        onChange={(v) => update({ label: v })}
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <ListEditor
        label="Sharhlar"
        items={settings.items || []}
        onChange={(items) => update({ items })}
        defaultItem={{ name: '', role: { uz: '', ru: '', en: '' }, text: { uz: '', ru: '', en: '' } }}
        renderItem={(item, onItemChange) => (
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Ism</FieldLabel>
              <input
                type="text"
                value={item.name || ''}
                onChange={(e) => onItemChange({ ...item, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
              />
            </div>
            <LocalizedInput
              label="Rol / shahar"
              value={item.role}
              onChange={(v) => onItemChange({ ...item, role: v })}
            />
            <LocalizedInput
              label="Sharh matni"
              value={item.text}
              onChange={(v) => onItemChange({ ...item, text: v })}
              multiline
              rows={3}
            />
          </div>
        )}
      />
    </div>
  )
}

// ── CTA ────────────────────────────────────────────────────
function CtaForm({ settings, update }) {
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Kichik yorliq"
        value={settings.label}
        onChange={(v) => update({ label: v })}
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <LocalizedInput
        label="Matn"
        value={settings.body}
        onChange={(v) => update({ body: v })}
        multiline
      />
      <LocalizedInput
        label="Telefon placeholder"
        value={settings.phonePlaceholder}
        onChange={(v) => update({ phonePlaceholder: v })}
      />
      <LocalizedInput
        label="Tugma matni"
        value={settings.buttonLabel}
        onChange={(v) => update({ buttonLabel: v })}
      />
    </div>
  )
}

// ── About ──────────────────────────────────────────────────
function AboutForm({ settings, update }) {
  const stat = settings.stat || {}
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Kichik yorliq"
        value={settings.label}
        onChange={(v) => update({ label: v })}
      />
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <ImageField
        value={settings.image}
        onChange={(v) => update({ image: v })}
      />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Statistika qiymati</FieldLabel>
          <input
            type="text"
            value={stat.value || ''}
            onChange={(e) =>
              update({ stat: { ...stat, value: e.target.value } })
            }
            className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
          />
        </div>
        <LocalizedInput
          label="Statistika yorlig'i"
          value={stat.label}
          onChange={(v) => update({ stat: { ...stat, label: v } })}
        />
      </div>
      <ListEditor
        label="Paragraflar"
        items={settings.paragraphs || []}
        onChange={(items) => update({ paragraphs: items })}
        defaultItem={{ uz: '', ru: '', en: '' }}
        renderItem={(item, onItemChange) => (
          <LocalizedInput value={item} onChange={onItemChange} multiline rows={3} />
        )}
      />
      <ListEditor
        label="Xususiyatlar"
        items={settings.features || []}
        onChange={(items) => update({ features: items })}
        defaultItem={{ icon: 'verified', title: { uz: '', ru: '', en: '' }, text: { uz: '', ru: '', en: '' } }}
        renderItem={(item, onItemChange) => (
          <div className="space-y-2">
            <UrlField
              label="Icon nomi"
              value={item.icon}
              onChange={(v) => onItemChange({ ...item, icon: v })}
              placeholder="verified"
            />
            <LocalizedInput
              label="Sarlavha"
              value={item.title}
              onChange={(v) => onItemChange({ ...item, title: v })}
            />
            <LocalizedInput
              label="Matn"
              value={item.text}
              onChange={(v) => onItemChange({ ...item, text: v })}
            />
          </div>
        )}
      />
      <LocalizedInput
        label="CTA matni"
        value={settings.ctaLabel}
        onChange={(v) => update({ ctaLabel: v })}
      />
      <UrlField
        label="CTA URL"
        value={settings.ctaHref}
        onChange={(v) => update({ ctaHref: v })}
        placeholder="/about"
      />
    </div>
  )
}

// ── Banner ─────────────────────────────────────────────────
function BannerForm({ settings, update }) {
  return (
    <div className="space-y-4">
      <LocalizedInput
        label="Sarlavha"
        value={settings.heading}
        onChange={(v) => update({ heading: v })}
      />
      <LocalizedInput
        label="Matn"
        value={settings.body}
        onChange={(v) => update({ body: v })}
        multiline
      />
      <LocalizedInput
        label="CTA matni"
        value={settings.ctaLabel}
        onChange={(v) => update({ ctaLabel: v })}
      />
      <UrlField
        label="CTA URL"
        value={settings.ctaHref}
        onChange={(v) => update({ ctaHref: v })}
      />
      <ImageField
        value={settings.image}
        onChange={(v) => update({ image: v })}
        label="Orqa rasm URL (ixtiyoriy)"
      />
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Rang sxemasi</FieldLabel>
        <select
          value={settings.tone || 'brand'}
          onChange={(e) => update({ tone: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
        >
          <option value="brand">Brand (ko'k gradient)</option>
          <option value="orange">Orange (apelsin)</option>
          <option value="ink">Ink (qora-ko'k)</option>
          <option value="light">Light (oq)</option>
        </select>
      </div>
    </div>
  )
}

// ── Spacer ─────────────────────────────────────────────────
function SpacerForm({ settings, update }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>Hajm</FieldLabel>
      <select
        value={settings.size || 'md'}
        onChange={(e) => update({ size: e.target.value })}
        className="w-full px-3 py-2 text-sm border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
      >
        <option value="sm">Kichik</option>
        <option value="md">O'rta</option>
        <option value="lg">Katta</option>
      </select>
    </div>
  )
}

// ── Generic list editor (add/remove items) ─────────────────
function ListEditor({ label, items, onChange, defaultItem, renderItem }) {
  const add = () => onChange([...(items || []), structuredClone(defaultItem)])
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const next = [...items]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const updateItem = (i, item) => {
    const next = [...items]
    next[i] = item
    onChange(next)
  }

  return (
    <div className="border border-outline-variant/20 rounded-xl p-3 bg-surface-container-low/50">
      <div className="flex items-center justify-between mb-2">
        <FieldLabel>{label}</FieldLabel>
        <button
          type="button"
          onClick={add}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:bg-surface-container px-2 py-1 rounded-md"
        >
          <Icon name="add" size={14} /> Qo‘shish
        </button>
      </div>
      <div className="space-y-3">
        {items?.length ? (
          items.map((item, i) => (
            <div
              key={i}
              className="bg-white border border-outline-variant/20 rounded-lg p-3 relative"
            >
              <div className="flex items-center gap-1 absolute -top-2 right-2 bg-white border border-outline-variant/30 rounded-full shadow-sm">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  className="p-1 text-on-surface-variant hover:text-primary"
                  aria-label="Yuqori"
                >
                  <Icon name="arrow_upward" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  className="p-1 text-on-surface-variant hover:text-primary"
                  aria-label="Pastga"
                >
                  <Icon name="arrow_downward" size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 text-error hover:bg-error-container/40 rounded-full"
                  aria-label="O'chirish"
                >
                  <Icon name="delete" size={14} />
                </button>
              </div>
              {renderItem(item, (next) => updateItem(i, next))}
            </div>
          ))
        ) : (
          <p className="text-xs text-on-surface-variant italic px-1 py-2">
            Hozircha element yo‘q.
          </p>
        )}
      </div>
    </div>
  )
}
