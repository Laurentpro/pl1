'use client'
import Link from 'next/link'
import Image from 'next/image'
import { BedDouble, Maximize2, MapPin } from 'lucide-react'
import StationBadge from './StationBadge'
import { useTranslation } from '@/i18n/useTranslation'
import type { Property } from '@/types'

interface Props {
  property: Property
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80'

export default function PropertyCard({ property }: Props) {
  const { t, lang } = useTranslation()

  const title = lang === 'en' && property.title_en ? property.title_en : property.title
  const image = property.images?.[0] ?? PLACEHOLDER
  const isRent = property.price_type === 'rent'
  const typeLabel = property.property_type
    ? t(`propertyType.${property.property_type}`)
    : null

  return (
    <Link
      href={`/property/${property.id}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {typeLabel && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 backdrop-blur text-gray-700 text-xs font-semibold rounded-full">
            {typeLabel}
          </span>
        )}
        {property.furnished && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            {t('listing.furnished')}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs">
            <MapPin size={11} />
            <span className="truncate">{property.address}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {property.rooms && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} />
              {property.rooms} {t('listing.rooms')}
            </span>
          )}
          {property.surface_m2 && (
            <span className="flex items-center gap-1">
              <Maximize2 size={13} />
              {property.surface_m2} {t('listing.surface')}
            </span>
          )}
        </div>

        {/* Station badge */}
        <StationBadge
          station={property.metro_stations}
          walkMinutes={property.walk_minutes}
          lang={lang}
          walkLabel={t('listing.walk')}
        />

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {property.price.toLocaleString('fr-FR')} €
            </span>
            {isRent && (
              <span className="text-xs text-gray-500 ml-1">{t('listing.perMonth')}</span>
            )}
          </div>
          <span className="text-xs text-blue-600 font-medium group-hover:underline">
            {t('listing.seeDetail')} →
          </span>
        </div>
      </div>
    </Link>
  )
}
