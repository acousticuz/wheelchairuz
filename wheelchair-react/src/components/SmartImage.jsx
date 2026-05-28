import { useEffect, useState } from 'react'
import Icon from './Icon'

/**
 * Image wrapper that gracefully handles empty `src` and load errors by
 * rendering a placeholder block instead of a broken-image icon.
 *
 * Use this everywhere user-controlled image URLs are rendered.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  placeholderIcon = 'image',
  placeholderClass = '',
  loading = 'lazy',
  draggable,
  ...rest
}) {
  const [failed, setFailed] = useState(false)

  // Reset failure state if src changes (e.g. after upload)
  useEffect(() => {
    setFailed(false)
  }, [src])

  const showPlaceholder = !src || failed

  if (showPlaceholder) {
    return (
      <div
        className={`flex items-center justify-center bg-surface-container-low text-on-surface-variant/50 ${className} ${placeholderClass}`}
        aria-label={alt || 'no image'}
      >
        <Icon name={placeholderIcon} size={28} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      draggable={draggable}
      onError={() => setFailed(true)}
      className={className}
      {...rest}
    />
  )
}
