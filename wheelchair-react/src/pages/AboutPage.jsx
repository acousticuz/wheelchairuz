import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import Icon from '../components/Icon'
import { mergeAbout } from '../data/aboutContent'

const API = import.meta.env.VITE_API_URL || '/api/v1'

export default function AboutPage() {
  const { t, lang } = useLang()
  const [meta, setMeta] = useState(null)

  // Best-effort fetch of admin-managed content; falls back to defaults.
  // Uses a plain fetch (not the admin apiFetch) so a failure never redirects
  // a public visitor to the login page.
  useEffect(() => {
    let active = true
    fetch(`${API}/content/about`)
      .then((r) => (r.ok ? r.json() : null))
      .then((page) => { if (active && page?.meta) setMeta(page.meta) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const A = useMemo(() => mergeAbout(meta), [meta])
  const values = A.mission.values
  const certs = A.certificates.items

  return (
    <div className="pb-20 md:pb-0 pt-16 md:pt-24">

      {/* ── MOBILE HERO ── */}
      <section className="md:hidden px-6 py-12">
        <div className="relative rounded-xl overflow-hidden h-[300px] mb-8 ambient-shadow">
          <img className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCefEr3ZAnra_KiE-vJmuzV8QuFTX-6yzGDfAhj2wEG4DVXEQ_tEzPkLPm_MNAwcTGOABGJo3cfMBo2fLUBZ2Uhor5Lsj925ufuxOSXmD_Wu2l54FG8yQSu2mEkeuBmh7I2pk_DkdbG1Tj1bQLLOSf7T8eQNqXh_bdpdwOzhctd414NkeYUNvUdzMhkyDgaGbtcG_ivGwyG8-u-aEyaWin2rwyaJZElUzKzCSrN0y3DaIFoV8EP-XDxsjVNNP95dmb1rU6pTrZg93U"
            alt="About" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl font-extrabold text-on-primary font-headline leading-tight">{A.hero.title[lang]}</h1>
            <p className="text-on-primary/80 text-sm mt-2 max-w-[80%]">{A.hero.subtitle[lang]}</p>
          </div>
        </div>

        {/* Story */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-secondary">
              <Icon name="history" />
              <span className="font-headline font-bold uppercase tracking-widest text-xs">{A.hero.storyTag[lang]}</span>
            </div>
            <h2 className="text-2xl font-bold text-primary font-headline">{A.hero.storyTitle[lang]}</h2>
            <p className="text-on-surface-variant leading-relaxed">{A.hero.storyText[lang]}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-6 rounded-xl space-y-2">
              <span className="text-3xl font-black text-primary font-headline tracking-tighter">{A.stats.clients}</span>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{A.stats.clientsLabel[lang]}</p>
            </div>
            <div className="bg-primary-container p-6 rounded-xl space-y-2 text-on-primary">
              <span className="text-3xl font-black font-headline tracking-tighter">{A.stats.support}</span>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">{A.stats.supportLabel[lang]}</p>
            </div>
            <div className="col-span-2 bg-secondary-container p-6 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-on-secondary-container font-headline tracking-tighter">
                  {A.stats.regions[lang]}
                </span>
                <p className="text-xs font-semibold text-on-secondary-container opacity-80 uppercase tracking-wider">{A.stats.regionsLabel[lang]}</p>
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
              {A.hero.storyTag[lang]}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight">
              {A.hero.headline1[lang]}
              <br />
              <span className="text-secondary">
                {A.hero.headline2[lang]}
              </span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl">{A.hero.storyText[lang]}</p>
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
                <span className="text-4xl font-black text-secondary">{A.hero.experienceValue}</span>
                <span className="text-sm font-semibold leading-tight text-on-surface">{A.hero.experienceLabel[lang]}</span>
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
                <span className="font-headline font-bold uppercase tracking-widest text-xs">{A.company.tag[lang]}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">{A.company.name}</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">{A.company.text[lang]}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-container p-8 rounded-[2rem] text-white flex flex-col justify-center min-h-[170px]">
                <span className="text-5xl font-black font-headline tracking-tighter">{A.company.foundedYear}</span>
                <p className="text-sm font-semibold opacity-80 mt-2">{A.company.foundedLabel[lang]}</p>
              </div>
              <div className="bg-secondary p-8 rounded-[2rem] text-white flex flex-col justify-center min-h-[170px]">
                <span className="text-5xl font-black font-headline tracking-tighter">{A.company.experienceValue}</span>
                <p className="text-sm font-semibold opacity-80 mt-2">{A.company.experienceLabel[lang]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION & VALUES ── */}
      <section className="py-16 md:py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">{A.mission.title[lang]}</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">
              {A.mission.subtitle[lang]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large span */}
            <div className="md:col-span-2 bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px]">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-primary-fixed rounded-xl flex items-center justify-center text-primary">
                  <Icon name={values[0]?.icon || 'favorite'} />
                </div>
                <h3 className="text-2xl font-bold text-primary">{values[0]?.title[lang]}</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed">{values[0]?.text[lang]}</p>
              </div>
            </div>
            <div className="bg-secondary p-8 md:p-10 rounded-[2rem] flex flex-col justify-between text-white">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon name={values[1]?.icon || 'verified'} filled />
                </div>
                <h3 className="text-2xl font-bold">{values[1]?.title[lang]}</h3>
                <p className="text-white/80">{values[1]?.text[lang]}</p>
              </div>
            </div>
            <div className="bg-primary-container p-8 md:p-10 rounded-[2rem] flex flex-col justify-between text-white">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Icon name={values[2]?.icon || 'lightbulb'} />
                </div>
                <h3 className="text-2xl font-bold">{values[2]?.title[lang]}</h3>
                <p className="text-white/80">{values[2]?.text[lang]}</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-primary">
                  {A.mission.localTitle[lang]}
                </h3>
                <p className="text-on-surface-variant">
                  {A.mission.localText[lang]}
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
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-headline">{A.production.title[lang]}</h2>
              <p className="text-on-surface-variant">
                {A.production.subtitle[lang]}
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
                {A.production.videoTitle[lang]}
              </p>
              <p className="text-white/80 text-sm">
                {A.production.videoSubtitle[lang]}
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
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-headline">{A.certificates.title[lang]}</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {A.certificates.text[lang]}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {certs.map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low border border-transparent hover:border-outline-variant transition-all">
                    <Icon name={cert.icon} className="text-secondary" size={28} />
                    <span className="font-semibold text-sm">{cert.label[lang]}</span>
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
                {A.cta.title[lang]}
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                {A.cta.text[lang]}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2">
                  <Icon name="call" /> {A.cta.phone}
                </Link>
                <a href={A.cta.telegramUrl} className="bg-transparent border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                  {A.cta.telegramLabel[lang]}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
