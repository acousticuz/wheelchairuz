// Structured, editable content for the public /about page.
// Defaults reproduce the original copy; the admin panel overrides any field
// via ContentPage(slug='about').meta. Both AboutPage (public) and AdminAbout
// (editor) build on this shape, so they always stay in sync.

export const aboutDefaults = {
  hero: {
    storyTag: { uz: 'Bizning tariximiz', ru: 'Наша история', en: 'Our Story' },
    title: {
      uz: "Har bir harakatda erkinlik va qadr-qimmat.",
      ru: 'Свобода и достоинство в каждом движении.',
      en: 'Dignity in Every Movement.',
    },
    subtitle: {
      uz: "O'zbekistonda qulay muhit yaratayotganmiz",
      ru: 'Создаём доступную среду в Узбекистане',
      en: 'Building a more accessible Uzbekistan',
    },
    headline1: { uz: 'Har bir harakatda', ru: 'Свобода и достоинство', en: 'Dignity in Every' },
    headline2: { uz: "erkinlik va qadr-qimmat.", ru: 'в каждом движении.', en: 'Movement.' },
    storyTitle: {
      uz: 'Bitta ehtiyojdan milliy missiyaga.',
      ru: 'От единственной потребности к национальной миссии.',
      en: 'From a Single Need to a National Mission.',
    },
    storyText: {
      uz: "Sayqal brendi ostida biz nafaqat reabilitatsiya uskunalarini ishlab chiqaramiz, balki imkoniyati cheklangan insonlar uchun to'siqlarsiz dunyo barpo etamiz.",
      ru: 'Под брендом Sayqal мы не просто производим реабилитационное оборудование — мы создаём мир без барьеров для людей с ограниченными возможностями.',
      en: "Under the Sayqal brand, we don't just manufacture rehabilitation equipment — we build a barrier-free world for people with disabilities.",
    },
    experienceValue: '25+',
    experienceLabel: {
      uz: 'Yillik tajriba va ishonch',
      ru: 'Лет опыта и доверия',
      en: 'Years of experience and trust',
    },
  },

  stats: {
    clients: '5k+',
    clientsLabel: { uz: 'Mamnun mijozlar', ru: 'Довольных клиентов', en: 'Lives Touched' },
    support: '24/7',
    supportLabel: { uz: "24/7 Qo'llab-quvvatlash", ru: 'Поддержка 24/7', en: '24/7 Support Care' },
    regions: { uz: '12 ta viloyat', ru: '12 регионов', en: '12 Regions' },
    regionsLabel: { uz: "Viloyat bo'ylab yetkazish", ru: 'Доставка по регионам', en: 'Nationwide Delivery' },
  },

  company: {
    name: '«Sayqal»',
    tag: { uz: 'Bizning kompaniya', ru: 'Наша компания', en: 'Our Company' },
    text: {
      uz: "«Sayqal» savdo-ishlab chiqarish korxonasi 2000-yilda tashkil etilgan. Korxona harakatlanish imkoniyati cheklangan insonlar uchun reabilitatsiya vositalarini ishlab chiqish va ishlab chiqarishga ixtisoslashgan.",
      ru: 'Торгово-производственное предприятие «Sayqal» основано в 2000 году. Предприятие специализируется на разработке и производстве средств реабилитации для людей с ограниченными функциями движения.',
      en: 'The Sayqal trade and manufacturing enterprise was founded in 2000. The company specializes in the development and production of rehabilitation equipment for people with limited mobility.',
    },
    foundedYear: '2000',
    foundedLabel: { uz: 'Tashkil etilgan yili', ru: 'Год основания', en: 'Year Founded' },
    experienceValue: '25+',
    experienceLabel: { uz: 'Yillik tajriba', ru: 'Лет опыта', en: 'Years of Experience' },
  },

  mission: {
    title: { uz: 'Missiyamiz va Qadriyatlarimiz', ru: 'Наша миссия и ценности', en: 'Our Mission & Values' },
    subtitle: {
      uz: "Bizning har bir qarorimiz ortida inson qadri va sifatga bo'lgan sadoqat yotadi.",
      ru: 'За каждым нашим решением стоит преданность человеческому достоинству и качеству.',
      en: 'Behind every decision we make lies a commitment to human dignity and quality.',
    },
    values: [
      {
        icon: 'favorite',
        title: { uz: 'Insonparvarlik', ru: 'Гуманизм', en: 'Humanity' },
        text: {
          uz: 'Biz mahsulotlarimizni shunchaki uskunalar emas, balki hayot sifatini yaxshilovchi vosita deb bilamiz.',
          ru: 'Мы считаем наши продукты не просто оборудованием, а средством улучшения качества жизни.',
          en: 'We see our products not just as equipment, but as tools that improve quality of life.',
        },
      },
      {
        icon: 'verified',
        title: { uz: 'Mutlaq Sifat', ru: 'Высокое качество', en: 'Absolute Quality' },
        text: {
          uz: "Xalqaro standartlar asosida ishlab chiqarilgan har bir aravacha ko'p bosqichli sinovlardan o'tadi.",
          ru: 'Каждое кресло-коляска, изготовленная по международным стандартам, проходит многоэтапные испытания.',
          en: 'Every wheelchair manufactured to international standards goes through multi-stage testing.',
        },
      },
      {
        icon: 'lightbulb',
        title: { uz: 'Innovatsiya', ru: 'Инновации', en: 'Innovation' },
        text: {
          uz: 'Zamonaviy materiallar va ergonomik dizayn orqali harakatlanishni osonlashtiramiz.',
          ru: 'Упрощаем передвижение с помощью современных материалов и эргономичного дизайна.',
          en: 'We simplify mobility through modern materials and ergonomic design.',
        },
      },
    ],
    localTitle: { uz: 'Mahalliy Ishlab Chiqarish', ru: 'Местное производство', en: 'Local Manufacturing' },
    localText: {
      uz: 'O\'zbekistonda "Sayqal" zavodida tayyorlanayotgan mahsulotlarimiz xorijiy analoglardan qolishmaydi.',
      ru: 'Наши продукты, производимые на заводе Sayqal в Узбекистане, не уступают зарубежным аналогам.',
      en: 'Our products manufactured at the Sayqal factory in Uzbekistan are on par with foreign counterparts.',
    },
  },

  production: {
    title: { uz: 'Ishlab chiqarish jarayoni', ru: 'Производственный процесс', en: 'Production Process' },
    subtitle: {
      uz: "Xomashyodan tayyor mahsulotgacha bo'lgan yo'l",
      ru: 'Путь от сырья до готовой продукции',
      en: 'From raw material to finished product',
    },
    videoTitle: { uz: "Zavodimiz ichidan ko'rinish", ru: 'Взгляд изнутри нашего завода', en: 'Inside Our Factory' },
    videoSubtitle: { uz: '3-daqiqalik video ekskursiya', ru: '3-минутная видеоэкскурсия', en: '3-minute video tour' },
  },

  certificates: {
    title: { uz: 'Sertifikatlar va Ishonch', ru: 'Сертификаты и доверие', en: 'Certificates & Trust' },
    text: {
      uz: 'Bizning barcha mahsulotlarimiz Davlat standartlariga (GOST) muvofiq sertifikatlangan.',
      ru: 'Все наши продукты сертифицированы в соответствии с государственными стандартами (ГОСТ).',
      en: 'All our products are certified in accordance with state standards.',
    },
    items: [
      { icon: 'verified_user', label: { uz: 'ISO 9001:2015', ru: 'ISO 9001:2015', en: 'ISO 9001:2015' } },
      { icon: 'workspace_premium', label: { uz: 'Davlat Sertifikati', ru: 'Госсертификат', en: 'State Certificate' } },
      { icon: 'history_edu', label: { uz: 'Patent №14022', ru: 'Patent №14022', en: 'Patent №14022' } },
      { icon: 'health_and_safety', label: { uz: 'SSV Ruxsatnomasi', ru: 'Разрешение МЗ', en: 'Ministry Approval' } },
    ],
  },

  cta: {
    title: { uz: 'Yana savollaringiz bormi?', ru: 'Остались вопросы?', en: 'Still have questions?' },
    text: {
      uz: 'Mutaxassislarimiz sizga mahsulot tanlashda yordam berishga tayyor.',
      ru: 'Наши специалисты готовы помочь вам выбрать продукт.',
      en: 'Our specialists are ready to help you choose the right product.',
    },
    phone: '+998 71 200 00 00',
    telegramUrl: 'https://t.me/wheelchairuz_bot',
    telegramLabel: { uz: 'Telegram orqali yozish', ru: 'Написать в Telegram', en: 'Write on Telegram' },
  },
}

// Deep-merge persisted overrides (meta) over the defaults. Arrays are replaced
// wholesale (the editor always submits the full array). Missing keys fall back
// to defaults, so a partial / empty meta still renders a complete page.
export function mergeAbout(meta) {
  const merge = (base, over) => {
    if (Array.isArray(base)) return Array.isArray(over) ? over : base
    if (base && typeof base === 'object') {
      const out = Array.isArray(base) ? [...base] : { ...base }
      for (const k of Object.keys(base)) {
        if (over && Object.prototype.hasOwnProperty.call(over, k)) {
          out[k] = merge(base[k], over[k])
        }
      }
      return out
    }
    return over === undefined || over === null ? base : over
  }
  if (!meta || typeof meta !== 'object') return aboutDefaults
  return merge(aboutDefaults, meta)
}
