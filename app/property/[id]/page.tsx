import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient } from '@supabase/ssr'
import ImageGallery from '@/components/detail/ImageGallery'
import PropertyInfo from '@/components/detail/PropertyInfo'
import MapEmbed from '@/components/detail/MapEmbed'

async function getProperty(id: string) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
  const { data } = await supabase
    .from('properties')
    .select('*, metro_stations(*)')
    .eq('id', id)
    .eq('status', 'approved')
    .single()
  return data
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: gallery + map */}
        <div className="space-y-4">
          <ImageGallery images={property.images ?? []} title={property.title} />
          <MapEmbed lat={property.lat} lng={property.lng} address={property.address} />
        </div>

        {/* Right: info */}
        <div>
          <PropertyInfo property={property} />
        </div>
      </div>
    </div>
  )
}
