import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import Icon from './Icon'
import SmartImage from './SmartImage'

export default function ProductCard({ product, horizontal = false }) {
  const { lang, t } = useLang()
  const badgeText = {
    uz: { new: 'Yangi', sale: 'Aksiya' },
    ru: { new: 'Новинка', sale: 'Скидка' },
    en: { new: 'New', sale: 'Sale' },
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ').format(price) + ' UZS'
  const isPriceVisible = product.showPrice !== false
  const priceOnRequest = { uz: "Narxni so'rash", ru: 'Уточнить цену', en: 'Request price' }

  if (horizontal) {
    return (
      <Link to={`/products/${product.slug}`} className="block">
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-ambient transition-all duration-300 group">
          <div className="relative aspect-[4/3] w-full bg-surface-container-low">
            <SmartImage
              src={product.image}
              alt={product.name[lang]}
              className="w-full h-full object-contain p-3"
              placeholderClass="w-full h-full"
            />
            {product.badge && (
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                product.badge === 'new' ? 'bg-secondary-container text-on-secondary-container' :
                product.badge === 'sale' ? 'bg-error text-on-error' :
                'bg-tertiary-container text-on-tertiary-container'
              }`}>
                {badgeText[lang]?.[product.badge] || product.badge}
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-headline font-bold text-primary leading-tight">{product.name[lang]}</h3>
              {isPriceVisible && (
                <span className="text-primary font-extrabold text-lg leading-none ml-2 whitespace-nowrap">{formatPrice(product.price)}</span>
              )}
            </div>
            <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">{product.excerpt[lang]}</p>
            <button className="mt-4 w-full bg-primary text-on-primary py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-primary-container transition-all">
              {t('catalog.view_details')}
            </button>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/products/${product.slug}`} className="block">
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-[4/3] md:aspect-square overflow-hidden bg-slate-50">
          <SmartImage
            src={product.image}
            alt={product.name[lang]}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            placeholderClass="w-full h-full"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              {badgeText[lang]?.[product.badge] || product.badge}
            </span>
          )}
        </div>
        <div className="p-3 md:p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-primary mb-1.5 md:mb-2 line-clamp-2 font-headline text-[13px] md:text-sm leading-snug">{product.name[lang]}</h3>
          <p className="text-[11px] md:text-xs text-on-surface-variant mb-2 md:mb-3 flex-grow line-clamp-2">{product.excerpt[lang]}</p>
          <div className="mt-auto">
            <div className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-1.5 md:gap-1.5 md:px-2.5">
              <Icon name={isPriceVisible ? 'sell' : 'chat'} size={14} />
              <span className="truncate font-extrabold text-[10px] md:text-xs">{isPriceVisible ? formatPrice(product.price) : priceOnRequest[lang]}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
