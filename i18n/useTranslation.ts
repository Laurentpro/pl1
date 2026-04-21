'use client'
import { useContext } from 'react'
import { LangContext } from '@/lib/LangContext'
import fr from './fr.json'
import en from './en.json'

const dict = { fr, en } as const

type Dict = typeof fr

function getNestedValue(obj: unknown, keys: string[]): string {
  let current = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return keys.join('.')
    }
  }
  return typeof current === 'string' ? current : keys.join('.')
}

export function useTranslation() {
  const { lang } = useContext(LangContext)
  const translations = dict[lang as keyof typeof dict] ?? dict.fr

  const t = (key: string): string => {
    return getNestedValue(translations, key.split('.'))
  }

  return { t, lang }
}
