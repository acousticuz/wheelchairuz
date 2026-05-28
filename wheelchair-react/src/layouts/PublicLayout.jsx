import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'
import Icon from '../components/Icon'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />

      {/* Accessibility floating button */}
      <button className="hidden md:flex fixed bottom-8 right-8 w-14 h-14 bg-white/80 backdrop-blur-xl border border-primary/10 rounded-full shadow-ambient items-center justify-center text-primary hover:scale-110 active:scale-95 transition-all z-40">
        <Icon name="accessibility_new" size={28} />
      </button>
    </div>
  )
}
