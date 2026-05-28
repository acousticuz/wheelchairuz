import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LangProvider } from './hooks/LangProvider'

import PublicLayout from './layouts/PublicLayout'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import ProductPage from './pages/ProductPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminHomeBuilder from './pages/admin/AdminHomeBuilder'
import { AdminCategories, AdminContent, AdminMedia, AdminLanguages } from './pages/admin/AdminOtherPages'
import { authApi, getToken, removeToken } from './hooks/useApi'

function RequireAuth({ children }) {
  const [state, setState] = useState(() => (getToken() ? 'checking' : 'denied'))

  useEffect(() => {
    let active = true
    if (!getToken()) {
      setState('denied')
      return undefined
    }

    authApi.me()
      .then(() => { if (active) setState('allowed') })
      .catch(() => {
        removeToken()
        if (active) setState('denied')
      })

    return () => { active = false }
  }, [])

  if (state === 'checking') {
    return <div className="min-h-screen grid place-items-center text-primary font-semibold">Tekshirilmoqda...</div>
  }

  return state === 'allowed' ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="home-builder" element={<AdminHomeBuilder />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="languages" element={<AdminLanguages />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
