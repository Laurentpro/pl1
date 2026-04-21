'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Eye, ChevronDown } from 'lucide-react'
import { useTranslation } from '@/i18n/useTranslation'
import type { Property, PropertyStatus } from '@/types'

interface Props {
  properties: Property[]
  onStatusChange: (id: string, status: PropertyStatus, note?: string) => Promise<void>
}

const STATUS_COLORS: Record<PropertyStatus, string> = {
  pending:  'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function ListingTable({ properties, onStatusChange }: Props) {
  const { t, lang } = useTranslation()
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [openNote, setOpenNote] = useState<string | null>(null)

  const act = async (id: string, status: PropertyStatus) => {
    setLoading(l => ({ ...l, [id]: true }))
    await onStatusChange(id, status, notes[id])
    setLoading(l => ({ ...l, [id]: false }))
    setOpenNote(null)
  }

  if (!properties.length) {
    return <p className="text-gray-500 text-center py-12">{t('admin.noListings')}</p>
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
          <tr>
            <th className="text-left px-4 py-3">{t('admin.date')}</th>
            <th className="text-left px-4 py-3">{t('admin.property')}</th>
            <th className="text-left px-4 py-3 hidden md:table-cell">{t('admin.station')}</th>
            <th className="text-left px-4 py-3">{t('admin.status')}</th>
            <th className="text-right px-4 py-3">{t('admin.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {properties.map(p => {
            const title = lang === 'en' && p.title_en ? p.title_en : p.title
            const stationName = p.metro_stations
              ? (lang === 'en' && p.metro_stations.name_en ? p.metro_stations.name_en : p.metro_stations.name)
              : '—'

            return (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1 max-w-[200px]">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{p.address}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-gray-700">{stationName}</span>
                  {p.walk_minutes != null && (
                    <span className="text-gray-400 ml-1 text-xs">· {p.walk_minutes} min</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                    {t(`admin.${p.status}`)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/property/${p.id}`}
                      target="_blank"
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('admin.view')}
                    >
                      <Eye size={15} />
                    </Link>

                    {p.status !== 'approved' && (
                      <button
                        onClick={() => act(p.id, 'approved')}
                        disabled={loading[p.id]}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        title={t('admin.approve')}
                      >
                        <Check size={15} />
                      </button>
                    )}

                    {p.status !== 'rejected' && (
                      <div className="relative">
                        <button
                          onClick={() => setOpenNote(openNote === p.id ? null : p.id)}
                          disabled={loading[p.id]}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-0.5"
                          title={t('admin.reject')}
                        >
                          <X size={15} />
                          <ChevronDown size={11} />
                        </button>

                        {openNote === p.id && (
                          <div className="absolute right-0 top-full mt-1 z-10 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-3 space-y-2">
                            <textarea
                              rows={2}
                              placeholder={t('admin.note')}
                              value={notes[p.id] ?? ''}
                              onChange={e => setNotes(n => ({ ...n, [p.id]: e.target.value }))}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
                            />
                            <button
                              onClick={() => act(p.id, 'rejected')}
                              className="w-full py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
                            >
                              {t('admin.reject')}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
