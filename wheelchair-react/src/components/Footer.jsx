import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import Icon from './Icon'

export default function Footer() {
  const { t } = useLang()

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="max-w-xs space-y-4">
            <Link to="/" className="text-xl font-bold text-blue-900 font-headline block">
              wheelchair.uz
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                <Icon name="alternate_email" size={16} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                <Icon name="call" size={16} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-colors">
                <Icon name="send" size={16} />
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow md:justify-items-center">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-primary text-sm mb-1">{t('footer.products')}</p>
              <Link to="/catalog?cat=wheelchairs" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('nav.wheelchairs')}</Link>
              <Link to="/catalog?cat=walkers" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('nav.walkers')}</Link>
              <Link to="/catalog" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('nav.catalog')}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-primary text-sm mb-1">{t('footer.company')}</p>
              <Link to="/about" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('footer.about')}</Link>
              <Link to="/contact" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('nav.contact')}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-primary text-sm mb-1">{t('footer.support')}</p>
              <Link to="/contact" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('footer.shipping')}</Link>
              <Link to="/contact" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('footer.faq')}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-bold text-primary text-sm mb-1">{t('footer.newsletter')}</p>
              <p className="text-xs text-slate-500">{t('footer.newsletter_text')}</p>
              <div className="flex">
                <input
                  className="flex-1 bg-white border border-outline-variant/30 rounded-l-lg text-sm px-3 py-2 focus:outline-none focus:border-secondary"
                  placeholder={t('footer.email_placeholder')}
                  type="email"
                />
                <button className="bg-primary text-white px-3 py-2 rounded-r-lg hover:bg-primary-container transition-colors">
                  <Icon name="send" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">© 2024 wheelchair.uz. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
