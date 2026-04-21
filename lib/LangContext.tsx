'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Locale } from '@/types'

interface LangContextType {
  lang: Locale
  setLang: (l: Locale) => void
}

export const LangContext = createContext<LangContextType>({ lang: 'fr', setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>('fr')

  useEffect(() => {
    const stored = localStorage.getItem('pl1_lang') as Locale | null
    if (stored === 'en' || stored === 'fr') setLangState(stored)
  }, [])

  const setLang = (l: Locale) => {
    setLangState(l)
    localStorage.setItem('pl1_lang', l)
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
