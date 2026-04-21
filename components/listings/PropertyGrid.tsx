'use client'
import { useState, useEffect } from 'react'
import PropertyCard from './PropertyCard'
import FilterBar from './FilterBar'
import { useTranslation } from '@/i18n/useTranslation'
import type { Property, PropertyFilters } from '@/types'
import { Loader2 } from 'lucide-react'

export default function PropertyGrid() {
  const { t } = useTranslation()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PropertyFilters>({})

  const fetchProperties = async (f: PropertyFilters) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (f.station_id) params.set('station_id', String(f.station_id))
    if (f.price_max) params.set('price_max', String(f.price_max))
    if (f.property_type) params.set('property_type', f.property_type)
    if (f.price_type) params.set('price_type', f.price_type)
    if (f.furnished) params.set('furnished', 'true')

    const res = await fetch(`/api/properties?${params}`)
    const data = await res.json()
    setProperties(data.properties ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProperties(filters) }, [])

  const handleFilters = (f: PropertyFilters) => {
    setFilters(f)
    fetchProperties(f)
  }

  return (
    <div className="space-y-6">
      <FilterBar filters={filters} onChange={handleFilters} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">{t('listing.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(p => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  )
}
