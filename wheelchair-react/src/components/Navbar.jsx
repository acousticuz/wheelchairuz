import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import LangSwitcher from './LangSwitcher'
import Icon from './Icon'

export default function Navbar() {
  const { t } = useLang()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/catalog?cat=wheelchairs', label: t('nav.wheelchairs') },
    { href: '/catalog?cat=walkers', label: t('nav.walkers') },
  ]

  const isActive = (href) => location.pathname + location.search === href

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-ambient-sm border-b border-primary/10'
            : 'glass border-b border-transparent'
        }`}
      >
        <div
          className={`flex justify-between items-center w-full px-4 md:px-6 max-w-container mx-auto transition-all duration-300 ${
            scrolled ? 'py-2.5 md:py-3' : 'py-3 md:py-4'
          }`}
        >
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <button
              className="md:hidden p-2 hover:bg-primary/5 rounded-lg transition-all active:scale-95"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" className="text-primary" />
            </button>

            <Link to="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center text-white shadow-ambient-sm">
                <Icon name="accessible" size={18} />
              </span>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-gradient-hero font-headline">
                wheelchair.uz
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-7 ml-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative font-label text-sm transition-colors ${
                    isActive(link.href)
                      ? 'text-primary font-semibold'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 signature-gradient rounded-full" />
                  )}
                </Link>
              ))}
              <Link
                to="/about"
                className={`relative font-label text-sm transition-colors ${
                  location.pathname === '/about'
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className={`relative font-label text-sm transition-colors ${
                  location.pathname === '/contact'
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {t('nav.contact')}
              </Link>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden md:block">
              <LangSwitcher />
            </div>
            <div className="block md:hidden">
              <LangSwitcher mobile />
            </div>
            <button
              className="p-2 hover:bg-primary/5 rounded-lg transition-all active:scale-95"
              aria-label="Search"
            >
              <Icon name="search" className="text-on-surface-variant" />
            </button>
            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 signature-gradient text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-ambient-sm hover:shadow-ambient transition-shadow"
            >
              <Icon name="call" size={16} /> {t('home.book_call')}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div
            className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-white h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg signature-gradient flex items-center justify-center text-white">
                  <Icon name="accessible" size={18} />
                </span>
                <span className="text-lg font-extrabold text-gradient-hero font-headline">
                  wheelchair.uz
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 hover:bg-primary/5 rounded-lg"
                aria-label="Close menu"
              >
                <Icon name="close" className="text-on-surface-variant" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 font-semibold text-primary transition-colors"
              >
                <Icon name="home" /> {t('bottom_nav.home')}
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 font-semibold text-on-surface transition-colors"
                >
                  <Icon name="arrow_forward_ios" size={16} /> {link.label}
                </Link>
              ))}
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 font-semibold text-on-surface transition-colors"
              >
                <Icon name="info" /> {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 font-semibold text-on-surface transition-colors"
              >
                <Icon name="mail" /> {t('nav.contact')}
              </Link>
            </nav>

            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-6 signature-gradient text-white px-4 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-ambient-sm"
            >
              <Icon name="call" size={16} /> {t('home.book_call')}
            </Link>

            <div className="mt-auto pt-4 border-t border-outline-variant/20">
              <LangSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
