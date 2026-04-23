'use client'
import { Train } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/i18n/useTranslation'
import PropertyGrid from '@/components/listings/PropertyGrid'

const BG = '#1a56db'
const G  = '#FFD700'

const STATION_SVGS: Record<string, React.ReactNode> = {
  'La Défense': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Two office towers */}
      <rect x="12" y="16" width="13" height="36" rx="1" fill={G}/>
      <rect x="29" y="24" width="13" height="28" rx="1" fill={G}/>
      {/* Windows */}
      <rect x="14" y="20" width="3" height="3" fill={BG} opacity=".5"/>
      <rect x="19" y="20" width="3" height="3" fill={BG} opacity=".5"/>
      <rect x="14" y="27" width="3" height="3" fill={BG} opacity=".5"/>
      <rect x="19" y="27" width="3" height="3" fill={BG} opacity=".5"/>
      <rect x="31" y="28" width="3" height="3" fill={BG} opacity=".5"/>
      <rect x="36" y="28" width="3" height="3" fill={BG} opacity=".5"/>
      {/* Ground */}
      <rect x="8" y="52" width="44" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Étoile': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Arc de Triomphe */}
      <rect x="13" y="26" width="10" height="26" rx="1" fill={G}/>
      <rect x="37" y="26" width="10" height="26" rx="1" fill={G}/>
      <path d="M13 26 Q30 8 47 26" fill={G}/>
      {/* Inner arch opening */}
      <path d="M19 52 L19 38 Q30 28 41 38 L41 52 Z" fill={BG}/>
      {/* Attic/entablature */}
      <rect x="11" y="24" width="38" height="5" rx="1" fill={G}/>
      {/* Ground */}
      <rect x="8" y="52" width="44" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Concorde': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Obelisk shaft */}
      <polygon points="25,48 35,48 32,14 28,14" fill={G}/>
      {/* Pyramid tip */}
      <polygon points="28,14 32,14 30,8" fill={G}/>
      {/* Base */}
      <rect x="20" y="48" width="20" height="4" rx="1" fill={G}/>
      <rect x="16" y="52" width="28" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Louvre': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Glass pyramid */}
      <polygon points="30,8 54,50 6,50" fill="none" stroke={G} strokeWidth="2.5"/>
      {/* Pyramid inner edges */}
      <line x1="30" y1="8" x2="30" y2="50" stroke={G} strokeWidth="1.2" opacity=".6"/>
      <line x1="30" y1="8" x2="42" y2="50" stroke={G} strokeWidth="1.2" opacity=".6"/>
      <line x1="30" y1="8" x2="18" y2="50" stroke={G} strokeWidth="1.2" opacity=".6"/>
      {/* Ground line */}
      <rect x="5" y="50" width="50" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Châtelet': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Main façade */}
      <rect x="8" y="22" width="44" height="31" rx="1" fill={G}/>
      {/* Triangular pediment */}
      <polygon points="8,22 30,10 52,22" fill={G}/>
      {/* Columns */}
      <rect x="14" y="30" width="4" height="23" fill={BG} opacity=".4"/>
      <rect x="22" y="30" width="4" height="23" fill={BG} opacity=".4"/>
      <rect x="34" y="30" width="4" height="23" fill={BG} opacity=".4"/>
      <rect x="42" y="30" width="4" height="23" fill={BG} opacity=".4"/>
      {/* Door */}
      <rect x="25" y="40" width="10" height="13" rx="2" fill={BG} opacity=".6"/>
      {/* Ground */}
      <rect x="6" y="53" width="48" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Hôtel de Ville': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Main building */}
      <rect x="8" y="28" width="44" height="24" rx="1" fill={G}/>
      {/* Central pavilion */}
      <rect x="22" y="18" width="16" height="34" rx="1" fill={G}/>
      {/* Roof / mansard */}
      <polygon points="20,18 30,8 40,18" fill={G}/>
      {/* Central clock */}
      <circle cx="30" cy="24" r="4" fill={BG} opacity=".6"/>
      {/* Windows left wing */}
      <rect x="11" y="33" width="5" height="5" rx="1" fill={BG} opacity=".5"/>
      <rect x="11" y="42" width="5" height="5" rx="1" fill={BG} opacity=".5"/>
      {/* Windows right wing */}
      <rect x="44" y="33" width="5" height="5" rx="1" fill={BG} opacity=".5"/>
      <rect x="44" y="42" width="5" height="5" rx="1" fill={BG} opacity=".5"/>
      {/* Central door */}
      <rect x="26" y="42" width="8" height="10" rx="1" fill={BG} opacity=".6"/>
      {/* Ground */}
      <rect x="6" y="52" width="48" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Bastille': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Column shaft */}
      <rect x="26" y="14" width="8" height="36" rx="1" fill={G}/>
      {/* Capital */}
      <rect x="23" y="12" width="14" height="4" rx="1" fill={G}/>
      {/* Génie de la Liberté figure */}
      <circle cx="30" cy="9" r="4" fill={G}/>
      {/* Stepped base */}
      <rect x="20" y="50" width="20" height="4" rx="1" fill={G}/>
      <rect x="14" y="54" width="32" height="3" rx="1" fill={G}/>
    </svg>
  ),
  'Gare de Lyon': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Station building */}
      <rect x="8" y="38" width="44" height="16" rx="1" fill={G}/>
      {/* Clock tower */}
      <rect x="22" y="14" width="16" height="28" rx="1" fill={G}/>
      {/* Tower roof */}
      <polygon points="22,14 30,7 38,14" fill={G}/>
      {/* Clock face */}
      <circle cx="30" cy="27" r="6" fill={BG} opacity=".7"/>
      {/* Clock hands */}
      <line x1="30" y1="27" x2="30" y2="22" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="30" y1="27" x2="34" y2="27" stroke={G} strokeWidth="1.5" strokeLinecap="round"/>
      {/* Station windows */}
      <rect x="12" y="42" width="6" height="5" rx="1" fill={BG} opacity=".5"/>
      <rect x="42" y="42" width="6" height="5" rx="1" fill={BG} opacity=".5"/>
    </svg>
  ),
  'Nation': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Pedestal */}
      <rect x="20" y="40" width="20" height="12" rx="1" fill={G}/>
      <rect x="16" y="50" width="28" height="5" rx="1" fill={G}/>
      {/* Figure body */}
      <rect x="26" y="26" width="8" height="15" rx="2" fill={G}/>
      {/* Head */}
      <circle cx="30" cy="22" r="5" fill={G}/>
      {/* Arms raised */}
      <line x1="26" y1="30" x2="18" y2="24" stroke={G} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="34" y1="30" x2="42" y2="24" stroke={G} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  'Vincennes': (
    <svg viewBox="0 0 60 60" width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="30" fill={BG}/>
      {/* Keep / main tower */}
      <rect x="21" y="14" width="18" height="38" rx="1" fill={G}/>
      {/* Tower battlements */}
      <rect x="20" y="10" width="4" height="6" rx="1" fill={G}/>
      <rect x="26" y="10" width="4" height="6" rx="1" fill={G}/>
      <rect x="32" y="10" width="4" height="6" rx="1" fill={G}/>
      {/* Curtain walls */}
      <rect x="8" y="32" width="14" height="20" rx="1" fill={G}/>
      <rect x="38" y="32" width="14" height="20" rx="1" fill={G}/>
      {/* Wall battlements */}
      <rect x="7" y="28" width="4" height="6" rx="1" fill={G}/>
      <rect x="13" y="28" width="4" height="6" rx="1" fill={G}/>
      <rect x="43" y="28" width="4" height="6" rx="1" fill={G}/>
      <rect x="49" y="28" width="4" height="6" rx="1" fill={G}/>
      {/* Tower window */}
      <rect x="27" y="24" width="6" height="8" rx="1" fill={BG} opacity=".6"/>
      {/* Ground */}
      <rect x="6" y="52" width="48" height="3" rx="1" fill={G}/>
    </svg>
  ),
}

const STATION_NAMES = [
  'La Défense','Étoile','Concorde','Louvre','Châtelet',
  'Hôtel de Ville','Bastille','Gare de Lyon','Nation','Vincennes',
]

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero — inline style gradient for full cross-browser compatibility */}
      <section
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1a56db 50%, #2563eb 100%)' }}
        className="text-white py-8 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Train size={14} />
            Métro Ligne 1 · Paris
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-3">
            {t('hero.title')}{' '}
            <span style={{ color: '#bfdbfe' }}>{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-sm sm:text-base max-w-xl mx-auto mb-5" style={{ color: '#dbeafe' }}>
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#listings"
              className="px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors"
              style={{ backgroundColor: '#fff', color: '#1d4ed8' }}
            >
              {t('hero.cta')}
            </a>
            <Link
              href="/post"
              className="px-5 py-2.5 font-semibold rounded-xl text-sm transition-colors"
              style={{ backgroundColor: 'rgba(30,58,138,0.5)', border: '1px solid rgba(147,197,253,0.6)', color: '#fff' }}
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
              {STATION_NAMES.map((name, i) => (
                <div key={name} className="flex items-end">
                  <div className="flex flex-col items-center w-16 sm:w-20">
                    <div className="mb-1" style={{ borderRadius: '50%', overflow: 'hidden', width: 60, height: 60, border: '2px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.12)', flexShrink: 0 }}>
                      {STATION_SVGS[name]}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-blue-700 mb-1" />
                    <span className="text-[9px] sm:text-[10px] text-gray-500 text-center leading-tight whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                  {i < STATION_NAMES.length - 1 && (
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
