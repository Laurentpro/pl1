'use client'
import { Train } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import PropertyGrid from '@/components/listings/PropertyGrid'

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Train size={15} />
            Métro Ligne 1 · Paris
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight mb-4">
            {t('hero.title')}<br />
            <span className="text-blue-200">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#listings"
              className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              {t('hero.cta')}
            </a>
            <Link
              href="/post"
              className="px-6 py-3 bg-blue-800/50 border border-blue-400 text-white font-semibold rounded-xl hover:bg-blue-800/70 transition-colors"
            >
              {t('hero.postCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Line 1 stations strip */}
      <section className="bg-white border-b border-gray-200 py-3 px-4 overflow-x-auto">
        <div className="flex items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-0 min-w-max">
            {[
              'La Défense','Étoile','Concorde','Louvre','Châtelet',
              'Hôtel de Ville','Bastille','Gare de Lyon','Nation','Vincennes'
            ].map((s, i, arr) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-blue-700" />
                  <span className="text-[10px] text-gray-500 mt-1 whitespace-nowrap">{s}</span>
                </div>
                {i < arr.length - 1 && <div className="w-8 sm:w-12 h-1 bg-blue-700 -mx-0.5" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{t('listing.title')}</h2>
        <PropertyGrid />
      </section>
    </div>
  )
}
