import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi, inquiriesApi } from '../../hooks/useApi'
import { useLang } from '../../hooks/useLang'
import Icon from '../../components/Icon'
import SmartImage from '../../components/SmartImage'

export default function AdminDashboard() {
  const { lang } = useLang()
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [inquiries, setInquiries] = useState([])
  const [stats, setStats] = useState({ new: 0, replied: 0, archived: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productsApi.adminList({ page: 1, limit: 4 }),
      inquiriesApi.list({ page: 1, limit: 5 }),
      inquiriesApi.stats(),
    ])
      .then(([p, i, s]) => {
        setProducts(p.data || [])
        setTotalProducts(p.total || (p.data || []).length)
        setInquiries(i.data || [])
        setStats(s)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusColors = {
    new: 'bg-secondary-container text-on-secondary-container',
    replied: 'bg-surface-container-high text-on-surface-variant',
    archived: 'bg-surface-container-highest text-outline',
  }
  const statusText = {
    uz: { new: 'Yangi', replied: "Javob berilgan", archived: 'Arxiv' },
    ru: { new: 'Новый', replied: 'Отвечен', archived: 'Архив' },
    en: { new: 'New', replied: 'Replied', archived: 'Archived' },
  }
  const copy = {
    uz: {
      totalProductsValue: 'Mahsulotlar umumiy qiymati',
      productsCount: 'mahsulot',
      totalProducts: 'Jami mahsulotlar',
      active: 'Faol',
      unreadMessages: "O'qilmagan xabarlar",
      totalSuffix: 'jami',
      urgent: 'Shoshilinch',
      recentProducts: "So'nggi mahsulotlar",
      updatedProducts: 'Yangilangan mahsulotlar',
      viewAll: "Barchasini ko'r",
      inactive: 'Nofaol',
      noProducts: "Mahsulotlar yo'q",
      quickActions: 'Tezkor harakatlar',
      product: 'Mahsulot',
      messages: 'Xabarlar',
      apiDocs: 'API hujjatlari',
      apiText: 'Swagger orqali barcha API endpointlarini tekshiring.',
      latestMessages: "So'nggi xabarlar",
      newSuffix: 'yangi',
      noMessages: "Xabar yo'q",
      inquiriesTable: "So'rovlar jadvali",
      totalInquiries: "Jami: {count} ta so'rov",
      all: 'Barchasi',
      customer: 'Mijoz',
      phone: 'Telefon',
      message: 'Xabar',
      status: 'Holat',
      time: 'Vaqt',
      noInquiries: "So'rovlar yo'q",
    },
    ru: {
      totalProductsValue: 'Общая стоимость товаров',
      productsCount: 'товаров',
      totalProducts: 'Всего товаров',
      active: 'Активно',
      unreadMessages: 'Непрочитанные сообщения',
      totalSuffix: 'всего',
      urgent: 'Срочно',
      recentProducts: 'Последние товары',
      updatedProducts: 'Недавно обновленные товары',
      viewAll: 'Смотреть все',
      inactive: 'Неактивно',
      noProducts: 'Товаров нет',
      quickActions: 'Быстрые действия',
      product: 'Товар',
      messages: 'Сообщения',
      apiDocs: 'Документация API',
      apiText: 'Проверьте все API endpoint через Swagger.',
      latestMessages: 'Последние сообщения',
      newSuffix: 'новых',
      noMessages: 'Сообщений нет',
      inquiriesTable: 'Таблица обращений',
      totalInquiries: 'Всего: {count} обращений',
      all: 'Все',
      customer: 'Клиент',
      phone: 'Телефон',
      message: 'Сообщение',
      status: 'Статус',
      time: 'Время',
      noInquiries: 'Обращений нет',
    },
    en: {
      totalProductsValue: 'Total products value',
      productsCount: 'products',
      totalProducts: 'Total products',
      active: 'Active',
      unreadMessages: 'Unread messages',
      totalSuffix: 'total',
      urgent: 'Urgent',
      recentProducts: 'Recent products',
      updatedProducts: 'Recently updated products',
      viewAll: 'View all',
      inactive: 'Inactive',
      noProducts: 'No products',
      quickActions: 'Quick actions',
      product: 'Product',
      messages: 'Messages',
      apiDocs: 'API docs',
      apiText: 'Check all API endpoints through Swagger.',
      latestMessages: 'Latest messages',
      newSuffix: 'new',
      noMessages: 'No messages',
      inquiriesTable: 'Inquiries table',
      totalInquiries: 'Total: {count} inquiries',
      all: 'All',
      customer: 'Customer',
      phone: 'Phone',
      message: 'Message',
      status: 'Status',
      time: 'Time',
      noInquiries: 'No inquiries',
    },
  }
  const tr = copy[lang] || copy.uz

  const totalValue = products.reduce((s, p) => s + Number(p.price), 0)
  const priceLocale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ'

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 md:pb-8">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Icon name="hourglass_empty" className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <div className="md:col-span-2 signature-gradient p-8 rounded-xl text-on-primary flex flex-col justify-between relative overflow-hidden ambient-shadow">
              <div className="relative z-10">
                <p className="font-headline font-semibold text-on-primary/70 text-sm mb-1 uppercase tracking-wider">{tr.totalProductsValue}</p>
                <h3 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                  {new Intl.NumberFormat(priceLocale).format(totalValue)} UZS
                </h3>
                <div className="flex items-center gap-2 text-secondary-container text-sm">
                  <Icon name="trending_up" size={16} />
                  <span>{totalProducts} {tr.productsCount}</span>
                </div>
              </div>
              <div className="absolute -right-12 -bottom-12 opacity-10">
                <Icon name="account_balance_wallet" size={160} />
              </div>
            </div>

            {[
              { label: tr.totalProducts, value: totalProducts, icon: 'wheelchair_pickup', color: 'text-primary', bg: 'bg-primary/5', sub: tr.active },
              { label: tr.unreadMessages, value: stats.new, icon: 'forum', color: 'text-tertiary', bg: 'bg-tertiary-fixed/30', sub: `${stats.total} ${tr.totalSuffix}`, urgent: stats.new > 0 },
            ].map((s, i) => (
              <div key={i} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 ambient-shadow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 ${s.bg} ${s.color} rounded-lg`}><Icon name={s.icon} /></div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${s.urgent ? 'bg-error text-white' : 'bg-secondary-container/30 text-secondary'}`}>
                    {s.urgent ? tr.urgent : tr.active}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm font-medium">{s.label}</p>
                <h4 className="text-2xl font-bold font-headline mt-1">{s.value}</h4>
                <p className="text-xs text-on-surface-variant/60 mt-auto pt-3 border-t border-outline-variant/5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Recent Products */}
            <section className="lg:col-span-8">
              <div className="flex justify-between items-end mb-5">
                <div>
                  <h3 className="text-lg font-bold font-headline">{tr.recentProducts}</h3>
                  <p className="text-sm text-on-surface-variant">{tr.updatedProducts}</p>
                </div>
                <Link to="/admin/products" className="text-primary font-semibold text-sm hover:underline flex items-center gap-1">
                  {tr.viewAll} <Icon name="arrow_forward" size={16} />
                </Link>
              </div>

              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-surface-container-low hover:bg-surface-container-lowest rounded-xl transition-all border border-transparent hover:border-outline-variant/20 hover:shadow-sm">
                    <SmartImage
                      src={product.mainImage}
                      alt={product.name?.en}
                      className="w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-outline-variant/10 object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{product.name?.[lang] || product.name?.uz || product.name?.ru || product.name?.en}</p>
                      <p className="text-xs text-on-surface-variant">SKU: {product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-secondary">{new Intl.NumberFormat(priceLocale).format(product.price)} UZS</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${product.isActive ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                        {product.isActive ? tr.active : tr.inactive}
                      </span>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="text-center py-12 text-on-surface-variant">
                    <Icon name="inventory_2" size={48} className="mx-auto mb-2 opacity-30" />
                    <p>{tr.noProducts}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-5">
              <div className="bg-surface-container-high/50 p-5 rounded-xl border border-outline-variant/10">
                <h4 className="font-bold text-sm mb-4">{tr.quickActions}</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/admin/products" className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest rounded-lg hover:bg-primary hover:text-white transition-all text-primary">
                    <Icon name="add_circle" /><span className="text-[10px] font-bold uppercase">{tr.product}</span>
                  </Link>
                  <Link to="/admin/inquiries" className="flex flex-col items-center gap-2 p-4 bg-surface-container-lowest rounded-lg hover:bg-primary hover:text-white transition-all text-primary">
                    <Icon name="mail" /><span className="text-[10px] font-bold uppercase">{tr.messages}</span>
                  </Link>
                </div>
              </div>

              <div className="bg-tertiary-fixed text-on-tertiary-fixed p-5 rounded-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="tips_and_updates" size={16} />
                    <h4 className="text-xs font-bold uppercase tracking-widest">{tr.apiDocs}</h4>
                  </div>
                  <p className="text-sm font-semibold leading-relaxed">{tr.apiText}</p>
                  <a href="/api/docs" target="_blank" rel="noopener noreferrer"
                    className="mt-4 text-xs font-bold underline underline-offset-4 inline-flex items-center gap-1">
                    /api/docs <Icon name="open_in_new" size={12} />
                  </a>
                </div>
              </div>

              {/* Inquiries mini */}
              <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 ambient-shadow">
                <h4 className="font-bold text-sm mb-4 flex justify-between items-center">
                  {tr.latestMessages}
                  {stats.new > 0 && <span className="text-[10px] bg-error text-white px-2 py-0.5 rounded-full">{stats.new} {tr.newSuffix}</span>}
                </h4>
                <div className="space-y-4">
                  {inquiries.slice(0, 3).map(inq => (
                    <div key={inq.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold shrink-0">
                        {inq.firstName?.[0]}{inq.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{inq.firstName} {inq.lastName}</p>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{inq.message || inq.phone}</p>
                      </div>
                    </div>
                  ))}
                  {inquiries.length === 0 && <p className="text-xs text-on-surface-variant text-center py-2">{tr.noMessages}</p>}
                </div>
                <Link to="/admin/inquiries" className="w-full mt-5 py-2 bg-surface-container-low text-xs font-bold rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center">
                  {tr.viewAll}
                </Link>
              </div>
            </aside>
          </div>

          {/* Inquiries table */}
          <section className="mt-8">
            <div className="flex items-end justify-between mb-5 px-1">
              <div>
                <h3 className="font-headline font-bold text-2xl text-primary">{tr.inquiriesTable}</h3>
                <p className="text-on-surface-variant text-sm">{tr.totalInquiries.replace('{count}', stats.total)}</p>
              </div>
              <Link to="/admin/inquiries" className="text-sm font-bold text-primary flex items-center gap-1">
                {tr.all} <Icon name="arrow_forward" size={16} />
              </Link>
            </div>

            <div className="bg-surface-container-lowest rounded-xl ambient-shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/50 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      <th className="px-6 py-4">{tr.customer}</th>
                      <th className="px-6 py-4 hidden md:table-cell">{tr.phone}</th>
                      <th className="px-6 py-4 hidden lg:table-cell">{tr.message}</th>
                      <th className="px-6 py-4">{tr.status}</th>
                      <th className="px-6 py-4">{tr.time}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {inquiries.map(inq => (
                      <tr key={inq.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs shrink-0">
                              {inq.firstName?.[0]}{inq.lastName?.[0]}
                            </div>
                            <span className="font-bold text-sm text-primary whitespace-nowrap">{inq.firstName} {inq.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant hidden md:table-cell">{inq.phone}</td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant max-w-xs hidden lg:table-cell">
                          <p className="line-clamp-2">{inq.message}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inq.status] || statusColors.replied}`}>
                            {statusText[lang]?.[inq.status] || inq.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-on-surface-variant whitespace-nowrap">
                          {new Date(inq.createdAt).toLocaleDateString(priceLocale)}
                        </td>
                      </tr>
                    ))}
                    {inquiries.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">{tr.noInquiries}</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
