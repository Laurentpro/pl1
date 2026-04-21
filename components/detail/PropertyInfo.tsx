'use client'
import { useState } from 'react'
import { MapPin, BedDouble, Maximize2, Layers, Mail, Phone, Share2, Check } from 'lucide-react'
import StationBadge from '@/components/listings/StationBadge'
import { useTranslation } from '@/i18n/useTranslation'
import type { Property } from '@/types'

interface Props {
  property: Property
}

export default function PropertyInfo({ property }: Props) {
  const { t, lang } = useTranslation()
  const [copied, setCopied] = useState(false)

  const title = lang === 'en' && property.title_en ? property.title_en : property.title
  const description = lang === 'en' && property.description_en ? property.description_en : property.description

  const shareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isRent = property.price_type === 'rent'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-500 text-sm">
            <MapPin size={14} />
            {property.address}
          </div>
        </div>
        <button
          onClick={shareLink}
          className="flex-none flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
          {copied ? t('detail.linkCopied') : t('detail.shareLink')}
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-gray-900">
          {property.price.toLocaleString('fr-FR')} €
        </span>
        {isRent && <span className="text-gray-500 text-base">{t('listing.perMonth')}</span>}
      </div>

      {/* Station */}
      <StationBadge
        station={property.metro_stations}
        walkMinutes={property.walk_minutes}
        lang={lang}
        walkLabel={t('listing.walk')}
      />

      {/* Characteristics */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {t('detail.characteristics')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {property.property_type && (
            <Stat label={t(`propertyType.${property.property_type}`)} icon={<Layers size={16} />} />
          )}
          {property.rooms && (
            <Stat label={`${property.rooms} ${t('listing.rooms')}`} icon={<BedDouble size={16} />} />
          )}
          {property.surface_m2 && (
            <Stat label={`${property.surface_m2} m²`} icon={<Maximize2 size={16} />} />
          )}
          {property.floor != null && (
            <Stat label={`${t('detail.floor')} ${property.floor}`} icon={<Layers size={16} />} />
          )}
          <Stat
            label={property.furnished ? t('listing.furnished') : t('listing.unfurnished')}
            icon={<Check size={16} />}
          />
        </div>
      </div>

      {/* Description */}
      {description && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            {t('detail.description')}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{description}</p>
        </div>
      )}

      {/* Contact card */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h2 className="font-semibold text-blue-900 mb-3">{t('detail.contact')}</h2>
        <p className="font-medium text-gray-800">{property.contact_name}</p>
        <div className="mt-3 space-y-2">
          <a
            href={`mailto:${property.contact_email}`}
            className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
          >
            <Mail size={15} /> {property.contact_email}
          </a>
          {property.contact_phone && (
            <a
              href={`tel:${property.contact_phone}`}
              className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
            >
              <Phone size={15} /> {property.contact_phone}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700">
      <span className="text-gray-400">{icon}</span>
      {label}
    </div>
  )
}
