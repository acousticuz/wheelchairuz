/**
 * Pick the right language string from a localized object, with sane fallbacks.
 * Accepts plain strings too (returned as-is).
 */
export function tx(value, lang, fallback = '') {
  if (value == null) return fallback
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return String(value)
  return value[lang] || value.uz || value.en || value.ru || fallback
}
