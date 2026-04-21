'use client'
import { useCallback, useState } from 'react'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from '@/i18n/useTranslation'

interface Props {
  urls: string[]
  onChange: (urls: string[]) => void
}

export default function ImageUploader({ urls, onChange }: Props) {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const upload = useCallback(async (files: FileList) => {
    setUploading(true)
    setErrors([])
    const newUrls: string[] = []
    const newErrors: string[] = []

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (!res.ok) {
          newErrors.push(`${file.name}: ${data.error ?? 'Upload failed'}`)
        } else {
          newUrls.push(data.url)
        }
      } catch {
        newErrors.push(`${file.name}: Network error`)
      }
    }

    if (newUrls.length) onChange([...urls, ...newUrls])
    if (newErrors.length) setErrors(newErrors)
    setUploading(false)
  }, [urls, onChange])

  const remove = (url: string) => onChange(urls.filter(u => u !== url))

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-colors">
        {uploading ? (
          <Loader2 size={24} className="animate-spin text-blue-500" />
        ) : (
          <>
            <Upload size={24} className="text-gray-400 mb-1" />
            <span className="text-sm text-gray-500">{t('post.photos')}</span>
            <span className="text-xs text-gray-400 mt-0.5">{t('post.photosHint')}</span>
          </>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={e => e.target.files && upload(e.target.files)}
          disabled={uploading}
        />
      </label>

      {/* Upload errors */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 space-y-0.5">
          {errors.map((e, i) => (
            <p key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <AlertCircle size={13} className="flex-none mt-0.5" />
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
              <Image src={url} alt={`photo ${i + 1}`} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
