import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, XCircle } from 'lucide-react'
import { createServerClient } from '@supabase/ssr'
import ImageGallery from '@/components/detail/ImageGallery'
import PropertyInfo from '@/components/detail/PropertyInfo'
import MapEmbed from '@/components/detail/MapEmbed'

async function getProperty(id: string) {
  // Service role key bypasses RLS so admins can preview pending/rejected listings
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
  const { data } = await supabase
    .from('properties')
    .select('*, metro_stations(*)')
    .eq('id', id)
    .single()
  return data
}

const STATUS_BANNER: Record<string, { icon: React.ReactNode; text: string; className: string }> = {
  pending: {
    icon: <Clock size={15} />,
    text: 'Cette annonce est en attente de validation et n\'est pas encore visible du public.',
    className: 'bg-amber-50 border-amber-200 text-amber-800',
  },
  rejected: {
    icon: <XCircle size={15} />,
    text: 'Cette annonce a été refusée et n\'est pas visible du public.',
    className: 'bg-red-50 border-red-200 text-red-800',
  },
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) notFound()

  const banner = property.status !== 'approved' ? STATUS_BANNER[property.status] : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Retour aux annonces
      </Link>

      {banner && (
        <div className={`flex items-center gap-2 px-4 py-3 mb-6 rounded-xl border text-sm font-medium ${banner.className}`}>
          {banner.icon}
          {banner.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ImageGallery images={property.images ?? []} title={property.title} />
          <MapEmbed lat={property.lat} lng={property.lng} address={property.address} />
        </div>
        <div>
          <PropertyInfo property={property} />
        </div>
      </div>
    </div>
  )
}
