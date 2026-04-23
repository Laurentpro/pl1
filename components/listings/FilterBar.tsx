'use client'
import { useState } from 'react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import { LINE1_STATIONS } from '@/lib/stations'
import type { PropertyFilters, PropertyType, PriceType } from '@/types'

interface Props {
  filters: PropertyFilters
  onChange: (f: PropertyFilters) => void
}

const PROPERTY_TYPES: PropertyType[] = ['apartment', 'house', 'studio', 'commercial']

export default function FilterBar({ filters, onChange }: Props) {
  const { t, lang } = useTranslation()
  const [local, setLocal] = useState<PropertyFilters>(filters)

  const apply = () => onChange(local)
  const reset = () => {
    const empty: PropertyFilters = {}
    setLocal(empty)
    onChange(empty)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm">
        <SlidersHorizontal size={16} />
        {t('filter.title')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Station */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('filter.station')}</label>
          <select
            value={local.station_id ?? ''}
            onChange={e => setLocal({ ...local, station_id: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{t('filter.allStations')}</option>
            {LINE1_STATIONS.map(s => (
              <option key={s.id} value={s.id}>
                {lang === 'en' && s.name_en ? s.name_en : s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Walking distance */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('filter.walkMax')}</label>
          <select
            value={local.walk_max ?? ''}
            onChange={e => setLocal({ ...local, walk_max: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{t('filter.walkAll')}</option>
            <option value="5">{t('filter.walk5')}</option>
            <option value="10">{t('filter.walk10')}</option>
            <option value="15">{t('filter.walk15')}</option>
          </select>
        </div>

        {/* Property type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('filter.type')}</label>
          <select
            value={local.property_type ?? ''}
            onChange={e => setLocal({ ...local, property_type: (e.target.value as PropertyType) || undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{t('filter.allTypes')}</option>
            {PROPERTY_TYPES.map(pt => (
              <option key={pt} value={pt}>{t(`propertyType.${pt}`)}</option>
            ))}
          </select>
        </div>

        {/* Price type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('filter.priceType')}</label>
          <select
            value={local.price_type ?? ''}
            onChange={e => setLocal({ ...local, price_type: (e.target.value as PriceType) || undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">{t('filter.allPriceTypes')}</option>
            <option value="rent">{t('post.rent')}</option>
            <option value="sale">{t('post.sale')}</option>
          </select>
        </div>

        {/* Max price */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">{t('filter.maxPrice')} (€)</label>
          <input
            type="number"
            min={0}
            placeholder="∞"
            value={local.price_max ?? ''}
            onChange={e => setLocal({ ...local, price_max: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Furnished + Actions */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={local.furnished ?? false}
            onChange={e => setLocal({ ...local, furnished: e.target.checked || undefined })}
            className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          {t('filter.furnished')}
        </label>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw size={13} />
            {t('filter.reset')}
          </button>
          <button
            onClick={apply}
            className="px-4 py-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('filter.apply')}
          </button>
        </div>
      </div>
    </div>
  )
}
