'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Train, Menu, X } from 'lucide-react'
import { useState } from 'react'
import LangToggle from './LangToggle'
import { useTranslation } from '@/i18n/useTranslation'

export default function Navbar() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: t('nav.listings') },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-700">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg">
              <Train size={18} />
            </div>
            <span>
              Paris<span className="text-blue-500">Line</span>
              <span className="font-black">One</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/post"
              className="hidden lg:inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('nav.post')}
            </Link>
            <LangToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <LangToggle />
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/post"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white text-center"
          >
            {t('nav.post')}
          </Link>
        </div>
      )}
    </nav>
  )
}
