import { useEffect, useState } from 'react'
import { categoriesApi, contentApi, mediaApi, languagesApi } from '../../hooks/useApi'
import Icon from '../../components/Icon'
import SmartImage from '../../components/SmartImage'

const slugify = (value = '') => value
  .toString()
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

export function AdminCategories() {
  const [items, setItems] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    slug: '',
    icon: 'category',
    name_uz: '',
    name_ru: '',
    name_en: '',
    sortOrder: 0,
    isActive: true,
  })

  const load = async () => {
    const rows = await categoriesApi.list({ all: true })
    setItems(rows || [])
  }
  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    await categoriesApi.create({
      slug: form.slug,
      icon: form.icon,
      name: { uz: form.name_uz, ru: form.name_ru, en: form.name_en },
      sortOrder: Number(form.sortOrder || 0),
      isActive: form.isActive,
    })
    setForm({ slug: '', icon: 'category', name_uz: '', name_ru: '', name_en: '', sortOrder: 0, isActive: true })
    setShowCreateModal(false)
    await load()
  }

  const toggle = async (row) => {
    await categoriesApi.update(row.id, {
      slug: row.slug,
      icon: row.icon,
      name: row.name,
      sortOrder: row.sortOrder || 0,
      isActive: !row.isActive,
    })
    await load()
  }

  const startEdit = (row) => {
    setEditing(row.id)
    setForm({
      slug: row.slug || '',
      icon: row.icon || 'category',
      name_uz: row.name?.uz || '',
      name_ru: row.name?.ru || '',
      name_en: row.name?.en || '',
      sortOrder: row.sortOrder || 0,
      isActive: row.isActive ?? true,
    })
  }

  const update = async (e) => {
    e.preventDefault()
    if (!editing) return
    await categoriesApi.update(editing, {
      slug: form.slug,
      icon: form.icon,
      name: { uz: form.name_uz, ru: form.name_ru, en: form.name_en },
      sortOrder: Number(form.sortOrder || 0),
      isActive: form.isActive,
    })
    setEditing(null)
    setForm({ slug: '', icon: 'category', name_uz: '', name_ru: '', name_en: '', isActive: true })
    await load()
  }

  const updateForm = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'name_uz' && !prev.slug ? { slug: slugify(value) } : {}),
    }))
  }

  const remove = async (id) => {
    if (!confirm("Kategoriyani o'chirasizmi?")) return
    await categoriesApi.remove(id)
    await load()
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="mb-6">
        <button onClick={() => setShowCreateModal(true)} className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">
          + Kategoriya qo'shish
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(cat => (
          <div key={cat.id} className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow">
            <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center mb-4">
              <Icon name={cat.icon} />
            </div>
            <h3 className="font-bold text-primary mb-1">{cat.name?.en}</h3>
            <p className="text-sm text-on-surface-variant">{cat.name?.uz}</p>
            <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center gap-2">
              <button onClick={() => toggle(cat)} className={`text-xs px-2 py-1 rounded ${cat.isActive ? 'bg-secondary-container' : 'bg-error-container'}`}>
                {cat.isActive ? 'active' : 'inactive'}
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => startEdit(cat)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Tahrirlash">
                  <Icon name="edit" size={16} />
                </button>
                <button onClick={() => remove(cat.id)} className="p-1.5 text-error hover:bg-error-container rounded-lg transition-colors" title="O'chirish">
                  <Icon name="delete" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-xl text-primary">Yangi kategoriya</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-surface-container-low">
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-on-surface-variant">Slug
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.slug} onChange={(e) => updateForm('slug', slugify(e.target.value))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Icon
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (UZ)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_uz} onChange={(e) => updateForm('name_uz', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (RU)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_ru} onChange={(e) => updateForm('name_ru', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (EN)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_en} onChange={(e) => updateForm('name_en', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Sort order
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" type="number" value={form.sortOrder} onChange={(e) => updateForm('sortOrder', e.target.value)} />
              </label>
              <div className="md:col-span-2 flex gap-2">
                <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">Saqlash</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="bg-surface-container-low rounded-lg px-4 py-2 text-sm font-bold">Bekor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-xl text-primary">Kategoriyani tahrirlash</h3>
              <button onClick={() => setEditing(null)} className="p-2 rounded-lg hover:bg-surface-container-low">
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={update} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-on-surface-variant">Slug
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.slug} onChange={(e) => updateForm('slug', slugify(e.target.value))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Icon
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (UZ)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_uz} onChange={(e) => updateForm('name_uz', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (RU)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_ru} onChange={(e) => updateForm('name_ru', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (EN)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name_en} onChange={(e) => updateForm('name_en', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Sort order
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" type="number" value={form.sortOrder} onChange={(e) => updateForm('sortOrder', e.target.value)} />
              </label>
              <label className="md:col-span-2 inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Aktiv holatda saqlash
              </label>
              <div className="md:col-span-2 flex gap-2">
                <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">Yangilash</button>
                <button type="button" onClick={() => setEditing(null)} className="bg-surface-container-low rounded-lg px-4 py-2 text-sm font-bold">Bekor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminContent() {
  const [pages, setPages] = useState([])
  const [editing, setEditing] = useState(null)
  const [lang, setLang] = useState('uz')
  const [form, setForm] = useState({ title_uz: '', title_ru: '', title_en: '', body_uz: '', body_ru: '', body_en: '' })
  const load = async () => setPages(await contentApi.list())
  useEffect(() => { load() }, [])

  const startEdit = (p) => {
    setEditing(p.id)
    setForm({
      title_uz: p.title?.uz || '',
      title_ru: p.title?.ru || '',
      title_en: p.title?.en || '',
      body_uz: p.body?.uz || '',
      body_ru: p.body?.ru || '',
      body_en: p.body?.en || '',
    })
  }

  const save = async () => {
    await contentApi.update(editing, {
      title: { uz: form.title_uz, ru: form.title_ru, en: form.title_en },
      body: { uz: form.body_uz, ru: form.body_ru, en: form.body_en },
    })
    setEditing(null)
    await load()
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="space-y-3">
        {pages.map(page => (
          <div key={page.id} className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between ambient-shadow hover:shadow-lg transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-fixed rounded-lg flex items-center justify-center text-primary">
                <Icon name="article" />
              </div>
              <div>
                <h4 className="font-bold text-primary uppercase">{page.slug} page</h4>
                <p className="text-xs text-on-surface-variant">Last edited: {new Date(page.updatedAt).toLocaleString('uz-UZ')}</p>
              </div>
            </div>
            <button onClick={() => startEdit(page)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-bold hover:bg-primary-container transition-colors">
              <Icon name="edit" size={16} /> Edit
            </button>
          </div>
        ))}
      </div>
      {editing && (
        <div className="mt-6 bg-surface-container-lowest rounded-xl ambient-shadow p-4 md:p-6 space-y-4">
          <div className="flex gap-2">
            {['uz', 'ru', 'en'].map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-full text-xs font-bold ${lang === l ? 'bg-primary text-white' : 'bg-surface-container-low'}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <label className="block text-xs font-bold text-on-surface-variant">Sarlavha ({lang.toUpperCase()})
            <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form[`title_${lang}`]} onChange={(e) => setForm((f) => ({ ...f, [`title_${lang}`]: e.target.value }))} />
          </label>
          <label className="block text-xs font-bold text-on-surface-variant">Matn ({lang.toUpperCase()})
            <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-[130px]" value={form[`body_${lang}`]} onChange={(e) => setForm((f) => ({ ...f, [`body_${lang}`]: e.target.value }))} />
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold">Saqlash</button>
            <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-surface-container-low text-sm font-bold">Bekor</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminMedia() {
  const [images, setImages] = useState([])
  const [selected, setSelected] = useState(null)
  const load = async () => {
    const result = await mediaApi.list(1, 80)
    setImages(result?.data || [])
  }
  useEffect(() => { load() }, [])
  const upload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    await mediaApi.upload(file)
    event.target.value = ''
    await load()
  }
  const remove = async (id) => {
    if (!confirm("Rasmni o'chirasizmi?")) return
    await mediaApi.remove(id)
    setSelected(null)
    await load()
  }
  const cleanupOrphans = async () => {
    if (!confirm("Disda yo'q bo'lgan rasm yozuvlarini DB'dan o'chirish?")) return
    try {
      const result = await mediaApi.cleanupOrphans()
      alert(
        `Tekshirildi: ${result.scanned}\nO'chirildi (orphan): ${result.removed}`,
      )
      await load()
    } catch (err) {
      alert(`Xato: ${err.message}`)
    }
  }
  const selectedItem = images.find((img) => img.id === selected)
  const formatSize = (bytes = 0) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      alert("Nusxa olib bo'lmadi")
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="font-headline font-bold text-xl text-primary">Media Library</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={cleanupOrphans}
            className="flex items-center gap-2 border border-outline-variant/30 text-on-surface-variant px-3 py-2 rounded-lg font-semibold text-xs hover:bg-surface-container-low"
            title="DB'dagi mavjud bo'lmagan fayl yozuvlarini o'chiradi"
          >
            <Icon name="cleaning_services" size={14} /> Yo'qolgan fayllarni tozalash
          </button>
          <label className="flex items-center gap-2 signature-gradient text-on-primary px-4 py-2 rounded-lg font-bold text-sm cursor-pointer">
            <Icon name="upload" size={16} /> Upload
            <input type="file" accept="image/*" className="hidden" onChange={upload} />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-surface-container-low">
            <button type="button" onClick={() => setSelected(img.id)} className="w-full h-full text-left">
              <SmartImage className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" placeholderClass="w-full h-full" src={img.url} alt={img.alt || img.originalName || 'media image'} />
            </button>
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
              <button onClick={() => setSelected(img.id)} className="bg-white text-primary rounded-lg px-3 py-1 text-xs font-bold">Ko'rish</button>
              <button onClick={() => remove(img.id)} className="bg-white text-error rounded-lg px-3 py-1 text-xs font-bold">Delete</button>
            </div>
          </div>
        ))}
        <label className="aspect-square rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary hover:text-primary transition-colors cursor-pointer">
          <Icon name="add" size={32} />
          <span className="text-xs font-bold">Add Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={upload} />
        </label>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-slate-100 p-4 flex items-center justify-center">
                <SmartImage src={selectedItem.url} alt={selectedItem.alt || selectedItem.originalName || 'media image'} className="max-h-[70vh] w-auto rounded-lg object-contain" placeholderClass="h-64 w-full rounded-lg" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-primary">Media tafsilotlari</h4>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-surface-container-low">
                    <Icon name="close" />
                  </button>
                </div>
                <div className="text-sm space-y-2">
                  <p><span className="font-semibold">Original nom:</span> {selectedItem.originalName}</p>
                  <p><span className="font-semibold">Fayl:</span> {selectedItem.filename}</p>
                  <p><span className="font-semibold">MIME:</span> {selectedItem.mimetype}</p>
                  <p><span className="font-semibold">Hajmi:</span> {formatSize(selectedItem.size)}</p>
                  <p><span className="font-semibold">Yo'l:</span> {selectedItem.path}</p>
                  <p><span className="font-semibold">Yaratilgan:</span> {new Date(selectedItem.createdAt).toLocaleString('uz-UZ')}</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-on-surface-variant">URL</label>
                  <div className="flex gap-2">
                    <input readOnly value={selectedItem.url} className="flex-1 bg-surface-container-low rounded-lg px-3 py-2 text-xs" />
                    <button onClick={() => copyText(selectedItem.url)} className="px-3 py-2 rounded-lg bg-surface-container-high text-xs font-bold">Copy</button>
                  </div>
                </div>
                <div className="pt-3 border-t border-outline-variant/20 flex gap-2">
                  <button onClick={() => copyText(window.location.origin + selectedItem.url)} className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold">To'liq URL ni nusxalash</button>
                  <button onClick={() => remove(selectedItem.id)} className="px-3 py-2 rounded-lg bg-error text-white text-xs font-bold">Rasmni o'chirish</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminLanguages() {
  const [langs, setLangs] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [form, setForm] = useState({ code: '', name: '', nativeName: '', flag: '', completion: 100, totalKeys: 120, isActive: true })
  const load = async () => setLangs(await languagesApi.list())
  useEffect(() => { load() }, [])
  const add = async (e) => {
    e.preventDefault()
    await languagesApi.create({ ...form, completion: Number(form.completion), totalKeys: Number(form.totalKeys) })
    setForm({ code: '', name: '', nativeName: '', flag: '', completion: 100, totalKeys: 120, isActive: true })
    setShowCreateModal(false)
    await load()
  }
  const toggle = async (row) => {
    await languagesApi.update(row.id, { isActive: !row.isActive })
    await load()
  }
  const makeDefault = async (row) => {
    await languagesApi.update(row.id, { isDefault: true })
    await load()
  }
  const remove = async (id) => {
    await languagesApi.remove(id)
    await load()
  }
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="mb-5">
        <button onClick={() => setShowCreateModal(true)} className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">
          + Til qo'shish
        </button>
      </div>
      <div className="space-y-4">
        {langs.map(l => (
          <div key={l.code} className="bg-surface-container-lowest rounded-xl p-6 flex items-center gap-4 ambient-shadow">
            <span className="text-3xl">{l.flag || '🌐'}</span>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-primary">{l.name}</h4>
                <span className="text-sm font-bold text-secondary">{l.completion}%</span>
              </div>
              <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full transition-all duration-500"
                  style={{ width: `${l.completion}%` }} />
              </div>
              <p className="text-xs text-on-surface-variant mt-1">{l.totalKeys} keys</p>
            </div>
            <button onClick={() => toggle(l)} className={`p-2 rounded-lg text-xs font-bold ${l.isActive ? 'bg-secondary-container' : 'bg-error-container'}`}>{l.isActive ? 'On' : 'Off'}</button>
            <button onClick={() => makeDefault(l)} className={`p-2 rounded-lg text-xs font-bold ${l.isDefault ? 'bg-primary text-white' : 'bg-surface-container-low'}`}>Default</button>
            <button onClick={() => remove(l.id)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors"><Icon name="delete" size={18} /></button>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-xl text-primary">Yangi til</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-surface-container-low">
                <Icon name="close" />
              </button>
            </div>
            <form onSubmit={add} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-on-surface-variant">Code
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Name
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Native Name
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.nativeName} onChange={(e) => setForm((f) => ({ ...f, nativeName: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Flag (UZ/RU/EN)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={form.flag} onChange={(e) => setForm((f) => ({ ...f, flag: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Completion (%)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" type="number" value={form.completion} onChange={(e) => setForm((f) => ({ ...f, completion: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Total Keys
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" type="number" value={form.totalKeys} onChange={(e) => setForm((f) => ({ ...f, totalKeys: e.target.value }))} />
              </label>
              <div className="md:col-span-2 flex gap-2">
                <button className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">Saqlash</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="bg-surface-container-low rounded-lg px-4 py-2 text-sm font-bold">Bekor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
