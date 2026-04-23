export type Locale = 'fr' | 'en'

export type PriceType = 'rent' | 'sale'
export type PropertyType = 'apartment' | 'house' | 'studio' | 'commercial'
export type PropertyStatus = 'pending' | 'approved' | 'rejected'

export interface MetroStation {
  id: number
  name: string
  name_en: string | null
  lat: number
  lng: number
}

export interface Property {
  id: string
  created_at: string
  updated_at: string
  title: string
  title_en: string | null
  description: string | null
  description_en: string | null
  price: number
  price_type: PriceType
  property_type: PropertyType | null
  surface_m2: number | null
  rooms: number | null
  floor: number | null
  furnished: boolean
  address: string
  lat: number
  lng: number
  nearest_station_id: number | null
  walk_minutes: number | null
  images: string[]
  contact_name: string
  contact_email: string
  contact_phone: string | null
  status: PropertyStatus
  admin_note: string | null
  metro_stations?: MetroStation | null
}

export interface PropertyFilters {
  station_id?: number
  price_max?: number
  property_type?: PropertyType
  price_type?: PriceType
  furnished?: boolean
  walk_max?: number
}
