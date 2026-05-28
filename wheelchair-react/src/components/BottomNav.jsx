import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import Icon from './Icon'

export default function BottomNav() {
  const { t } = useLang()
  const location = useLocation()

  const tabs = [
    { href: '/', icon: 'home', label: t('bottom_nav.home') },
    { href: '/catalog', icon: 'category', label: t('bottom_nav.catalog') },
    { href: '/about', icon: 'info', label: t('bottom_nav.about') },
    { href: '/contact', icon: 'mail', label: t('bottom_nav.contact') },
  ]

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-100 flex justify-around items-center px-4 py-3 z-50">
      {tabs.map(tab => (
        <Link
          key={tab.href}
          to={tab.href}
          className={`flex flex-col items-center gap-1 transition-colors ${
            isActive(tab.href) ? 'text-blue-700' : 'text-slate-400'
          }`}
        >
          <Icon name={tab.icon} filled={isActive(tab.href)} />
          <span className="text-[10px] font-bold">{tab.label}</span>
        </Link>
      ))}
    </nav>
  )
}
