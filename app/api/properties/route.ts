import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { nearestStation } from '@/lib/geo'

function makeSupabaseAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

function makeSupabaseAnon() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const supabase = makeSupabaseAnon()

  let query = supabase
    .from('properties')
    .select('*, metro_stations(*)')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  const station_id = searchParams.get('station_id')
  if (station_id) query = query.eq('nearest_station_id', Number(station_id))

  const price_max = searchParams.get('price_max')
  if (price_max) query = query.lte('price', Number(price_max))

  const property_type = searchParams.get('property_type')
  if (property_type) query = query.eq('property_type', property_type)

  const price_type = searchParams.get('price_type')
  if (price_type) query = query.eq('price_type', price_type)

  const furnished = searchParams.get('furnished')
  if (furnished === 'true') query = query.eq('furnished', true)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ properties: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    title, description, property_type, price_type = 'rent', price,
    surface_m2, rooms, floor, furnished = false,
    address, lat, lng,
    contact_name, contact_email, contact_phone,
    images = [],
  } = body

  if (!title || !price || !address || lat == null || lng == null || !contact_name || !contact_email) {
    return NextResponse.json({ error: 'Champs requis manquants.' }, { status: 400 })
  }

  // Server-side geo validation (defense in depth)
  const { station, minutes } = nearestStation(lat, lng)
  if (minutes > 10) {
    return NextResponse.json(
      { error: `Ce bien est à ${minutes} min de la station la plus proche (${station.name}). Maximum autorisé : 10 min.` },
      { status: 422 }
    )
  }

  const supabase = makeSupabaseAdmin()
  const { data, error } = await supabase.from('properties').insert({
    title,
    description: description || null,
    property_type: property_type || null,
    price_type,
    price: Number(price),
    surface_m2: surface_m2 ? Number(surface_m2) : null,
    rooms: rooms ? Number(rooms) : null,
    floor: floor != null ? Number(floor) : null,
    furnished: Boolean(furnished),
    address,
    lat,
    lng,
    nearest_station_id: station.id,
    walk_minutes: minutes,
    images,
    contact_name,
    contact_email,
    contact_phone: contact_phone || null,
    status: 'pending',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ property: data }, { status: 201 })
}
