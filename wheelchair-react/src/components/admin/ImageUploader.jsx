import { useRef, useState } from 'react'
import Icon from '../Icon'
import { mediaApi } from '../../hooks/useApi'

/**
 * Image input that accepts either:
 *   - typed URL, OR
 *   - drag-and-drop / file picker upload via /media/upload
 *
 * Uploaded files return { url } and the URL is written into the value.
 */
export default function ImageUploader({ value, onChange, label = 'Rasm', className = '' }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Faqat rasm fayllari qabul qilinadi')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Rasm hajmi 5MB dan oshmasligi kerak')
      return
    }
    setUploading(true)
    setError(null)
    try {
      const result = await mediaApi.upload(file)
      const url = result.url || result.path || ''
      if (url) onChange(url)
      else setError('Yuklash javobida URL yo‘q')
    } catch (err) {
      setError(err.message || 'Yuklashda xato')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          {label}
        </label>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl transition-all ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-outline-variant/30 bg-surface-container-low/40'
        }`}
      >
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt=""
              className="w-full h-40 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="O‘chirish"
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-error hover:bg-white shadow-sm flex items-center justify-center"
            >
              <Icon name="delete" size={16} />
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <Icon
              name={uploading ? 'sync' : 'cloud_upload'}
              size={28}
              className={`text-on-surface-variant mb-2 ${uploading ? 'animate-spin' : ''}`}
            />
            <p className="text-xs font-semibold text-on-surface-variant">
              {uploading ? 'Yuklanmoqda…' : 'Faylni shu yerga sudrab keling yoki bosing'}
            </p>
            <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
              JPG, PNG, WebP — 5MB gacha
            </p>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => upload(e.target.files?.[0])}
          className="hidden"
        />
      </div>

      <input
        type="url"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="yoki rasm URL'ini kiriting"
        className="w-full px-3 py-2 text-xs border border-outline-variant/30 rounded-lg focus:border-primary outline-none bg-white"
      />

      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  )
}
