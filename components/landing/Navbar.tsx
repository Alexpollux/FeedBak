'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-stone-200/60">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-stone-900">
          Feed<span className="text-amber-500">Bak</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Essayer gratuitement</Button>
          </Link>
        </div>

        <button
          className="md:hidden p-2 text-stone-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-stone-600 hover:text-stone-900"
            >
              {l.label}
            </a>
          ))}
          <hr className="border-stone-100" />
          <Link href="/login" className="text-sm text-stone-600">Connexion</Link>
          <Link href="/signup">
            <Button size="sm" className="w-full">Essayer gratuitement</Button>
          </Link>
        </div>
      )}
    </header>
  )
}
