import { Train } from 'lucide-react'
import type { MetroStation } from '@/types'
import type { Locale } from '@/types'

interface Props {
  station: MetroStation | null | undefined
  walkMinutes: number | null
  lang?: Locale
  walkLabel?: string
}

export default function StationBadge({ station, walkMinutes, lang = 'fr', walkLabel }: Props) {
  if (!station) return null
  const name = lang === 'en' && station.name_en ? station.name_en : station.name
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
      <Train size={12} />
      {name}
      {walkMinutes != null && (
        <span className="text-blue-500">· {walkMinutes} {walkLabel ?? 'min'}</span>
      )}
    </span>
  )
}
