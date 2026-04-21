import type { MetroStation } from '@/types'
import { LINE1_STATIONS } from './stations'

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export function nearestStation(lat: number, lng: number, stations: MetroStation[] = LINE1_STATIONS) {
  let best = { station: stations[0], minutes: Infinity }
  for (const s of stations) {
    const km = haversineKm(lat, lng, s.lat, s.lng)
    const minutes = Math.round(km / 0.08)
    if (minutes < best.minutes) best = { station: s, minutes }
  }
  return best
}
