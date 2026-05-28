import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import LangSwitcher from '../../components/LangSwitcher'
import Icon from '../../components/Icon'
import { inquiriesApi } from '../../hooks/useApi'

const baseNavItems = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/home-builder', icon: 'dashboard_customize', label: 'Bosh sahifa' },
  { href: '/admin/about', icon: 'info', label: 'About sahifa' },
  { href: '/admin/products', icon: 'wheelchair_pickup', label: 'Products', badge: null },
  { href: '/admin/categories', icon: 'category', label: 'Categories' },
  { href: '/admin/inquiries', icon: 'mail', label: 'Messages', badge: null },
  { href: '/admin/content', icon: 'article', label: 'Content' },
  { href: '/admin/media', icon: 'photo_library', label: 'Media' },
  { href: '/admin/languages', icon: 'language', label: 'Languages' },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileSideOpen, setMobileSideOpen] = useState(false)
  const [newInquiries, setNewInquiries] = useState(0)

  const isActive = (href) => location.pathname === href
  const navItems = useMemo(() => baseNavItems.map((item) => (
    item.href === '/admin/inquiries' ? { ...item, badge: newInquiries > 0 ? newInquiries : null } : item
  )), [newInquiries])

  useEffect(() => {
    let mounted = true
    const loadStats = async () => {
      try {
        const stats = await inquiriesApi.stats()
        if (mounted) setNewInquiries(stats?.new || 0)
      } catch {
        if (mounted) setNewInquiries(0)
      }
    }
    loadStats()
    const timer = setInterval(loadStats, 30000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    navigate('/admin/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Sidebar (Desktop) ── */}
      <aside className="hidden md:flex flex-col h-screen w-64 border-r border-outline-variant/15 bg-slate-50 sticky top-0">
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {/* Brand */}
          <div className="px-4 py-6 mb-2">
            <h1 className="text-lg font-black text-blue-900 font-headline">wheelchair.uz</h1>
            <p className="text-xs font-semibold text-blue-800 mt-1">Admin Panel</p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3 px-4 py-4 mb-6 bg-surface-container-low rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">A</div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Admin User</p>
              <p className="text-[10px] text-on-surface-variant truncate">Super Admin</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <Link key={item.href} to={item.href}
                className={`px-4 py-3 mb-1 flex items-center gap-3 rounded-xl transition-all font-headline font-semibold text-sm ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-900 translate-x-1'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}>
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-outline-variant/15 space-y-1">
            <Link to="/" className="text-slate-500 hover:text-blue-600 px-4 py-3 flex items-center gap-3 transition-all text-xs font-semibold">
              <Icon name="open_in_new" size={18} /> Saytga o'tish
            </Link>
            <button onClick={handleLogout} className="w-full text-left text-slate-500 hover:text-error px-4 py-3 flex items-center gap-3 transition-all text-xs font-semibold">
              <Icon name="logout" size={18} /> Chiqish
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileSideOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileSideOpen(false)} />
          <div className="relative w-64 bg-slate-50 h-full flex flex-col p-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 mb-4">
              <h1 className="text-lg font-black text-blue-900 font-headline">Admin Panel</h1>
              <button onClick={() => setMobileSideOpen(false)}><Icon name="close" /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map(item => (
                <Link key={item.href} to={item.href} onClick={() => setMobileSideOpen(false)}
                  className={`px-4 py-3 flex items-center gap-3 rounded-xl transition-all font-semibold text-sm ${
                    isActive(item.href) ? 'bg-blue-100 text-blue-900' : 'text-slate-600 hover:bg-slate-200'
                  }`}>
                  <Icon name={item.icon} size={20} />
                  <span>{item.label}</span>
                  {item.badge && <span className="ml-auto bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>}
                </Link>
              ))}
            </nav>
            <button onClick={handleLogout} className="mt-4 px-4 py-3 flex items-center gap-3 text-error text-sm font-semibold">
              <Icon name="logout" /> Chiqish
            </button>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top bar */}
        <header className="glass bg-white/80 border-b border-outline-variant/10 h-16 flex items-center justify-between px-4 md:px-8 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSideOpen(true)} className="md:hidden p-2 hover:bg-surface-container-low rounded-lg">
              <Icon name="menu" className="text-primary" />
            </button>
            <h2 className="font-headline font-bold text-lg text-primary truncate">
              {navItems.find(n => isActive(n.href))?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative">
              <Icon name="notifications" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
            </button>
            <button className="hidden md:flex p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Icon name="search" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Admin footer */}
        <footer className="border-t border-slate-200 bg-slate-50 shrink-0">
          <div className="px-6 py-3 flex justify-between items-center">
            <p className="text-xs text-slate-500">© 2024 wheelchair.uz Admin Panel</p>
          </div>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-2 z-50">
        {navItems.slice(0, 4).map(item => (
          <Link key={item.href} to={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              isActive(item.href) ? 'bg-blue-100 text-blue-900' : 'text-slate-500'
            }`}>
            <Icon name={item.icon} size={20} />
            <span className="text-[9px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
