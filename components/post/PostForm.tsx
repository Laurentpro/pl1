'use client'
import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'
import AddressAutocomplete from './AddressAutocomplete'
import ImageUploader from './ImageUploader'
import StationBadge from '@/components/listings/StationBadge'
import { CheckCircle, Loader2 } from 'lucide-react'
import type { PropertyType, PriceType, MetroStation } from '@/types'

interface GeoState {
  lat: number
  lng: number
  nearestStation: MetroStation
  walkMinutes: number
}

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'studio', 'commercial']

export default function PostForm() {
  const { t, lang } = useTranslation()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const [form, setForm] = useState({
    title: '',
    description: '',
    property_type: '' as PropertyType | '',
    price_type: 'rent' as PriceType,
    price: '',
    surface_m2: '',
    rooms: '',
    floor: '',
    furnished: false,
    address: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
  })
  const [images, setImages] = useState<string[]>([])
  const [geo, setGeo] = useState<GeoState | null>(null)
  const [geoError, setGeoError] = useState('')

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleGeoResult = (result: GeoState | null) => {
    setGeo(result)
    if (result && result.walkMinutes > 10) {
      setGeoError(t('post.errorTooFar'))
    } else {
      setGeoError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!geo) { setGeoError(t('post.addressHint')); return }
    if (geo.walkMinutes > 10) { setGeoError(t('post.errorTooFar')); return }

    setSubmitting(true)
    setServerError('')

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
          rooms: form.rooms ? Number(form.rooms) : null,
          floor: form.floor !== '' ? Number(form.floor) : null,
          property_type: form.property_type || null,
          lat: geo.lat,
          lng: geo.lng,
          nearest_station_id: geo.nearestStation.id,
          walk_minutes: geo.walkMinutes,
          images,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error ?? t('post.errorSubmit'))
      } else {
        setSuccess(true)
      }
    } catch {
      setServerError(t('post.errorSubmit'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <CheckCircle size={56} className="text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">{t('post.successTitle')}</h2>
        <p className="text-gray-600 max-w-sm">{t('post.successMsg')}</p>
      </div>
    )
  }

  const inputClass = "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Property info section */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">{t('post.sectionProperty')}</h2>

        <div>
          <label className={labelClass}>{t('post.adTitle')} *</label>
          <input
            required
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder={t('post.adTitlePlaceholder')}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>{t('post.description')}</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder={t('post.descriptionPlaceholder')}
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('post.propertyType')}</label>
            <select
              value={form.property_type}
              onChange={e => set('property_type', e.target.value)}
              className={inputClass}
            >
              <option value="">{t('filter.allTypes')}</option>
              {PROPERTY_TYPES.map(pt => (
                <option key={pt} value={pt}>{t(`propertyType.${pt}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>{t('post.priceType')}</label>
            <select
              value={form.price_type}
              onChange={e => set('price_type', e.target.value)}
              className={inputClass}
            >
              <option value="rent">{t('post.rent')}</option>
              <option value="sale">{t('post.sale')}</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>{t('post.price')} *</label>
            <input
              required
              type="number"
              min={1}
              value={form.price}
              onChange={e => set('price', e.target.value)}
              placeholder={t('post.pricePlaceholder')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('post.surface')}</label>
            <input
              type="number"
              min={1}
              value={form.surface_m2}
              onChange={e => set('surface_m2', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('post.rooms')}</label>
            <input
              type="number"
              min={1}
              max={20}
              value={form.rooms}
              onChange={e => set('rooms', e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>{t('post.floor')}</label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.floor}
              onChange={e => set('floor', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.furnished}
              onChange={e => set('furnished', e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            {t('post.furnished')}
          </label>
        </div>

        {/* Address */}
        <div>
          <label className={labelClass}>{t('post.address')} *</label>
          <AddressAutocomplete
            value={form.address}
            onChange={v => set('address', v)}
            onGeoResult={handleGeoResult}
            error={geoError}
          />
          <p className="mt-1 text-xs text-gray-400">{t('post.addressHint')}</p>
        </div>

        {/* Nearest station preview */}
        {geo && geo.walkMinutes <= 10 && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl p-3 border border-green-200">
            <span>{t('post.nearestStation')} :</span>
            <StationBadge
              station={geo.nearestStation}
              walkMinutes={geo.walkMinutes}
              lang={lang}
              walkLabel={t('listing.walk')}
            />
          </div>
        )}
      </section>

      {/* Photos */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">{t('post.sectionPhotos')}</h2>
        <ImageUploader urls={images} onChange={setImages} />
      </section>

      {/* Contact */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">{t('post.sectionContact')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('post.contactName')} *</label>
            <input
              required
              type="text"
              value={form.contact_name}
              onChange={e => set('contact_name', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('post.contactEmail')} *</label>
            <input
              required
              type="email"
              value={form.contact_email}
              onChange={e => set('contact_email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>{t('post.contactPhone')}</label>
            <input
              type="tel"
              value={form.contact_phone}
              onChange={e => set('contact_phone', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !!geoError || !geo}
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}
        {submitting ? t('post.submitting') : t('post.submit')}
      </button>
    </form>
  )
}
