'use client'
import { useLang } from '@/lib/LangContext'

export default function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-0.5 rounded transition-colors ${
          lang === 'fr'
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        FR
      </button>
      <span className="text-gray-300 dark:text-gray-600">|</span>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-0.5 rounded transition-colors ${
          lang === 'en'
            ? 'bg-blue-600 text-white'
            : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  )
}
