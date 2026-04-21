interface Props {
  lat: number
  lng: number
  address: string
}

export default function MapEmbed({ lat, lng, address }: Props) {
  const query = encodeURIComponent(address)
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        src={src}
        width="100%"
        height="300"
        title={`Carte: ${address}`}
        loading="lazy"
        className="block"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-xs text-gray-500 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        Agrandir la carte ↗
      </a>
    </div>
  )
}
