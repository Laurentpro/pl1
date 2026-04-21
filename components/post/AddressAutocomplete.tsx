'use client'
import { useState, useRef } from 'react'
import { Search, Loader2, MapPin } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { nearestStation } from '@/lib/geo'
import type { MetroStation } from '@/types'

interface GeoResult {
  lat: number
  lng: number
  nearestStation: MetroStation
  walkMinutes: number
}

interface Props {
  value: string
  onChange: (address: string) => void
  onGeoResult: (result: GeoResult | null) => void
  error?: string
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

export default function AddressAutocomplete({ value, onChange, onGeoResult, error }: Props) {
  const { t } = useTranslation()
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [geoStatus, setGeoStatus] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInput = (v: string) => {
    onChange(v)
    setGeoStatus(null)
    onGeoResult(null)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (v.length < 5) { setSuggestions([]); return }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v + ', Paris, France')}&format=json&limit=5&countrycodes=fr`,
          { headers: { 'Accept-Language': 'fr' } }
        )
        const data: NominatimResult[] = await res.json()
        setSuggestions(data)
      } catch {}
    }, 400)
  }

  const geocode = async (address: string, lat?: number, lng?: number) => {
    setSuggestions([])
    setLoading(true)
    setGeoStatus(null)

    try {
      let resolvedLat = lat
      let resolvedLng = lng

      if (!resolvedLat || !resolvedLng) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
          { headers: { 'Accept-Language': 'fr' } }
        )
        const data: NominatimResult[] = await res.json()
        if (!data.length) {
          setGeoStatus('error')
          onGeoResult(null)
          return
        }
        resolvedLat = parseFloat(data[0].lat)
        resolvedLng = parseFloat(data[0].lon)
      }

      const { station, minutes } = nearestStation(resolvedLat, resolvedLng)
      onGeoResult({ lat: resolvedLat, lng: resolvedLng, nearestStation: station, walkMinutes: minutes })
      setGeoStatus(minutes > 10 ? 'too-far' : 'ok')
    } catch {
      setGeoStatus('error')
      onGeoResult(null)
    } finally {
      setLoading(false)
    }
  }

  const selectSuggestion = (s: NominatimResult) => {
    onChange(s.display_name)
    geocode(s.display_name, parseFloat(s.lat), parseFloat(s.lon))
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => handleInput(e.target.value)}
          placeholder={t('post.addressPlaceholder')}
          className={`flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-400' : 'border-gray-200'
          }`}
        />
        <button
          type="button"
          onClick={() => geocode(value)}
          disabled={loading || !value}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        </button>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => selectSuggestion(s)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 flex items-start gap-2"
              >
                <MapPin size={13} className="flex-none mt-0.5 text-gray-400" />
                <span className="line-clamp-2">{s.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Status */}
      {geoStatus === 'too-far' && (
        <p className="mt-1 text-xs text-red-600">{t('post.errorTooFar')}</p>
      )}
      {geoStatus === 'error' && (
        <p className="mt-1 text-xs text-red-600">{t('post.errorGeoloc')}</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
