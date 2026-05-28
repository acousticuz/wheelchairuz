import { useState, useEffect, useCallback } from 'react'
import { inquiriesApi } from '../../hooks/useApi'
import Icon from '../../components/Icon'

const STATUS_COLORS = {
  new: 'bg-secondary-container text-on-secondary-container',
  replied: 'bg-surface-container-high text-on-surface-variant',
  archived: 'bg-surface-container-highest text-outline',
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [stats, setStats] = useState({ new: 0, replied: 0, archived: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [reply, setReply] = useState('')
  const [updating, setUpdating] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [i, s] = await Promise.all([
        inquiriesApi.list({ status: filterStatus }),
        inquiriesApi.stats(),
      ])
      setInquiries(i.data || [])
      setStats(s)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [filterStatus])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    setUpdating(true)
    try {
      const updated = await inquiriesApi.update(id, { status })
      setInquiries(qs => qs.map(q => q.id === id ? updated : q))
      if (selected === id) setSelected(updated.id)
      await load()
    } catch (e) { alert(e.message) }
    finally { setUpdating(false) }
  }

  const deleteInquiry = async (id) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return
    try {
      await inquiriesApi.remove(id)
      setInquiries(qs => qs.filter(q => q.id !== id))
      if (selected === id) setSelected(null)
    } catch (e) { alert(e.message) }
  }

  const sendReply = async () => {
    if (!reply.trim()) return
    setUpdating(true)
    try {
      const updated = await inquiriesApi.update(selected, { status: 'replied', adminNote: reply.trim() })
      setInquiries(qs => qs.map(q => q.id === updated.id ? updated : q))
      setSelected(updated.id)
      await load()
    } catch (e) {
      alert(e.message)
    } finally {
      setUpdating(false)
    }
    setReply('')
    alert('Javob eslatmasi saqlandi va holat "replied" ga o\'zgartirildi.')
  }

  const activeInquiry = inquiries.find(i => i.id === selected)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {/* Stats bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'Barchasi', count: stats.total },
          { key: 'new', label: 'Yangi', count: stats.new },
          { key: 'replied', label: 'Javob berilgan', count: stats.replied },
          { key: 'archived', label: 'Arxivlangan', count: stats.archived },
        ].map(s => (
          <button key={s.key} onClick={() => setFilterStatus(s.key)}
            className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${filterStatus === s.key ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'}`}>
            {s.label} ({s.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Icon name="hourglass_empty" className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* List */}
          <div className="xl:col-span-4 space-y-3">
            {inquiries.map(inq => (
              <div key={inq.id} onClick={() => setSelected(inq.id)}
                className={`p-5 rounded-xl cursor-pointer transition-all ${
                  selected === inq.id
                    ? 'bg-surface-container-lowest border-l-4 border-secondary ambient-shadow'
                    : 'bg-surface-container-lowest hover:border-l-4 hover:border-outline-variant/30 border border-transparent'
                }`}>
                <div className="flex justify-between mb-2">
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${inq.status === 'new' ? 'text-secondary' : 'text-on-surface-variant'}`}>
                    {inq.status === 'new' && <span className="w-2 h-2 rounded-full bg-secondary inline-block" />}
                    {inq.status}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {new Date(inq.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                <h4 className="font-bold text-on-surface mb-1">{inq.firstName} {inq.lastName}</h4>
                <p className="text-xs text-on-surface-variant font-medium mb-1">{inq.phone}</p>
                <p className="text-xs text-on-surface-variant line-clamp-2">{inq.message}</p>
              </div>
            ))}
            {inquiries.length === 0 && (
              <div className="p-8 text-center text-on-surface-variant">
                <Icon name="inbox" size={40} className="mx-auto mb-2 opacity-30" />
                <p>So'rovlar yo'q</p>
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl ambient-shadow flex flex-col min-h-[500px]">
            {activeInquiry ? (
              <>
                <div className="p-5 md:p-6 border-b border-surface-container-low flex flex-col md:flex-row justify-between md:items-center gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-black text-sm">
                      {activeInquiry.firstName?.[0]}{activeInquiry.lastName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">{activeInquiry.firstName} {activeInquiry.lastName}</h4>
                      <p className="text-xs text-on-surface-variant">{activeInquiry.phone}{activeInquiry.email && ` • ${activeInquiry.email}`}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select value={activeInquiry.status} onChange={e => updateStatus(activeInquiry.id, e.target.value)} disabled={updating}
                      className="bg-surface-container-high border-none rounded-lg px-3 py-2 text-xs font-bold outline-none text-primary disabled:opacity-50">
                      <option value="new">Yangi</option>
                      <option value="replied">Javob berilgan</option>
                      <option value="archived">Arxivlangan</option>
                    </select>
                    <button onClick={() => deleteInquiry(activeInquiry.id)}
                      className="p-2 hover:bg-error-container text-error rounded-lg transition-colors">
                      <Icon name="delete" size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-grow p-5 md:p-8 overflow-y-auto space-y-6">
                  {/* Message bubble */}
                  <div className="bg-surface-container-low p-5 rounded-2xl rounded-tl-none inline-block max-w-[90%]">
                    <p className="text-sm leading-relaxed text-on-surface">{activeInquiry.message || '(Xabar yo\'q)'}</p>
                    <p className="text-[10px] text-on-surface-variant mt-2">
                      {new Date(activeInquiry.createdAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>

                  {activeInquiry.productName && (
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg">
                      <Icon name="shopping_cart" size={14} />
                      Mahsulot: <strong>{activeInquiry.productName}</strong>
                    </div>
                  )}

                  {activeInquiry.adminNote && (
                    <div className="bg-tertiary-fixed p-4 rounded-xl text-sm">
                      <p className="font-bold text-on-tertiary-fixed text-xs mb-1">Admin eslatma:</p>
                      <p className="text-on-tertiary-fixed-variant">{activeInquiry.adminNote}</p>
                    </div>
                  )}

                  {/* Quick reply / note */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase mb-3">Admin eslatma yoki tezkor javob</label>
                    <div className="relative">
                      <textarea className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary outline-none text-sm min-h-[100px] pr-14"
                        placeholder="Eslatma yozing..." value={reply} onChange={e => setReply(e.target.value)} />
                      <button onClick={sendReply}
                        disabled={updating}
                        className="absolute bottom-4 right-4 bg-primary text-on-primary p-2 rounded-lg hover:scale-105 transition-all">
                        <Icon name="check" size={18} />
                      </button>
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={async () => {
                          if (!reply.trim()) return
                          setUpdating(true)
                          try {
                            const updated = await inquiriesApi.update(activeInquiry.id, { adminNote: reply.trim() })
                            setInquiries(qs => qs.map(q => q.id === updated.id ? updated : q))
                            setSelected(updated.id)
                            await load()
                            alert('Admin eslatma saqlandi.')
                          } catch (e) {
                            alert(e.message)
                          } finally {
                            setUpdating(false)
                          }
                        }}
                        className="text-xs px-3 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors"
                      >
                        Faqat eslatmani saqlash
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {["Tez orada bog'lanamiz", "Mahsulot haqida ma'lumot yuborildi", "Buyurtma qabul qilindi"].map((qr) => (
                        <button key={qr} onClick={() => setReply(qr)}
                          className="text-xs px-3 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors">
                          {qr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant">
                <div className="text-center">
                  <Icon name="mark_email_read" size={56} className="mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Ko'rish uchun so'rov tanlang</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
