'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ListingTable from '@/components/admin/ListingTable'
import { useTranslation } from '@/i18n/useTranslation'
import type { Property, PropertyStatus } from '@/types'

type TabStatus = 'all' | PropertyStatus

const TABS: TabStatus[] = ['all', 'pending', 'approved', 'rejected']
const PAGE_SIZE = 20

export default function AdminDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authed, setAuthed] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [tab, setTab] = useState<TabStatus>('pending')
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('admins').select('user_id').eq('user_id', session.user.id).single()
      if (!data) { router.push('/'); return }
      setAuthed(true)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchProperties(tab, 0)
  }, [authed, tab])

  const fetchProperties = async (status: TabStatus, from: number) => {
    const supabase = createClient()
    setLoading(true)
    let query = supabase
      .from('properties')
      .select('*, metro_stations(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)

    if (status !== 'all') query = query.eq('status', status)

    const { data, count } = await query
    if (from === 0) {
      setProperties(data ?? [])
    } else {
      setProperties(p => [...p, ...(data ?? [])])
    }
    setHasMore((count ?? 0) > from + PAGE_SIZE)
    setOffset(from + PAGE_SIZE)
    setLoading(false)
  }

  const handleStatusChange = async (id: string, status: PropertyStatus, note?: string) => {
    const res = await fetch(`/api/properties/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_note: note }),
    })
    if (res.ok) {
      setProperties(ps => ps.map(p => p.id === id ? { ...p, status, admin_note: note ?? null } : p))
      showToast(t('admin.statusUpdated'))
    }
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const counts = {
    all:      properties.length,
    pending:  properties.filter(p => p.status === 'pending').length,
    approved: properties.filter(p => p.status === 'approved').length,
    rejected: properties.filter(p => p.status === 'rejected').length,
  }

  if (!authed && loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <LogOut size={15} />
          {t('admin.signOut')}
        </button>
      </div>

      {/* Stats pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {TABS.map(s => (
          <button
            key={s}
            onClick={() => { setTab(s); setOffset(0) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === s
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
            }`}
          >
            {t(`admin.${s}`)}
            {s === 'pending' && counts.pending > 0 && (
              <span className="ml-2 bg-amber-400 text-amber-900 text-xs rounded-full px-1.5 py-0.5">
                {counts.pending}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={28} />
        </div>
      ) : (
        <>
          <ListingTable properties={properties} onStatusChange={handleStatusChange} />
          {hasMore && (
            <div className="mt-4 text-center">
              <button
                onClick={() => fetchProperties(tab, offset)}
                className="px-5 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                {t('admin.loadMore')}
              </button>
            </div>
          )}
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg transition-all">
          {toast}
        </div>
      )}
    </div>
  )
}
