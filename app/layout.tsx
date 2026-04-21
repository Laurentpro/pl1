import type { Metadata } from 'next'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'ParisLineOne – Immobilier Ligne 1',
  description: 'Tous nos biens sont à moins de 10 minutes à pied d\'une station de la ligne 1 du métro parisien.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50">
        <LangProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400 mt-auto">
            © {new Date().getFullYear()} ParisLineOne — Immobilier ligne 1 · Paris
          </footer>
        </LangProvider>
      </body>
    </html>
  )
}
