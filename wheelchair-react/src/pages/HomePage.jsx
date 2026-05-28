import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { categoriesApi, productsApi, homeSectionsApi } from '../hooks/useApi'
import { normalizeProduct } from '../utils/publicData'
import { SECTION_COMPONENTS } from '../sections'

/**
 * HomePage is now a thin renderer driven by the `home-sections` API. Each
 * section row is rendered by its registered component (see ../sections).
 * Shared data (categories, products) is fetched once and passed down so that
 * data-aware sections (categories, featured) can render without their own
 * network calls.
 */
export default function HomePage() {
  const [sections, setSections] = useState(null) // null = loading, [] = empty
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [sectionsRes, productsRes, categoryRes] = await Promise.all([
          homeSectionsApi.list().catch(() => []),
          productsApi.list({ limit: 200, sort: 'newest' }).catch(() => ({ data: [] })),
          categoriesApi.list().catch(() => []),
        ])
        if (!active) return
        setSections(Array.isArray(sectionsRes) ? sectionsRes : [])
        setProducts((productsRes?.data || []).map(normalizeProduct))
        setCategories(categoryRes || [])
      } catch (err) {
        console.error('Failed to load home page data', err)
        if (active) setSections([])
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const categoryCounts = useMemo(() => {
    const counts = {}
    for (const p of products) {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1
    }
    return counts
  }, [products])

  const featuredProducts = useMemo(() => {
    const f = products.filter((p) => p.isFeatured).slice(0, 8)
    return f.length ? f : products.slice(0, 8)
  }, [products])

  return (
    <div className="pb-20 md:pb-0">
      {sections === null ? (
        <SectionSkeleton />
      ) : sections.length === 0 ? (
        <EmptyHome />
      ) : (
        sections.map((s) => {
          const Component = SECTION_COMPONENTS[s.type]
          if (!Component) return null
          return (
            <Component
              key={s.id}
              settings={s.settings || {}}
              categories={categories}
              categoryCounts={categoryCounts}
              products={featuredProducts}
            />
          )
        })
      )}

      {/* Mobile FAB — always available */}
      <Link
        to="/contact"
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 signature-gradient text-white rounded-full shadow-ambient-xl flex items-center justify-center z-40 active:scale-90 transition-transform"
        aria-label="Contact"
      >
        <Icon name="headset_mic" />
      </Link>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="pt-28 pb-20 max-w-container mx-auto px-4 md:px-6 space-y-8">
      <div className="h-12 md:h-16 bg-surface-container animate-pulse rounded-2xl" />
      <div className="h-64 md:h-96 bg-surface-container animate-pulse rounded-3xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-48 md:h-72 bg-surface-container animate-pulse rounded-[28px]" />
        ))}
      </div>
    </div>
  )
}

function EmptyHome() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <Icon name="dashboard_customize" size={56} className="text-on-surface-variant mb-4" />
      <h2 className="text-2xl font-bold text-brand-ink mb-2">Bosh sahifa hali sozlanmagan</h2>
      <p className="text-on-surface-variant max-w-md">
        Admin paneldan <code className="px-1 bg-surface-container rounded">/admin/home-builder</code>{' '}
        sahifasiga o‘ting va birinchi bo‘limni qo‘shing.
      </p>
    </div>
  )
}
