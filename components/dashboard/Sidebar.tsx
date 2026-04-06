'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutDashboard, Settings, LogOut, ExternalLink } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Paramètres', href: '/dashboard/settings', icon: Settings },
]

export default function Sidebar({ slug }: { slug: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 hidden md:flex flex-col bg-white border-r border-stone-100 min-h-screen p-4">
      <Link href="/" className="font-display font-bold text-lg text-stone-900 px-3 py-2 mb-6">
        Feed<span className="text-amber-500">Bak</span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              pathname === href
                ? 'bg-amber-50 text-amber-700'
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}

        <a
          href={`/f/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <ExternalLink size={16} />
          Ma page publique
        </a>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors mt-auto"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </aside>
  )
}
