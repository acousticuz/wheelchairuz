import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Icon from '../../components/Icon'
import SectionEditor from '../../components/admin/SectionEditor'
import { homeSectionsApi } from '../../hooks/useApi'
import { SECTION_REGISTRY, getSectionMeta } from '../../sections'
import { tx } from '../../sections/tx'
import { useLang } from '../../hooks/useLang'

export default function AdminHomeBuilder() {
  const { lang } = useLang()
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const [addingOpen, setAddingOpen] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await homeSectionsApi.listAll()
      list.sort((a, b) => a.sortOrder - b.sortOrder)
      setSections(list)
    } catch (err) {
      setError(err.message || "Ma'lumotni olishda xato")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const reloadPreview = () => setPreviewKey((k) => k + 1)

  const persistReorder = async (renumbered) => {
    try {
      setSaving(true)
      await homeSectionsApi.reorder(
        renumbered.map((s) => ({ id: s.id, sortOrder: s.sortOrder })),
      )
      reloadPreview()
    } catch (err) {
      alert(`Tartibni saqlashda xato: ${err.message}`)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  const handleDragEnd = (e) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex((s) => s.id === active.id)
    const newIndex = sections.findIndex((s) => s.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const moved = arrayMove(sections, oldIndex, newIndex)
    const renumbered = moved.map((s, i) => ({ ...s, sortOrder: (i + 1) * 10 }))
    setSections(renumbered)
    persistReorder(renumbered)
  }

  const move = (id, direction) => {
    const idx = sections.findIndex((s) => s.id === id)
    if (idx === -1) return
    const targetIdx = idx + direction
    if (targetIdx < 0 || targetIdx >= sections.length) return
    const moved = arrayMove(sections, idx, targetIdx)
    const renumbered = moved.map((s, i) => ({ ...s, sortOrder: (i + 1) * 10 }))
    setSections(renumbered)
    persistReorder(renumbered)
  }

  const toggleActive = async (s) => {
    try {
      await homeSectionsApi.update(s.id, { isActive: !s.isActive })
      setSections((prev) =>
        prev.map((x) => (x.id === s.id ? { ...x, isActive: !s.isActive } : x)),
      )
      reloadPreview()
    } catch (err) {
      alert(`Xato: ${err.message}`)
    }
  }

  const remove = async (s) => {
    if (!confirm(`"${s.key}" bo'limini o'chirish?`)) return
    try {
      await homeSectionsApi.remove(s.id)
      setSections((prev) => prev.filter((x) => x.id !== s.id))
      reloadPreview()
    } catch (err) {
      alert(`O'chirishda xato: ${err.message}`)
    }
  }

  const saveEditing = async (updated) => {
    try {
      setSaving(true)
      const saved = await homeSectionsApi.update(updated.id, {
        sortOrder: updated.sortOrder,
        isActive: updated.isActive,
        settings: updated.settings,
      })
      setSections((prev) =>
        prev
          .map((x) => (x.id === saved.id ? saved : x))
          .sort((a, b) => a.sortOrder - b.sortOrder),
      )
      setEditing(null)
      reloadPreview()
    } catch (err) {
      alert(`Saqlashda xato: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const addSection = async (type) => {
    const meta = getSectionMeta(type)
    const key = `${type}-${Date.now().toString(36)}`
    try {
      const maxOrder = sections.reduce((m, s) => Math.max(m, s.sortOrder), 0)
      const created = await homeSectionsApi.create({
        key,
        type,
        sortOrder: maxOrder + 10,
        isActive: true,
        settings: meta?.defaultSettings || {},
      })
      setSections((prev) => [...prev, created])
      setAddingOpen(false)
      setEditing(created)
      reloadPreview()
    } catch (err) {
      alert(`Qo'shishda xato: ${err.message}`)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      {/* Builder pane */}
      <div className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-brand-ink">
              Bosh sahifa konstruktor
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Bo‘limlarni sudrang, yoqing/o‘chiring, qo‘shing, tahrirlang. O‘ng tomonda jonli ko‘rinish.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary border border-outline-variant/30 px-3 py-2 rounded-xl"
            >
              <Icon name="preview" size={16} /> Preview
            </button>
            <button
              onClick={() => setAddingOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-container shadow-ambient-sm"
            >
              <Icon name="add" size={18} /> Yangi bo‘lim
            </button>
          </div>
        </div>

        {saving ? (
          <div className="mb-3 flex items-center gap-2 text-xs text-on-surface-variant">
            <Icon name="sync" size={14} className="animate-spin" /> Saqlanmoqda…
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 p-3 bg-error-container/40 text-on-error-container rounded-lg text-sm">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-surface-container animate-pulse rounded-xl" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-outline-variant/30 rounded-2xl">
            <Icon name="dashboard_customize" size={48} className="text-on-surface-variant mb-2" />
            <p className="text-sm text-on-surface-variant">
              Hozircha bo'lim yo'q. Yuqoridan "Yangi bo'lim" tugmasini bosing.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {sections.map((s, idx) => {
                  const meta = getSectionMeta(s.type)
                  return (
                    <SortableSectionRow
                      key={s.id}
                      section={s}
                      meta={meta}
                      lang={lang}
                      isFirst={idx === 0}
                      isLast={idx === sections.length - 1}
                      onToggle={() => toggleActive(s)}
                      onEdit={() => setEditing(s)}
                      onMoveUp={() => move(s.id, -1)}
                      onMoveDown={() => move(s.id, 1)}
                      onDelete={() => remove(s)}
                    />
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Desktop preview pane */}
      <PreviewPane
        previewKey={previewKey}
        onReload={reloadPreview}
        className="hidden lg:flex"
      />

      {/* Mobile preview drawer */}
      {previewOpen ? (
        <div className="lg:hidden fixed inset-0 z-[210] bg-white flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant/15 flex items-center justify-between">
            <h3 className="font-bold text-brand-ink">Jonli ko‘rinish</h3>
            <div className="flex gap-1">
              <button onClick={reloadPreview} className="p-2 rounded-lg hover:bg-surface-container-low" aria-label="Yangilash">
                <Icon name="refresh" size={20} />
              </button>
              <button onClick={() => setPreviewOpen(false)} className="p-2 rounded-lg hover:bg-surface-container-low" aria-label="Close">
                <Icon name="close" size={20} />
              </button>
            </div>
          </div>
          <iframe
            key={previewKey}
            src="/"
            title="Bosh sahifa ko'rinishi"
            className="flex-1 w-full"
          />
        </div>
      ) : null}

      {addingOpen ? (
        <AddSectionDialog
          lang={lang}
          onClose={() => setAddingOpen(false)}
          onAdd={addSection}
        />
      ) : null}

      {editing ? (
        <SectionEditor
          section={editing}
          onSave={saveEditing}
          onClose={() => setEditing(null)}
        />
      ) : null}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  Sortable row
// ────────────────────────────────────────────────────────────

function SortableSectionRow(props) {
  const { section } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <SectionRow {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  )
}

function SectionRow({
  section,
  meta,
  lang,
  isFirst,
  isLast,
  onToggle,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  dragHandleProps,
}) {
  return (
    <div
      className={`group flex items-center gap-2 md:gap-3 bg-white border rounded-xl px-2 md:px-3 py-3 transition-all ${
        section.isActive
          ? 'border-outline-variant/20 hover:border-primary/30 shadow-sm'
          : 'border-outline-variant/15 opacity-60'
      }`}
    >
      {/* Drag handle */}
      <button
        {...dragHandleProps?.attributes}
        {...dragHandleProps?.listeners}
        className="p-1 text-on-surface-variant hover:text-primary cursor-grab active:cursor-grabbing touch-none"
        aria-label="Sudrash"
      >
        <Icon name="drag_indicator" size={20} />
      </button>

      {/* Up/Down (mobile fallback) */}
      <div className="flex flex-col gap-0.5 md:hidden">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Yuqori"
          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30"
        >
          <Icon name="arrow_upward" size={12} />
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Pastga"
          className="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30"
        >
          <Icon name="arrow_downward" size={12} />
        </button>
      </div>

      {/* Type icon */}
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-brand-blue flex-shrink-0">
        <Icon name={meta?.icon || 'view_module'} size={18} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-sm text-brand-ink truncate">
            {tx(meta?.label, lang) || section.type}
          </p>
          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-surface-container-low text-on-surface-variant rounded uppercase">
            {section.type}
          </span>
        </div>
        <p className="text-[11px] text-on-surface-variant truncate">{section.key}</p>
      </div>

      {/* Active toggle */}
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          section.isActive ? 'bg-secondary' : 'bg-surface-container-high'
        }`}
        aria-label={section.isActive ? "O'chirish" : 'Yoqish'}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            section.isActive ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>

      <button
        onClick={onEdit}
        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg"
        aria-label="Tahrirlash"
      >
        <Icon name="edit" size={18} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/40 rounded-lg"
        aria-label="O'chirish"
      >
        <Icon name="delete" size={18} />
      </button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  Preview pane (right side, desktop)
// ────────────────────────────────────────────────────────────

function PreviewPane({ previewKey, onReload, className = '' }) {
  const [device, setDevice] = useState('desktop') // 'desktop' | 'mobile'
  const wrapperClass =
    device === 'mobile'
      ? 'w-[390px] h-[760px] mx-auto'
      : 'w-full h-full'

  return (
    <div
      className={`flex-shrink-0 w-full lg:w-[640px] xl:w-[760px] bg-slate-100 border-l border-outline-variant/15 ${className} flex-col`}
    >
      <div className="px-4 py-3 border-b border-outline-variant/15 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Icon name="visibility" size={18} className="text-on-surface-variant" />
          <h3 className="font-bold text-sm text-brand-ink">Jonli ko‘rinish</h3>
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-surface-container-low rounded-lg p-0.5">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                device === 'desktop' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon name="desktop_windows" size={14} /> Desktop
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                device === 'mobile' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'
              }`}
            >
              <Icon name="smartphone" size={14} /> Mobile
            </button>
          </div>
          <button
            onClick={onReload}
            className="p-2 rounded-lg hover:bg-surface-container-low"
            aria-label="Yangilash"
            title="Yangilash"
          >
            <Icon name="refresh" size={18} />
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg hover:bg-surface-container-low"
            aria-label="Yangi tabda ochish"
            title="Yangi tabda ochish"
          >
            <Icon name="open_in_new" size={18} />
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className={`${wrapperClass} bg-white rounded-xl shadow-lg overflow-hidden`}>
          <iframe
            key={previewKey}
            src="/"
            title="Bosh sahifa ko‘rinishi"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
//  Add dialog
// ────────────────────────────────────────────────────────────

function AddSectionDialog({ lang, onClose, onAdd }) {
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="px-5 py-4 border-b border-outline-variant/15 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-bold text-brand-ink">Bo‘lim turini tanlang</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-container-low rounded-lg" aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {SECTION_REGISTRY.map((s) => (
            <button
              key={s.type}
              onClick={() => onAdd(s.type)}
              className="text-left p-4 border border-outline-variant/20 rounded-xl hover:border-primary/40 hover:shadow-sm transition flex gap-3"
            >
              <div className="w-10 h-10 rounded-lg signature-gradient text-white flex items-center justify-center flex-shrink-0">
                <Icon name={s.icon} size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-brand-ink">{tx(s.label, lang)}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  {tx(s.description, lang)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
