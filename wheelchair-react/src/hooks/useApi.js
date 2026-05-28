import { useState, useCallback } from 'react'

// ── Base URL ────────────────────────────────────────────────
// Development: http://localhost:3000/api/v1
// Production:  /api/v1  (same origin — nginx reverse proxy)
const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

// ── Token helpers ────────────────────────────────────────────
export const getToken = () => localStorage.getItem('admin_token')
export const setToken = (t) => localStorage.setItem('admin_token', t)
export const removeToken = () => {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_auth')
}

// ── Fetch wrapper ────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Handle 401 — token expired, redirect to login
  if (res.status === 401) {
    removeToken()
    window.location.href = '/admin/login'
    throw new Error('Unauthorized')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`)
  }

  return data
}

// ── Multipart upload helper ──────────────────────────────────
async function apiUpload(path, file) {
  const token = getToken()
  const form = new FormData()
  form.append('file', file)

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.message || `Upload failed: HTTP ${res.status}`)
  }

  return res.json()
}

// ── Generic fetch hook ────────────────────────────────────────
export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const request = useCallback(async (path, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch(path, options)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { request, loading, error }
}

// ────────────────────────────────────────────────────────────
//  AUTH
// ────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setToken(data.access_token)
    localStorage.setItem('admin_auth', 'true')
    return data
  },

  logout: () => {
    removeToken()
    window.location.href = '/admin/login'
  },

  me: () => apiFetch('/auth/me'),
}

// ────────────────────────────────────────────────────────────
//  CATEGORIES
// ────────────────────────────────────────────────────────────
export const categoriesApi = {
  // Public
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString()
    return apiFetch(`/categories${qs ? `?${qs}` : ''}`)
  },

  get: (slug) => apiFetch(`/categories/${slug}`),

  // Admin
  create: (data) => apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiFetch(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  remove: (id) => apiFetch(`/categories/${id}`, { method: 'DELETE' }),
}

// ────────────────────────────────────────────────────────────
//  PRODUCTS
// ────────────────────────────────────────────────────────────
export const productsApi = {
  // Public
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString()
    return apiFetch(`/products${qs ? `?${qs}` : ''}`)
  },

  get: (slug) => apiFetch(`/products/${slug}`),

  related: (slug) => apiFetch(`/products/${slug}/related`),

  // Admin
  adminList: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString()
    return apiFetch(`/products/admin/all${qs ? `?${qs}` : ''}`)
  },

  create: (data) => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id, data) => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  toggle: (id) => apiFetch(`/products/${id}/toggle`, { method: 'PATCH' }),

  remove: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
}

// ────────────────────────────────────────────────────────────
//  INQUIRIES
// ────────────────────────────────────────────────────────────
export const inquiriesApi = {
  // Public — contact form
  submit: (data) => apiFetch('/inquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Admin
  list: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== '')),
    ).toString()
    return apiFetch(`/inquiries${qs ? `?${qs}` : ''}`)
  },

  stats: () => apiFetch('/inquiries/stats'),

  get: (id) => apiFetch(`/inquiries/${id}`),

  update: (id, data) => apiFetch(`/inquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  remove: (id) => apiFetch(`/inquiries/${id}`, { method: 'DELETE' }),
}

// ────────────────────────────────────────────────────────────
//  MEDIA
// ────────────────────────────────────────────────────────────
export const mediaApi = {
  list: (page = 1, limit = 24) => apiFetch(`/media?page=${page}&limit=${limit}`),

  upload: (file) => apiUpload('/media/upload', file),

  remove: (id) => apiFetch(`/media/${id}`, { method: 'DELETE' }),

  cleanupOrphans: () => apiFetch('/media/cleanup-orphans', { method: 'POST' }),
}

export const contentApi = {
  list: () => apiFetch('/content'),
  get: (slug) => apiFetch(`/content/${slug}`),
  create: (data) => apiFetch('/content', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/content/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/content/${id}`, { method: 'DELETE' }),
}

export const homeSectionsApi = {
  // Public — active sections in order
  list: () => apiFetch('/home-sections'),
  // Admin — all sections (including inactive)
  listAll: () => apiFetch('/home-sections?all=true'),
  create: (data) => apiFetch('/home-sections', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiFetch(`/home-sections/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  reorder: (items) => apiFetch('/home-sections/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ items }),
  }),
  remove: (id) => apiFetch(`/home-sections/${id}`, { method: 'DELETE' }),
}

export const languagesApi = {
  list: () => apiFetch('/languages'),
  create: (data) => apiFetch('/languages', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/languages/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/languages/${id}`, { method: 'DELETE' }),
}

// ────────────────────────────────────────────────────────────
//  HOOKS per resource
// ────────────────────────────────────────────────────────────

// useProducts hook
export function useProducts(params = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const paramsKey = JSON.stringify(params)

  const fetch = useCallback(async (overrideParams) => {
    setLoading(true)
    setError(null)
    try {
      const result = await productsApi.list(overrideParams || JSON.parse(paramsKey))
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [paramsKey])

  return { data, loading, error, fetch }
}

// useProduct hook (single)
export function useProduct(slug) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const result = await productsApi.get(slug)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [slug])

  return { data, loading, error, fetch }
}

// useInquirySubmit hook
export function useInquirySubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submit = useCallback(async (formData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await inquiriesApi.submit(formData)
      setSuccess(true)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = () => { setSuccess(false); setError(null) }

  return { submit, loading, error, success, reset }
}
