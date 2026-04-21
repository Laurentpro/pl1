'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'

interface Props {
  images: string[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const imgs = images.length > 0 ? images : [PLACEHOLDER]
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = () => setCurrent(i => (i - 1 + imgs.length) % imgs.length)
  const next = () => setCurrent(i => (i + 1) % imgs.length)

  return (
    <>
      {/* Main gallery */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/9]">
        <Image
          src={imgs[current]}
          alt={`${title} - ${current + 1}`}
          fill
          className="object-cover cursor-zoom-in"
          onClick={() => setLightbox(true)}
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow hover:bg-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur rounded-full shadow hover:bg-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
              {current + 1} / {imgs.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {imgs.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-none w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === current ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image src={src} alt={`thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-4 right-4 p-2 text-white hover:text-gray-300">
            <X size={28} />
          </button>
          <button
            className="absolute left-4 p-2 text-white hover:text-gray-300"
            onClick={e => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={36} />
          </button>
          <div
            className="relative w-[90vw] h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={imgs[current]}
              alt={title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute right-4 p-2 text-white hover:text-gray-300"
            onClick={e => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  )
}
