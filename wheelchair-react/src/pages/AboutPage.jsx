import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import Icon from '../components/Icon'

export default function AboutPage() {
  const { t, lang } = useLang()
  const copy = {
    desktopExperience: {
      uz: 'Yillik tajriba va ishonch',
      ru: 'Лет опыта и доверия',
      en: 'Years of experience and trust',
    },
    telegramWrite: {
      uz: 'Telegram orqali yozish',
      ru: 'Написать в Telegram',
      en: 'Write on Telegram',
    },
  }

  const values = [
    {
      icon: 'favorite', color: 'bg-primary/5 text-primary',
      title_uz: 'Insonparvarlik', title_ru: 'Гуманизм', title_en: 'Humanity',
      text_uz: "Biz mahsulotlarimizni shunchaki uskunalar emas, balki hayot sifatini yaxshilovchi vosita deb bilamiz.",
      text_ru: "Мы считаем наши продукты не просто оборудованием, а средством улучшения качества жизни.",
      text_en: "We see our products not just as equipment, but as tools that improve quality of life.",
    },
    {
      icon: 'verified', color: 'bg-secondary text-white',
      title_uz: 'Mutlaq Sifat', title_ru: 'Высокое качество', title_en: 'Absolute Quality',
      text_uz: "Xalqaro standartlar asosida ishlab chiqarilgan har bir aravacha ko'p bosqichli sinovlardan o'tadi.",
      text_ru: "Каждое кресло-коляска, изготовленная по международным стандартам, проходит многоэтапные испытания.",
      text_en: "Every wheelchair manufactured to international standards goes through multi-stage testing.",
    },
    {
      icon: 'lightbulb', color: 'bg-primary-container text-white',
      title_uz: 'Innovatsiya', title_ru: 'Инновации', title_en: 'Innovation',
      text_uz: "Zamonaviy materiallar va ergonomik dizayn orqali harakatlanishni osonlashtiramiz.",
      text_ru: "Упрощаем передвижение с помощью современных материалов и эргономичного дизайна.",
      text_en: "We simplify mobility through modern materials and ergonomic design.",
    },
  ]

  const certs = [
    { icon: 'verified_user', label: 'ISO 9001:2015' },
    { icon: 'workspace_premium', label_uz: "Davlat Sertifikati", label_ru: 'Госсертификат', label_en: 'State Certificate' },
    { icon: 'history_edu', label: 'Patent №14022' },
    { icon: 'health_and_safety', label_uz: 'SSV Ruxsatnomasi', label_ru: 'Разрешение МЗ', label_en: 'Ministry Approval' },
  ]

  return (
    <div className="pb-20 md:pb-0 pt-16 md:pt-24">

      {/* ── MOBILE HERO ── */}
      <section className="md:hidden px-6 py-12">
        <div className="relative rounded-xl overflow-hidden h-[300px] mb-8 ambient-shadow">
          <img className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCefEr3ZAnra_KiE-vJmuzV8QuFTX-6yzGDfAhj2wEG4DVXEQ_tEzPkLPm_MNAwcTGOABGJo3cfMBo2fLUBZ2Uhor5Lsj925ufuxOSXmD_Wu2l54FG8yQSu2mEkeuBmh7I2pk_DkdbG1Tj1bQLLOSf7T8eQNqXh_bdpdwOzhctd414NkeYUNvUdzMhkyDgaGbtcG_ivGwyG8-u-aEyaWin2rwyaJZElUzKzCSrN0y3DaIFoV8EP-XDxsjVNNP95dmb1rU6pTrZg93U"
            alt="About" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl font-extrabold text-on-primary font-headline leading-tight">{t('about.title')}</h1>
            <p className="text-on-primary/80 text-sm mt-2 max-w-[80%]">{t('about.subtitle')}</p>
          </div>
        </div>

        {/* Story */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="history" />
              <span className="font-headline font-bold uppercase tracking-widest text-xs">{t('about.our_story')}</span>
            </div>
            <h2 className="text-2xl font-bold text-primary font-headline">{t('about.story_title')}</h2>
            <p className="text-on-surface-variant leading-relaxed">{t('about.story_text')}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-2">
              <span className="text-3xl font-black text-primary font-headline tracking-tighter">5k+</span>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{t('about.lives_touched')}</p>
            </div>
            <div className="bg-primary-container p-6 rounded-xl space-y-2 text-on-primary">
              <span className="text-3xl font-black font-headline tracking-tighter">24/7</span>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{t('about.support')}</p>
            </div>
            <div className="col-span-2 bg-secondary-container p-6 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-on-secondary-container font-headline tracking-tighter">
                  {lang === 'uz' ? '12 ta viloyat' : lang === 'ru' ? '12 регионов' : '12 Regions'}
                </span>
                <p className="text-xs font-semibold text-on-secondary-container opacity-80 uppercase tracking-wider">{t('about.regions')}</p>
              </div>
              <Icon name="local_shipping" className="text-on-secondary-container" size={36} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO ── */}
      <section className="hidden md:block relative min-h-[600px] flex items-center pt-8 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold text-xs tracking-wider uppercase">
              {t('about.our_story')}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight">
              {lang === 'uz' ? 'Har bir harakatda' : lang === 'ru' ? 'Свобода и достоинство' : 'Dignity in Every'}
              <br />
              <span className="text-secondary">
                {lang === 'uz' ? 'erkinlik va qadr-qimmat.' : lang === 'ru' ? 'в каждом движении.' : 'Movement.'}
              </span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl">{t('about.story_text')}</p>
            <Link to="/contact" className="inline-flex items-center gap-3 signature-gradient text-white px-8 py-4 rounded-xl font-bold shadow-lg">
              {t('nav.contact')} <Icon name="arrow_forward" />
            </Link>
          </div>
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden ambient-shadow aspect-[4/5]">
              <img className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgibygCvmSBkz1638cNOTOpdkAmV3Dv1KOr2ZTD8GXWCZ9YTxHJo_HY2jCBheU8-K7YHcxxyF6GFOKR_5gDbdhOszfT0BjvtS0Gtx9DSUJ8S2xpU8zVEjyEB0YdClvENzJAkYInH9QFD9gv5f_5hQSXLCuQrdjdPfYmhJ-H-K9ZNOf-3URntZunB5tyNmMs2v7ZBc9_LfAOOto4-j34R1R_15BKTY2VfXFb3rBzkWw6F-aGdMl7xuXtHZs7obReemc-cYa5JTifZ4"
                alt="About hero" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-surface-container-lowest p-6 rounded-2xl ambient-shadow hidden md:block max-w-[240px]">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-secondary">25+</span>
                <span className="text-sm font-semibold leading-tight text-on-surface">{copy.desktopExperience[lang]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-0 rounded-l-[10rem]" />
      </section>

      {/* ── НАША КОМПАНИЯ / OUR COMPANY ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-secondary">
                <Icon name="business" />
                <span className="font-headline font-bold uppercase tracking-widest text-xs">{t('about.company')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">«Sayqal»</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">{t('about.company_text')}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-container p-8 rounded-[2rem] text-white flex flex-col justify-center min-h-[170px]">
                <span className="text-5xl font-black font-headline tracking-tighter">2000</span>
                <p className="text-sm font-semibold opacity-80 mt-2">{t('about.founded_label')}</p>
              </div>
              <div className="bg-secondary p-8 rounded-[2rem] text-white flex flex-col justify-center min-h-[170px]">
                <span className="text-5xl font-black font-headline tracking-tighter">25+</span>
                <p className="text-sm font-semibold opacity-80 mt-2">{t('about.experience_label')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VALUES ── */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">{t('about.mission')}</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {lang === 'uz' ? "Bizning har bir qarorimiz ortida inson qadri va sifatga bo'lgan sadoqat yotadi." :
               lang === 'ru' ? "За каждым нашим решением стоит преданность человеческому достоинству и качеству." :
               "Behind every decision we make lies a commitment to human dignity and quality."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large span */}
            <div className="md:col-span-2 bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px]">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary">
                  <Icon name="favorite" />
                </div>
                <h3 className="text-2xl font-bold text-primary">{values[0][`title_${lang}`]}</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">{values[0][`text_${lang}`]}</p>
              </div>
            </div>
            <div className="bg-secondary p-8 md:p-10 rounded-[2rem] flex flex-col justify-between text-white">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name="verified" filled />
                </div>
                <h3 className="text-2xl font-bold">{values[1][`title_${lang}`]}</h3>
                <p className="text-white/80">{values[1][`text_${lang}`]}</p>
              </div>
            </div>
            <div className="bg-primary-container p-8 md:p-10 rounded-[2rem] flex flex-col justify-between text-white">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon name="lightbulb" />
                </div>
                <h3 className="text-2xl font-bold">{values[2][`title_${lang}`]}</h3>
                <p className="text-white/80">{values[2][`text_${lang}`]}</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {lang === 'uz' ? 'Mahalliy Ishlab Chiqarish' : lang === 'ru' ? 'Местное производство' : 'Local Manufacturing'}
                </h3>
                <p className="text-on-surface-variant">
                  {lang === 'uz' ? "O'zbekistonda \"Sayqal\" zavodida tayyorlanayotgan mahsulotlarimiz xorijiy analoglardan qolishmaydi." :
                   lang === 'ru' ? "Наши продукты, производимые на заводе Sayqal в Узбекистане, не уступают зарубежным аналогам." :
                   "Our products manufactured at the Sayqal factory in Uzbekistan are on par with foreign counterparts."}
                </p>
              </div>
              <div className="flex-1 w-full h-40 rounded-2xl overflow-hidden">
                <img className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ekXqke1eEw2Gy30M_TMQuXWtfVQ5eB5_7W_H5_nu9Qkx3qd2iPoTxpCBlAbSf7fGDSDA3D1FAoNKKavKeezp4PjZhGsN8wiAc5I1k4GNkT7zgzrDi8GlJenXdwX4zk0QAtxOsMeUZTuY7tOOlsa8NC87VzQJF0B1fFht-AN6Iw5i_VpBysjWhrQEFCHCuDhyy2k4yQA1tnkUhzpzllw_Jxx0wne3S2-wx6l0XL4Vu0GrBMC7sQw7FAHyAq5QS5tGggWdCDTHAtQ"
                  alt="Factory" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTION PROCESS ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-headline">{t('about.production')}</h2>
              <p className="text-on-surface-variant">
                {lang === 'uz' ? "Xomashyodan tayyor mahsulotgacha bo'lgan yo'l" : lang === 'ru' ? "Путь от сырья до готовой продукции" : "From raw material to finished product"}
              </p>
            </div>
          </div>

          {/* Video featured */}
          <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden ambient-shadow mb-12 group">
            <img className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIRuACm8X6HD9-_masTgiLI5a35EZpqVRj2BI81B2nU6DL-PRX45gmO_mp2ifz7Uh7bDr26brMI1CZhdYi6MW4Du7lL6csmYB9TqbHWJMoNUqoPcsHb8pAZ6IxkhHRv8yCZC4MOzn2g6jTEXkFyOE3uBr2zmdubFrPv1MCVDQL0KoRnQ_tgoV6JuPuVgYtgpKtAhV0qAmI_pzk50l1IELBvxheakUKMdcBSDpMuimsPKGGGuSC2y7PvactsE8Zy-K62SlkuV5POkE"
              alt="Factory video" />
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-all flex items-center justify-center">
              <button className="w-24 h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Icon name="play_arrow" size={48} className="text-primary" />
              </button>
            </div>
            <div className="absolute bottom-8 left-8 text-white">
              <p className="font-bold text-xl">
                {lang === 'uz' ? "Zavodimiz ichidan ko'rinish" : lang === 'ru' ? 'Взгляд изнутри нашего завода' : 'Inside Our Factory'}
              </p>
              <p className="text-white/80 text-sm">
                {lang === 'uz' ? "3-daqiqalik video ekskursiya" : lang === 'ru' ? '3-минутная видеоэкскурсия' : '3-minute video tour'}
              </p>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCPKHMe7nkVX-CMmSGBSYjU9k35njbfMAxCUWMwxzoCUzDUoyAYczl6TwqFM7Jyjv-Jo1x6PG_ubvhjtDwEZtYwk3YJMNEUnkhv_tSmBJs50G12lWGJVkfELxkKPVEpnEUn4BNuHwpTKN13SzA3RdLgDDhv698tDTIC34HULt_0q8YnijBAB6begtfOOCcFyrJlGPU3WeXuHO5o0BhnPkQ-IQz-ESNEPOnq8ieYFmSyBbshMJK7Js4zOiuKylKA2wc81z9MHXwf2Fc',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuD-nqLQtSQE_LNNlkNw14zVjsNy0GzE6IP5tD-f4qVhcepwX69s4iEx_weifIj7mU8-8Iy-zUu24uAHgPGT6vImzIuip6m4Vd_qweXPNYoigZuFwop7wci9Jx3_P6Y2pMuF6PspUgNtjCaFXqBRpFgnrS6DKHo9TWB21Ih_sd-Y52xLW1EXSim-9TATEtLTH9yz05Cmr4Zp_SS_PpuB7eyEUBIy9lIH3o9DIWpS5OVxse__7AgXYazwkhn_XvJ11uAqvTF0qprmAz0',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCmV74qTl19NpWipB5dVTNKOyOGAt38qEV_ViV16WYzD1jV1PKbMIWr04HINWE_J2UGRHSqpSTk45U53szRJ3wAhtgZs3oLIxtdFp8hotaou2AnFAS_Orj1nydYeZ2WPQ378PPSp7w3shkxq2HvgCggKFQ163AfJYvm9d32GarRzE21Zpyo3WHo0saKZJW_gR8l8E0wIurZg2AMJRYv-YvM2U0uMLUODSmF1Lb5tA-LGl0msasJJgMj5H0rhBkOEe78JyGtUAjK5ro',
              'https://lh3.googleusercontent.com/aida-public/AB6AXuC01Cq79UDIiwORnWj62iOk3ZEk5m2akllI5BiNf2CW5Fa4QDmdh5VzHhqLdzkOG9z7NfkNeMKKuG1xUeFyzkL3WjZ-QdnF11LSs57ItrxiteTvezJTu0HIV6iDvUkFA627E74f6qRXz_EQ6vbc20AkOVXLq8ui0iL-s6q_3pnlEmQ5wTsJ3PldSlN624s1IoK9WaFcBabgZsedl2IcjKozUBpBxn9tYZ9S3WuHCzgBXLqceQ67LxM9gKVjaysnjGKw9YFazU9RqwQ',
            ].map((src, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" src={src} alt="" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATES ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">{t('about.certificates')}</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {lang === 'uz' ? "Bizning barcha mahsulotlarimiz Davlat standartlariga (GOST) muvofiq sertifikatlangan." :
                 lang === 'ru' ? "Все наши продукты сертифицированы в соответствии с государственными стандартами (ГОСТ)." :
                 "All our products are certified in accordance with state standards."}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {certs.map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-transparent hover:border-outline-variant transition-all">
                    <Icon name={cert.icon} className="text-secondary" size={28} />
                    <span className="font-semibold text-sm">{cert.label || cert[`label_${lang}`]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                'https://lh3.googleusercontent.com/aida-public/AB6AXuALO_AQdnXQPE95bZY6qO6sQd2_rNLBj4rXf7CsXAMCkD9bZEazAhQxCUFKOIW_ZywGTK49sDrSSgpeIcxAF1ltgww6aT5ohpjH6DALL4vustMnLrPx1f-PL0NvV31B1Pzlxba5TcIv9ZMiFRFKbsgHBDE3O-Vwd5D0Bgsif9Wu3RVYJDuHrVmqwmB0Toj4ts6kk_fl4Z1g3onr9KPq9-i1nmu2JBms5ZgPrCw5VVv59M0iC5XSC-dJw21a1N5XHyp5RW4BDznhwKQ',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAO0KWOhCHCGQGTso0cH5LqpXj8e2r2K5sGOnIePKyHBgoWSfL2eO8CaeOPwJwjWrS8F6riiqG733V20vQeygq_pahM33jT9-iek2d5roYic9ZaCrs4_FufkAgo8dc_ZTXiMmTs2vXtYos0y0PFFDqfUxpYlugbAxw3_z3_v_x68R0tRDEFgbRVly9oe_OHXhDvIepWwF-7x-rmBxH2GjrtKZhtcCBX02tqrZULcZ0QtGWvS73HtsnNRR7OnJMlhCX1EVCjS9ogVmc',
              ].map((src, i) => (
                <div key={i} className={`bg-surface-container-low p-2 rounded-2xl ${i === 0 ? 'translate-y-8' : ''}`}>
                  <div className="bg-white p-4 rounded-xl ambient-shadow aspect-[3/4] flex items-center justify-center border border-outline-variant/10">
                    <img className="w-full h-full object-contain opacity-80" src={src} alt={`Certificate ${i+1}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="signature-gradient rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                {lang === 'uz' ? "Yana savollaringiz bormi?" : lang === 'ru' ? "Остались вопросы?" : "Still have questions?"}
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                {lang === 'uz' ? "Mutaxassislarimiz sizga mahsulot tanlashda yordam berishga tayyor." :
                 lang === 'ru' ? "Наши специалисты готовы помочь вам выбрать продукт." :
                 "Our specialists are ready to help you choose the right product."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2">
                  <Icon name="call" /> +998 71 200 00 00
                </Link>
                <a href="https://t.me/wheelchairuz_bot" className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                  {copy.telegramWrite[lang]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
