import { useState, useEffect, useCallback } from 'react'
import { productsApi, categoriesApi, mediaApi } from '../../hooks/useApi'
import Icon from '../../components/Icon'
import SmartImage from '../../components/SmartImage'

const slugify = (value = '') => value
  .toString()
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const parseCsv = (value = '') => value.split(',').map(v => v.trim()).filter(Boolean)

const parseSpecs = (value = '') => value
  .split('\n')
  .map(row => row.trim())
  .filter(Boolean)
  .map(row => {
    const [label = '', specValue = ''] = row.split(':').map(part => part.trim())
    return { label_uz: label, label_ru: label, label_en: label, value: specValue }
  })
  .filter(spec => spec.label_uz && spec.value)

const formatSpecs = (specs = []) => specs
  .map(spec => `${spec.label_uz || spec.label_ru || spec.label_en || ''}: ${spec.value || ''}`)
  .filter(row => row.trim() !== ':')
  .join('\n')

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [editing, setEditing] = useState(null)
  const [editLang, setEditLang] = useState('uz')
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(null)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mediaItems, setMediaItems] = useState([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [createForm, setCreateForm] = useState({
    slug: '', sku: '', categoryId: '', price: '',
    showPrice: true,
    name_uz: '', name_ru: '', name_en: '',
    desc_uz: '', desc_ru: '', desc_en: '',
    excerpt_uz: '', excerpt_ru: '', excerpt_en: '',
    mainImage: '',
    images: [],
    tagsText: '',
    specsText: '',
    badge: '',
    isFeatured: false,
    sortOrder: 0,
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [p, c] = await Promise.all([
        productsApi.adminList({ search, category: filterCat === 'all' ? undefined : filterCat }),
        categoriesApi.list(),
      ])
      setProducts(p.data || [])
      setTotal(p.total || 0)
      setCategories(c || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [search, filterCat])

  useEffect(() => { load() }, [load])

  const loadMedia = async () => {
    setMediaLoading(true)
    try {
      const res = await mediaApi.list(1, 120)
      setMediaItems(res?.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setMediaLoading(false)
    }
  }

  const startEdit = (product) => {
    setEditing(product.id)
    setEditForm({
      name_uz: product.name?.uz || '',
      name_ru: product.name?.ru || '',
      name_en: product.name?.en || '',
      desc_uz: product.description?.uz || '',
      desc_ru: product.description?.ru || '',
      desc_en: product.description?.en || '',
      excerpt_uz: product.excerpt?.uz || '',
      excerpt_ru: product.excerpt?.ru || '',
      excerpt_en: product.excerpt?.en || '',
      price: product.price,
      showPrice: product.showPrice !== false,
      sku: product.sku,
      categoryId: product.categoryId || '',
      mainImage: product.mainImage || '',
      imagesText: (product.images || []).join(', '),
      tagsText: (product.tags || []).join(', '),
      specsText: formatSpecs(product.specs || []),
      badge: product.badge || '',
      isFeatured: Boolean(product.isFeatured),
      sortOrder: product.sortOrder || 0,
    })
    if (!mediaItems.length) loadMedia()
  }

  const saveEdit = async () => {
    setSaving(true)
    try {
      await productsApi.update(editing, {
        name: { uz: editForm.name_uz, ru: editForm.name_ru, en: editForm.name_en },
        description: { uz: editForm.desc_uz, ru: editForm.desc_ru, en: editForm.desc_en },
        excerpt: { uz: editForm.excerpt_uz, ru: editForm.excerpt_ru, en: editForm.excerpt_en },
        price: Number(editForm.price),
        showPrice: Boolean(editForm.showPrice),
        sku: editForm.sku,
        categoryId: editForm.categoryId || undefined,
        mainImage: editForm.mainImage,
        images: parseCsv(editForm.imagesText || ''),
        tags: parseCsv(editForm.tagsText || ''),
        specs: parseSpecs(editForm.specsText || ''),
        badge: editForm.badge || undefined,
        isFeatured: Boolean(editForm.isFeatured),
        sortOrder: Number(editForm.sortOrder || 0),
      })
      setEditing(null)
      load()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const toggleActive = async (id) => {
    setToggling(id)
    try {
      await productsApi.toggle(id)
      setProducts(ps => ps.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
    } catch (e) { alert(e.message) }
    finally { setToggling(null) }
  }

  const editingProduct = products.find(p => p.id === editing)

  const createProduct = async () => {
    if (!createForm.categoryId) {
      alert('Kategoriyani tanlang')
      return
    }
    if (!createForm.mainImage) {
      alert('Asosiy rasm tanlang')
      return
    }
    setCreating(true)
    try {
      await productsApi.create({
        slug: createForm.slug,
        sku: createForm.sku,
        categoryId: createForm.categoryId || undefined,
        price: Number(createForm.price || 0),
        showPrice: Boolean(createForm.showPrice),
        name: { uz: createForm.name_uz, ru: createForm.name_ru, en: createForm.name_en },
        excerpt: { uz: createForm.excerpt_uz, ru: createForm.excerpt_ru, en: createForm.excerpt_en },
        description: { uz: createForm.desc_uz, ru: createForm.desc_ru, en: createForm.desc_en },
        mainImage: createForm.mainImage,
        images: createForm.images,
        tags: parseCsv(createForm.tagsText || ''),
        specs: parseSpecs(createForm.specsText || ''),
        badge: createForm.badge || undefined,
        isFeatured: Boolean(createForm.isFeatured),
        sortOrder: Number(createForm.sortOrder || 0),
        isActive: true,
      })
      setCreateForm({
        slug: '', sku: '', categoryId: '', price: '',
        showPrice: true,
        name_uz: '', name_ru: '', name_en: '',
        desc_uz: '', desc_ru: '', desc_en: '',
        excerpt_uz: '', excerpt_ru: '', excerpt_en: '',
        mainImage: '',
        images: [],
        tagsText: '',
        specsText: '',
        badge: '',
        isFeatured: false,
        sortOrder: 0,
      })
      setShowCreateModal(false)
      await load()
    } catch (e) { alert(e.message) }
    finally { setCreating(false) }
  }

  const openCreateModal = async () => {
    setShowCreateModal(true)
    await loadMedia()
  }

  const handleUploadMedia = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await mediaApi.upload(file)
      await loadMedia()
    } catch (e) {
      alert(e.message)
    } finally {
      event.target.value = ''
    }
  }

  const toggleExtraImage = (url) => {
    setCreateForm((prev) => ({
      ...prev,
      images: prev.images.includes(url) ? prev.images.filter((u) => u !== url) : [...prev.images, url],
    }))
  }

  const toggleEditExtraImage = (url) => {
    setEditForm((prev) => {
      const images = parseCsv(prev.imagesText || '')
      const next = images.includes(url) ? images.filter((u) => u !== url) : [...images, url]
      return { ...prev, imagesText: next.join(', ') }
    })
  }

  const updateCreateField = (key, value) => {
    setCreateForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'name_uz' && !prev.slug ? { slug: slugify(value) } : {}),
    }))
  }

  const removeProduct = async (id) => {
    if (!confirm("Mahsulotni o'chirasizmi?")) return
    try {
      await productsApi.remove(id)
      await load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">

        {/* Product Table */}
        <section className="lg:col-span-7 bg-surface-container-lowest rounded-xl ambient-shadow overflow-hidden">
          <div className="p-5 border-b border-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white">
            <h3 className="font-headline font-bold text-on-surface">
              Mahsulotlar {total > 0 && <span className="text-on-surface-variant font-normal text-sm">({total})</span>}
            </h3>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-56">
                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={16} />
                <input className="w-full pl-9 pr-3 py-2 bg-surface-container-high border-none rounded-lg text-sm outline-none"
                  placeholder="Qidirish..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                className="bg-surface-container-high border-none rounded-lg text-sm px-3 py-2 outline-none font-medium">
                <option value="all">Barchasi</option>
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name?.uz}</option>)}
              </select>
              <button
                onClick={openCreateModal}
                className="bg-primary text-white rounded-lg px-3 py-2 text-sm font-bold whitespace-nowrap"
              >
                + Qo'shish
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Icon name="hourglass_empty" className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    <th className="px-5 py-4">Mahsulot</th>
                    <th className="px-5 py-4 hidden md:table-cell">Kategoriya</th>
                    <th className="px-5 py-4">Holat</th>
                    <th className="px-5 py-4 hidden md:table-cell">Narx</th>
                    <th className="px-5 py-4 hidden md:table-cell">Ko'rinsinmi</th>
                    <th className="px-5 py-4">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low">
                  {products.map(product => (
                    <tr key={product.id} className={`hover:bg-surface-container-low/30 transition-colors ${editing === product.id ? 'bg-primary-fixed/20' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <SmartImage
                            src={product.mainImage}
                            alt=""
                            className="w-12 h-12 rounded-lg bg-surface-container-high shrink-0 overflow-hidden object-cover"
                            placeholderClass="w-12 h-12 rounded-lg"
                          />
                          <div>
                            <p className="font-bold text-sm text-primary line-clamp-1">{product.name?.uz || product.name?.en}</p>
                            <p className="text-xs text-on-surface-variant">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-on-surface-variant hidden md:table-cell capitalize">
                        {product.category?.name?.uz || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleActive(product.id)} disabled={toggling === product.id}
                          className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${product.isActive ? 'bg-secondary' : 'bg-surface-container-highest'}`}>
                          <span className={`absolute w-4 h-4 bg-white rounded-full shadow transition-all ${product.isActive ? 'left-5' : 'left-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-on-surface hidden md:table-cell whitespace-nowrap">
                        {product.showPrice !== false
                          ? `${new Intl.NumberFormat('uz-UZ').format(product.price)} UZS`
                          : 'Yashirilgan'}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${product.showPrice !== false ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {product.showPrice !== false ? "Ko'rinadi" : "Ko'rinmaydi"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => startEdit(product)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors mr-1">
                          <Icon name="edit" size={18} />
                        </button>
                        <button onClick={() => removeProduct(product.id)}
                          className="p-1.5 text-error hover:bg-error-container rounded-lg transition-colors">
                          <Icon name="delete" size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="p-12 text-center">
                  <Icon name="search_off" size={48} className="text-outline-variant mx-auto mb-3" />
                  <p className="text-on-surface-variant font-medium">Mahsulot topilmadi</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Edit form */}
        <section className="lg:col-span-5 bg-surface-container-lowest rounded-xl ambient-shadow p-6 md:p-8 sticky top-24">
          {editing && editingProduct ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline font-bold text-xl text-primary">Tahrirlash</h3>
                <div className="flex bg-surface-container-high p-1 rounded-full">
                  {['uz', 'ru', 'en'].map(l => (
                    <button key={l} onClick={() => setEditLang(l)}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${editLang === l ? 'bg-white text-primary shadow-sm' : 'text-on-surface-variant'}`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <SmartImage
                  src={editingProduct.mainImage}
                  alt=""
                  className="w-full h-36 rounded-xl overflow-hidden bg-surface-container-low object-contain p-3"
                  placeholderClass="w-full h-36 rounded-xl"
                />

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Nomi ({editLang.toUpperCase()})</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    value={editForm[`name_${editLang}`] || ''} onChange={e => setEditForm(f => ({ ...f, [`name_${editLang}`]: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Qisqa matn ({editLang.toUpperCase()})</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm" rows={2}
                    value={editForm[`excerpt_${editLang}`] || ''} onChange={e => setEditForm(f => ({ ...f, [`excerpt_${editLang}`]: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Tavsif ({editLang.toUpperCase()})</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm" rows={3}
                    value={editForm[`desc_${editLang}`] || ''} onChange={e => setEditForm(f => ({ ...f, [`desc_${editLang}`]: e.target.value }))} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Narx (UZS)</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      type="number" value={editForm.price || ''} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">SKU</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      value={editForm.sku || ''} onChange={e => setEditForm(f => ({ ...f, sku: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Kategoriya</label>
                    <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      value={editForm.categoryId || ''} onChange={e => setEditForm(f => ({ ...f, categoryId: e.target.value }))}>
                      <option value="">Tanlanmagan</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name?.uz}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Sort order</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      type="number" value={editForm.sortOrder || 0} onChange={e => setEditForm(f => ({ ...f, sortOrder: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Asosiy rasm URL</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    value={editForm.mainImage || ''} onChange={e => setEditForm(f => ({ ...f, mainImage: e.target.value }))} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Qo'shimcha rasmlar URL (vergul bilan)</label>
                  <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                    value={editForm.imagesText || ''} onChange={e => setEditForm(f => ({ ...f, imagesText: e.target.value }))} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase">Media tanlash</label>
                    <button type="button" onClick={loadMedia} className="text-xs font-bold text-primary">Yangilash</button>
                  </div>
                  {mediaLoading ? (
                    <p className="text-xs text-on-surface-variant">Media yuklanmoqda...</p>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                      {mediaItems.map((m) => {
                        const isMain = editForm.mainImage === m.url
                        const isExtra = parseCsv(editForm.imagesText || '').includes(m.url)
                        return (
                          <div key={m.id} className={`relative rounded-lg overflow-hidden border-2 ${isMain ? 'border-primary' : 'border-transparent'}`}>
                            <button type="button" onClick={() => setEditForm(f => ({ ...f, mainImage: m.url }))} className="block w-full">
                              <SmartImage src={m.url} alt={m.alt || ''} className="w-full h-16 object-cover" placeholderClass="w-full h-16" />
                            </button>
                            <button type="button" onClick={() => toggleEditExtraImage(m.url)} className={`absolute right-1 top-1 w-5 h-5 rounded-full text-[10px] font-bold ${isExtra ? 'bg-primary text-white' : 'bg-white/90 text-primary'}`}>
                              {isExtra ? '✓' : '+'}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Specs (har qatorda: nom: qiymat)</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm min-h-24"
                    value={editForm.specsText || ''} onChange={e => setEditForm(f => ({ ...f, specsText: e.target.value }))} placeholder={`Og'irlik: 12 kg\nKenglik: 45 cm`} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Tags</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      value={editForm.tagsText || ''} onChange={e => setEditForm(f => ({ ...f, tagsText: e.target.value }))} placeholder="Electric, Foldable" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-2">Badge</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-secondary outline-none text-sm"
                      value={editForm.badge || ''} onChange={e => setEditForm(f => ({ ...f, badge: e.target.value }))} placeholder="New" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="inline-flex items-center gap-3 text-sm font-semibold text-primary">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={Boolean(editForm.showPrice)}
                      onChange={(e) => setEditForm((f) => ({ ...f, showPrice: e.target.checked }))}
                    />
                    Narxni ko'rsatish
                  </label>
                  <label className="inline-flex items-center gap-3 text-sm font-semibold text-primary">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      checked={Boolean(editForm.isFeatured)}
                      onChange={(e) => setEditForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                    />
                    Featured
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={saveEdit} disabled={saving}
                    className="flex-grow signature-gradient text-on-primary py-3 rounded-lg font-bold shadow-md hover:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                    {saving ? <Icon name="hourglass_empty" className="animate-spin" size={18} /> : <Icon name="save" size={18} />}
                    Saqlash
                  </button>
                  <button onClick={() => setEditing(null)}
                    className="px-5 py-3 border border-outline-variant text-primary rounded-lg font-bold hover:bg-surface-container-low transition-colors">
                    Bekor
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-on-surface-variant">
              <Icon name="edit" size={48} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Tahrirlash uchun mahsulot tanlang</p>
              <p className="text-sm mt-1 opacity-70">Jadvalda ✏️ tugmasini bosing</p>
            </div>
          )}
        </section>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm p-4 flex items-center justify-center">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-5 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline font-bold text-xl text-primary">Yangi mahsulot qo'shish</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-surface-container-low">
                <Icon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-xs font-bold text-on-surface-variant">Slug
                <div className="mt-1 flex gap-2">
                  <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.slug} onChange={(e) => updateCreateField('slug', slugify(e.target.value))} />
                  <button type="button" onClick={() => updateCreateField('slug', slugify(createForm.name_uz || createForm.name_en || createForm.sku))} className="px-3 py-2 bg-surface-container-high rounded-lg text-xs font-bold">Auto</button>
                </div>
              </label>
              <label className="text-xs font-bold text-on-surface-variant">SKU
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.sku} onChange={(e) => setCreateForm(f => ({ ...f, sku: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Kategoriya
                <select className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.categoryId} onChange={(e) => setCreateForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">Tanlang</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name?.uz}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Narx (UZS)
                <input type="number" className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.price} onChange={(e) => setCreateForm(f => ({ ...f, price: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Sort order
                <input type="number" className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.sortOrder} onChange={(e) => setCreateForm(f => ({ ...f, sortOrder: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={Boolean(createForm.showPrice)}
                  onChange={(e) => setCreateForm((f) => ({ ...f, showPrice: e.target.checked }))}
                />
                Narx ko'rinsin
              </label>
              <label className="text-xs font-bold text-on-surface-variant flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={Boolean(createForm.isFeatured)}
                  onChange={(e) => setCreateForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                />
                Featured
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (UZ)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.name_uz} onChange={(e) => updateCreateField('name_uz', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Nomi (RU)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.name_ru} onChange={(e) => updateCreateField('name_ru', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant md:col-span-2">Nomi (EN)
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.name_en} onChange={(e) => updateCreateField('name_en', e.target.value)} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Qisqa matn (UZ)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-20" value={createForm.excerpt_uz} onChange={(e) => setCreateForm(f => ({ ...f, excerpt_uz: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Qisqa matn (RU)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-20" value={createForm.excerpt_ru} onChange={(e) => setCreateForm(f => ({ ...f, excerpt_ru: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant md:col-span-2">Qisqa matn (EN)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-20" value={createForm.excerpt_en} onChange={(e) => setCreateForm(f => ({ ...f, excerpt_en: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Tavsif (UZ)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-24" value={createForm.desc_uz} onChange={(e) => setCreateForm(f => ({ ...f, desc_uz: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Tavsif (RU)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-24" value={createForm.desc_ru} onChange={(e) => setCreateForm(f => ({ ...f, desc_ru: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant md:col-span-2">Tavsif (EN)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-24" value={createForm.desc_en} onChange={(e) => setCreateForm(f => ({ ...f, desc_en: e.target.value }))} />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Tags
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.tagsText} onChange={(e) => setCreateForm(f => ({ ...f, tagsText: e.target.value }))} placeholder="Electric, Foldable" />
              </label>
              <label className="text-xs font-bold text-on-surface-variant">Badge
                <input className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm" value={createForm.badge} onChange={(e) => setCreateForm(f => ({ ...f, badge: e.target.value }))} placeholder="New" />
              </label>
              <label className="text-xs font-bold text-on-surface-variant md:col-span-2">Specs (har qatorda: nom: qiymat)
                <textarea className="mt-1 w-full bg-surface-container-low rounded-lg px-3 py-2 text-sm min-h-24" value={createForm.specsText} onChange={(e) => setCreateForm(f => ({ ...f, specsText: e.target.value }))} placeholder={`Og'irlik: 12 kg\nKenglik: 45 cm`} />
              </label>

              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-on-surface-variant">Rasmlar</p>
                  <label className="inline-flex items-center gap-2 bg-surface-container-low rounded-lg px-3 py-2 text-xs font-bold cursor-pointer">
                    <Icon name="upload" size={16} />
                    Yangi rasm yuklash
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadMedia} />
                  </label>
                </div>

                <SmartImage
                  src={createForm.mainImage}
                  alt=""
                  className="rounded-xl overflow-hidden bg-surface-container-low h-36 w-full object-contain"
                  placeholderClass="rounded-xl h-36 w-full"
                />

                <p className="text-[11px] text-on-surface-variant">
                  Asosiy rasmni tanlash uchun thumbnail ustiga bosing. Qo'shimcha rasmlar uchun `+` tugmasini bosing.
                </p>

                {mediaLoading ? (
                  <div className="text-xs text-on-surface-variant">Media yuklanmoqda...</div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                    {mediaItems.map((m) => {
                      const isMain = createForm.mainImage === m.url
                      const isExtra = createForm.images.includes(m.url)
                      return (
                        <div key={m.id} className={`relative rounded-lg overflow-hidden border-2 ${isMain ? 'border-primary' : 'border-transparent'}`}>
                          <button
                            type="button"
                            onClick={() => setCreateForm((f) => ({ ...f, mainImage: m.url }))}
                            className="block w-full"
                          >
                            <SmartImage src={m.url} alt={m.alt || ''} className="w-full h-20 object-cover" placeholderClass="w-full h-20" />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleExtraImage(m.url)}
                            className={`absolute right-1 top-1 w-6 h-6 rounded-full text-xs font-bold ${isExtra ? 'bg-primary text-white' : 'bg-white/90 text-primary'}`}
                            title="Qo'shimcha rasm"
                          >
                            {isExtra ? '✓' : '+'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={createProduct} disabled={creating} className="bg-primary text-white rounded-lg px-4 py-2 text-sm font-bold">
                {creating ? 'Saqlanmoqda...' : "Qo'shish"}
              </button>
              <button onClick={() => setShowCreateModal(false)} className="bg-surface-container-low rounded-lg px-4 py-2 text-sm font-bold">
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
