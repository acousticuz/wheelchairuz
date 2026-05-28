import { CreateHomeSectionDto } from './home-section.dto';

/**
 * Default home page composition. Seeded on first start. Existing rows are not
 * overwritten — admin tweaks survive restarts.
 */
export const DEFAULT_HOME_SECTIONS: CreateHomeSectionDto[] = [
  {
    key: 'main-hero',
    type: 'hero',
    sortOrder: 10,
    isActive: true,
    settings: {
      badge: {
        label: {
          uz: 'Yangi 2026 kolleksiya',
          ru: 'Новая коллекция 2026',
          en: 'New 2026 lineup',
        },
        sub: {
          uz: 'ISO 7176-19 sertifikatlangan',
          ru: 'Сертифицировано ISO 7176-19',
          en: 'ISO 7176-19 certified',
        },
        href: '/about',
      },
      title: {
        uz: 'Harakatlanish chegarasizdir.',
        ru: 'Движение без границ.',
        en: 'Freedom to move without limits.',
      },
      subtitle: {
        uz: "wheelchair.uz — Sizning mustaqilligingiz va qulayligingiz uchun eng zamonaviy reabilitatsiya vositalarini taqdim etadi.",
        ru: 'wheelchair.uz — современные средства реабилитации для вашей независимости и комфорта.',
        en: 'Expertly engineered mobility solutions delivered to your doorstep across Uzbekistan.',
      },
      primaryCta: {
        label: {
          uz: "Katalogga o'tish",
          ru: 'Перейти в каталог',
          en: 'Browse catalog',
        },
        href: '/catalog',
      },
      secondaryCta: {
        label: {
          uz: 'Mutaxassis bilan bog’lanish',
          ru: 'Связаться со специалистом',
          en: 'Contact specialist',
        },
        href: '/contact',
      },
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDV_gUp-Oo1k-R1iAqcFkfE2JzfcHiqY-rXuKpFz3Vwbq-ggDrbyBF6JZKhRkmrC2WKetrvywkVwozZd_z1c9FHQLpG6JX3Q6IATApQJlhbAWuf6LA7PjN5ose8Wc9pvATmZYz6MSxty1cy71LuKCp9U0gAboxR6_cwdQRHLTCYm8m6tZPePB9DtQqA9diEBcRVFBo1UFwKMNpfudTM6FKf4VltbjqzkE0XaycPoiZ4OTmKB_4wysiml2sJdG8ctgDCB1jV1tebq-w',
      imageBadge: {
        uz: 'Premium liniya',
        ru: 'Премиум линия',
        en: 'Premium line',
      },
      trustItems: [
        {
          icon: 'verified',
          label: { uz: 'CE & ISO sertifikatlangan', ru: 'CE и ISO', en: 'CE & ISO certified' },
        },
        {
          icon: 'local_shipping',
          label: {
            uz: "O'zbekiston bo'ylab yetkazib berish",
            ru: 'Доставка по Узбекистану',
            en: 'Nationwide delivery',
          },
        },
        {
          icon: 'workspace_premium',
          label: {
            uz: '24 oygacha kafolat',
            ru: 'Гарантия до 24 месяцев',
            en: 'Warranty up to 24 months',
          },
        },
      ],
    },
  },

  {
    key: 'home-stats',
    type: 'stats',
    sortOrder: 20,
    isActive: true,
    settings: {
      items: [
        {
          value: '10K+',
          label: { uz: 'Mamnun mijozlar', ru: 'Довольных клиентов', en: 'Happy customers' },
        },
        {
          value: '14',
          label: { uz: "Viloyat bo'ylab yetkazish", ru: 'Регионов', en: 'Regions covered' },
        },
        {
          value: '120+',
          label: { uz: 'Faol model katalogda', ru: 'Моделей', en: 'Models in catalogue' },
        },
        {
          value: '24/7',
          label: { uz: 'Mutaxassis yordami', ru: 'Поддержка', en: 'Specialist support' },
        },
      ],
    },
  },

  {
    key: 'mobile-search',
    type: 'search',
    sortOrder: 30,
    isActive: true,
    settings: {
      placeholder: {
        uz: 'Aravacha, yurgich yoki xususiyat qidiring...',
        ru: 'Поиск колясок, ходунков...',
        en: 'Search wheelchairs, walkers...',
      },
    },
  },

  {
    key: 'home-categories',
    type: 'categories',
    sortOrder: 40,
    isActive: true,
    settings: {
      label: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
      heading: {
        uz: 'Har bir ehtiyoj uchun yechim',
        ru: 'Решение для каждой потребности',
        en: 'A solution for every need',
      },
      subtitle: {
        uz: 'Ehtiyojingizga mos reabilitatsiya vositasini tanlang.',
        ru: 'Выберите подходящее средство реабилитации.',
        en: 'Choose the right mobility aid.',
      },
      max: 4,
      excludeSlugs: ['support', 'service'],
      includeNewestCard: true,
    },
  },

  {
    key: 'home-featured',
    type: 'featured',
    sortOrder: 50,
    isActive: true,
    settings: {
      label: { uz: 'Yangi kelganlar', ru: 'Новинки', en: 'New arrivals' },
      heading: { uz: 'Ommabop modellar', ru: 'Популярные модели', en: 'Featured selection' },
      subtitle: {
        uz: "Mijozlarimiz tomonidan eng ko'p tanlangan modellar",
        ru: 'Модели, которые чаще всего выбирают клиенты',
        en: 'Most selected models by our customers',
      },
      max: 4,
    },
  },

  {
    key: 'home-testimonials',
    type: 'testimonials',
    sortOrder: 60,
    isActive: true,
    settings: {
      label: { uz: 'Mijozlarimiz', ru: 'Наши клиенты', en: 'Our customers' },
      heading: {
        uz: 'Mijozlarimiz nima deyishadi',
        ru: 'Что говорят наши клиенты',
        en: 'What our customers say',
      },
      items: [
        {
          name: 'Dilshod A.',
          role: { uz: 'Toshkent', ru: 'Ташкент', en: 'Tashkent' },
          text: {
            uz: "Aravacha sifatli, yengil va yig'ilishi qulay. Mutaxassis batafsil maslahat berdi.",
            ru: 'Коляска качественная, лёгкая и легко складывается. Специалист помог.',
            en: 'The wheelchair is light and well-built. The specialist gave great advice.',
          },
        },
        {
          name: 'Malika R.',
          role: { uz: 'Samarqand', ru: 'Самарканд', en: 'Samarkand' },
          text: {
            uz: "Buvimga yurgich oldik. Yetkazish tez bo'ldi. Tavsiya qilaman!",
            ru: 'Купили бабушке ходунки. Доставка быстрая. Рекомендую!',
            en: 'We bought a walker for grandma. Fast delivery. Highly recommended!',
          },
        },
        {
          name: 'Sherzod M.',
          role: { uz: 'Buxoro', ru: 'Бухара', en: 'Bukhara' },
          text: {
            uz: 'Elektr yurituvchi model olganman. Servis shaffof.',
            ru: 'Взял электрическую модель. Сервис прозрачный.',
            en: 'Got an electric model. Service is transparent.',
          },
        },
      ],
    },
  },

  {
    key: 'home-cta',
    type: 'cta',
    sortOrder: 70,
    isActive: true,
    settings: {
      label: {
        uz: "To'g'ridan-to'g'ri aloqa",
        ru: 'Прямая линия',
        en: 'Direct line',
      },
      heading: {
        uz: 'Mutaxassis maslahati kerakmi?',
        ru: 'Нужна консультация эксперта?',
        en: 'Need expert advice?',
      },
      body: {
        uz: "Sizga to'g'ri tanlov qilishda yordam beramiz. Telefon raqamingizni qoldiring va biz 15 daqiqada aloqaga chiqamiz.",
        ru: 'Поможем выбрать правильное решение. Оставьте номер и мы перезвоним за 15 минут.',
        en: "We'll help you choose. Leave your number and we'll call within 15 minutes.",
      },
      phonePlaceholder: { uz: '+998', ru: '+998', en: '+998' },
      buttonLabel: {
        uz: "Qo'ng'iroqni kutaman",
        ru: 'Жду звонка',
        en: 'Request callback',
      },
    },
  },

  {
    key: 'home-about',
    type: 'about',
    sortOrder: 80,
    isActive: true,
    settings: {
      label: { uz: 'Bizning tariximiz', ru: 'Наша история', en: 'Our story' },
      heading: {
        uz: 'Biz haqimizda — Sayqal',
        ru: 'О нас — Sayqal',
        en: 'About us — Sayqal',
      },
      paragraphs: [
        {
          uz: "Sayqal — O'zbekistonda reabilitatsiya texnikalari bozorida yuqori sifat va innovatsiyalarni joriy etuvchi kompaniya.",
          ru: 'Sayqal — компания, внедряющая высокое качество и инновации на рынке реабилитационного оборудования Узбекистана.',
          en: 'Sayqal — a company bringing high quality and innovation to Uzbekistan’s rehabilitation equipment market.',
        },
        {
          uz: "Biz har bir mijozga individual yondashamiz, ularning ehtiyojlari va turmush tarzidan kelib chiqqan holda eng maqbul yechimlarni taklif etamiz.",
          ru: 'Мы подходим к каждому клиенту индивидуально.',
          en: 'We approach each client individually.',
        },
      ],
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDWqpXqEFLeCdFRCzIjVMZWkTo90Q4CTW1la0PYqjnREsj6lwNPS1TntpJhdi-SAnZCJiEgYE-cRjttisL_ip2tZBFRUn6lnN5iZfZsYgdckdpcPA2x09GoZ-quWQz0K1418qyTlbHplhsEuboSvnZTRAZ9nWbvT57biKvgYj9iFfuDqj8bvMG5uQvH6LDL_WuGhaGyEErq_Wwk_cGwm_wD-1VfsFn2w42_xYaq94SwIiSDFqugTLgs6MbZrCK_XEQLzLjA0Oz3mzs',
      stat: {
        value: '10+',
        label: {
          uz: 'Yillik tajriba',
          ru: 'Лет опыта',
          en: 'Years of experience',
        },
      },
      features: [
        {
          icon: 'verified',
          title: { uz: 'Sifat nazorati', ru: 'Контроль качества', en: 'Quality control' },
          text: {
            uz: 'Har bir mahsulot sertifikatlangan',
            ru: 'Каждый продукт сертифицирован',
            en: 'Every product is certified',
          },
        },
        {
          icon: 'local_shipping',
          title: { uz: 'Tezkor yetkazish', ru: 'Быстрая доставка', en: 'Fast delivery' },
          text: {
            uz: "O'zbekiston bo'ylab xizmat",
            ru: 'Доставка по Узбекистану',
            en: 'Service across Uzbekistan',
          },
        },
      ],
      ctaLabel: { uz: 'Batafsil', ru: 'Подробнее', en: 'Learn more' },
      ctaHref: '/about',
    },
  },
]
