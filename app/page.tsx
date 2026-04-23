'use client'
import { Train } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import PropertyGrid from '@/components/listings/PropertyGrid'

const STATIONS = [
  { name: 'La Défense',     photo: 'https://source.unsplash.com/80x80/?la-defense-paris-towers' },
  { name: 'Étoile',         photo: 'https://source.unsplash.com/80x80/?arc-de-triomphe' },
  { name: 'Concorde',       photo: 'https://source.unsplash.com/80x80/?place-de-la-concorde-obelisk' },
  { name: 'Louvre',         photo: 'https://source.unsplash.com/80x80/?louvre-pyramid-paris' },
  { name: 'Châtelet',       photo: 'https://source.unsplash.com/80x80/?chatelet-paris-theatre' },
  { name: 'Hôtel de Ville', photo: 'https://source.unsplash.com/80x80/?paris-city-hall' },
  { name: 'Bastille',       photo: 'https://source.unsplash.com/80x80/?place-de-la-bastille-paris' },
  { name: 'Gare de Lyon',   photo: 'https://source.unsplash.com/80x80/?gare-de-lyon-clock-tower' },
  { name: 'Nation',         photo: 'https://source.unsplash.com/80x80/?place-de-la-nation-paris' },
  { name: 'Vincennes',      photo: 'https://source.unsplash.com/80x80/?chateau-de-vincennes' },
]

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero — compact so filters are visible above the fold */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-medium mb-4">
            <Train size={14} />
            Métro Ligne 1 · Paris
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-3">
            {t('hero.title')}{' '}
            <span className="text-blue-200">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl mx-auto mb-5">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#listings"
              className="px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
            >
              {t('hero.cta')}
            </a>
            <Link
              href="/post"
              className="px-5 py-2.5 bg-blue-800/50 border border-blue-400 text-white font-semibold rounded-xl hover:bg-blue-800/70 transition-colors text-sm"
            >
              {t('hero.postCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Metro Line 1 diagram */}
      <section className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="overflow-x-auto">
          <div className="flex justify-center">
            <div className="flex items-end gap-0 min-w-max px-4">
              {STATIONS.map((s, i) => (
                <div key={s.name} className="flex items-end">
                  {/* Station column */}
                  <div className="flex flex-col items-center w-16 sm:w-20">
                    <img
                      src={s.photo}
                      alt={s.name}
                      width={60}
                      height={60}
                      style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                      className="mb-1"
                      loading="lazy"
                    />
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-blue-700 mb-1" />
                    <span className="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight whitespace-nowrap">
                      {s.name}
                    </span>
                  </div>
                  {/* Connector line */}
                  {i < STATIONS.length - 1 && (
                    <div className="h-1 w-4 sm:w-6 bg-blue-700 mb-[18px] -mx-0.5 flex-none" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('listing.title')}</h2>
        <PropertyGrid />
      </section>
    </div>
  )
}
