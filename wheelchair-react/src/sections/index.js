import HeroSection from './HeroSection'
import StatsSection from './StatsSection'
import SearchSection from './SearchSection'
import CategoriesSection from './CategoriesSection'
import FeaturedSection from './FeaturedSection'
import TestimonialsSection from './TestimonialsSection'
import CTASection from './CTASection'
import AboutSection from './AboutSection'
import BannerSection from './BannerSection'
import SpacerSection from './SpacerSection'

/**
 * Section type → React component. Drives the public HomePage renderer and the
 * admin Home Builder (each entry below also gets a metadata record in
 * sectionRegistry below for the admin UI: label, description, default
 * settings).
 */
export const SECTION_COMPONENTS = {
  hero: HeroSection,
  stats: StatsSection,
  search: SearchSection,
  categories: CategoriesSection,
  featured: FeaturedSection,
  testimonials: TestimonialsSection,
  cta: CTASection,
  about: AboutSection,
  banner: BannerSection,
  spacer: SpacerSection,
}

/**
 * Registry for the admin Home Builder. Each entry describes a section type:
 * its display label, an icon name, a short description, and the default
 * settings used when an admin adds a new instance of that type.
 */
export const SECTION_REGISTRY = [
  {
    type: 'hero',
    label: { uz: 'Hero', ru: 'Hero', en: 'Hero' },
    icon: 'auto_awesome',
    description: {
      uz: 'Katta sarlavha, badge, rasm va CTA tugmalari bilan asosiy banner.',
      ru: 'Главный баннер с заголовком, бейджем, изображением и CTA.',
      en: 'Main banner with large title, badge, image and CTAs.',
    },
    defaultSettings: {
      badge: { label: { uz: 'Yangi', ru: 'Новое', en: 'New' }, href: '/about' },
      title: { uz: 'Sarlavha matni', ru: 'Текст заголовка', en: 'Title text' },
      subtitle: {
        uz: 'Qisqa tavsif matni shu yerda.',
        ru: 'Краткое описание здесь.',
        en: 'Short description goes here.',
      },
      primaryCta: {
        label: { uz: 'Katalogga o‘tish', ru: 'В каталог', en: 'Browse catalog' },
        href: '/catalog',
      },
      secondaryCta: {
        label: { uz: 'Bog‘lanish', ru: 'Связаться', en: 'Contact' },
        href: '/contact',
      },
      image: '',
      imageBadge: { uz: 'Premium', ru: 'Премиум', en: 'Premium' },
      trustItems: [],
    },
  },
  {
    type: 'stats',
    label: { uz: 'Statistika', ru: 'Статистика', en: 'Stats strip' },
    icon: 'leaderboard',
    description: {
      uz: '4 ta katta ko‘rsatkichli polosa.',
      ru: 'Полоса с 4 ключевыми показателями.',
      en: 'Strip with 4 key metrics.',
    },
    defaultSettings: {
      items: [
        { value: '10K+', label: { uz: 'Mijozlar', ru: 'Клиентов', en: 'Customers' } },
        { value: '4.9', label: { uz: 'Reyting', ru: 'Рейтинг', en: 'Rating' } },
        { value: '100+', label: { uz: 'Modellar', ru: 'Моделей', en: 'Models' } },
        { value: '24/7', label: { uz: 'Yordam', ru: 'Поддержка', en: 'Support' } },
      ],
    },
  },
  {
    type: 'search',
    label: { uz: 'Qidiruv (mobile)', ru: 'Поиск (моб.)', en: 'Search bar (mobile)' },
    icon: 'search',
    description: {
      uz: 'Faqat mobil ekranda chiquvchi qidiruv qatori.',
      ru: 'Поиск, отображающийся только на мобильных.',
      en: 'Search bar shown only on mobile screens.',
    },
    defaultSettings: {
      placeholder: { uz: 'Qidiruv...', ru: 'Поиск...', en: 'Search...' },
    },
  },
  {
    type: 'categories',
    label: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
    icon: 'category',
    description: {
      uz: 'API’dagi mahsulot kategoriyalari (compact bento).',
      ru: 'Категории товаров из API (компактный бенто).',
      en: 'Product categories from API (compact bento).',
    },
    defaultSettings: {
      label: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
      heading: { uz: 'Har bir ehtiyoj uchun', ru: 'Для каждой потребности', en: 'For every need' },
      subtitle: { uz: '', ru: '', en: '' },
      max: 4,
      excludeSlugs: ['support'],
      includeNewestCard: true,
    },
  },
  {
    type: 'featured',
    label: { uz: 'Ommabop modellar', ru: 'Популярные', en: 'Featured products' },
    icon: 'star',
    description: {
      uz: 'Tanlangan yoki yangi mahsulotlar (compact bento).',
      ru: 'Избранные или новые товары (компактный бенто).',
      en: 'Featured or newest products (compact bento).',
    },
    defaultSettings: {
      label: { uz: 'Yangi kelganlar', ru: 'Новинки', en: 'New arrivals' },
      heading: { uz: 'Ommabop modellar', ru: 'Популярные', en: 'Featured' },
      subtitle: { uz: '', ru: '', en: '' },
      max: 4,
    },
  },
  {
    type: 'testimonials',
    label: { uz: 'Sharhlar', ru: 'Отзывы', en: 'Testimonials' },
    icon: 'format_quote',
    description: {
      uz: 'Mijozlar sharhlari (3 kart).',
      ru: 'Отзывы клиентов (3 карточки).',
      en: 'Customer testimonials (3 cards).',
    },
    defaultSettings: {
      label: { uz: 'Mijozlarimiz', ru: 'Клиенты', en: 'Customers' },
      heading: { uz: 'Mijozlarimiz fikrlari', ru: 'Отзывы клиентов', en: 'What customers say' },
      items: [],
    },
  },
  {
    type: 'cta',
    label: { uz: 'CTA polosa', ru: 'CTA полоса', en: 'CTA band' },
    icon: 'campaign',
    description: {
      uz: 'Telefon qoldirish formasi bilan CTA polosa.',
      ru: 'CTA-полоса с формой для номера.',
      en: 'CTA band with phone-capture form.',
    },
    defaultSettings: {
      label: { uz: 'Aloqa', ru: 'Контакт', en: 'Contact' },
      heading: { uz: 'Maslahat kerakmi?', ru: 'Нужна консультация?', en: 'Need advice?' },
      body: { uz: '', ru: '', en: '' },
      phonePlaceholder: { uz: '+998', ru: '+998', en: '+998' },
      buttonLabel: { uz: 'Yuborish', ru: 'Отправить', en: 'Send' },
    },
  },
  {
    type: 'about',
    label: { uz: 'Biz haqimizda', ru: 'О нас', en: 'About preview' },
    icon: 'info',
    description: {
      uz: 'Rasm + 10+ yil statistikasi + tavsif (faqat desktop).',
      ru: 'Изображение + статистика + описание (только десктоп).',
      en: 'Image + stat + description (desktop only).',
    },
    defaultSettings: {
      label: { uz: 'Bizning tariximiz', ru: 'Наша история', en: 'Our story' },
      heading: { uz: 'Biz haqimizda', ru: 'О нас', en: 'About us' },
      paragraphs: [],
      image: '',
      stat: {
        value: '10+',
        label: { uz: 'Yillik tajriba', ru: 'Лет опыта', en: 'Years of experience' },
      },
      features: [],
      ctaLabel: { uz: 'Batafsil', ru: 'Подробнее', en: 'Learn more' },
      ctaHref: '/about',
    },
  },
  {
    type: 'banner',
    label: { uz: 'Banner / Aksiya', ru: 'Баннер / Акция', en: 'Banner / Promo' },
    icon: 'campaign',
    description: {
      uz: 'Aksiya yoki e’lon uchun universal banner.',
      ru: 'Универсальный баннер для акций.',
      en: 'Universal banner for promotions.',
    },
    defaultSettings: {
      heading: { uz: 'Aksiya', ru: 'Акция', en: 'Promo' },
      body: { uz: 'Tavsif matni', ru: 'Описание', en: 'Description' },
      ctaLabel: { uz: 'Ko‘rish', ru: 'Смотреть', en: 'View' },
      ctaHref: '/catalog',
      tone: 'brand',
      image: '',
    },
  },
  {
    type: 'spacer',
    label: { uz: 'Bo‘sh joy', ru: 'Отступ', en: 'Spacer' },
    icon: 'space_bar',
    description: {
      uz: 'Vertikal bo‘sh joy.',
      ru: 'Вертикальный отступ.',
      en: 'Vertical empty space.',
    },
    defaultSettings: {
      size: 'md',
    },
  },
]

export function getSectionMeta(type) {
  return SECTION_REGISTRY.find((s) => s.type === type)
}
