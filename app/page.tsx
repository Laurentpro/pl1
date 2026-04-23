'use client'
import { Train } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import PropertyGrid from '@/components/listings/PropertyGrid'

const STATIONS = [
  { name: 'La Défense',     photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/La_D%C3%A9fense_Collage.jpg/120px-La_D%C3%A9fense_Collage.jpg' },
  { name: 'Étoile',         photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Arc_de_Triomphe%2C_Paris_21_October_2010.jpg/120px-Arc_de_Triomphe%2C_Paris_21_October_2010.jpg' },
  { name: 'Concorde',       photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Paris_place_concorde.jpg/120px-Paris_place_concorde.jpg' },
  { name: 'Louvre',         photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Louvre_Museum_Wikimedia_Commons.jpg/120px-Louvre_Museum_Wikimedia_Commons.jpg' },
  { name: 'Châtelet',       photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Th%C3%A9%C3%A2tre_du_Ch%C3%A2telet.jpg/120px-Th%C3%A9%C3%A2tre_du_Ch%C3%A2telet.jpg' },
  { name: 'Hôtel de Ville', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/H%C3%B4tel_de_Ville_de_Paris_2021.jpg/120px-H%C3%B4tel_de_Ville_de_Paris_2021.jpg' },
  { name: 'Bastille',       photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Colonne_de_Juillet%2C_Place_de_la_Bastille%2C_Paris_2011.jpg/120px-Colonne_de_Juillet%2C_Place_de_la_Bastille%2C_Paris_2011.jpg' },
  { name: 'Gare de Lyon',   photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Gare_de_Lyon_-_facade.jpg/120px-Gare_de_Lyon_-_facade.jpg' },
  { name: 'Nation',         photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Place_de_la_Nation_-_Triomphe_de_la_R%C3%A9publique.jpg/120px-Place_de_la_Nation_-_Triomphe_de_la_R%C3%A9publique.jpg' },
  { name: 'Vincennes',      photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Chateau_de_Vincennes_-_20060429.jpg/120px-Chateau_de_Vincennes_-_20060429.jpg' },
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
