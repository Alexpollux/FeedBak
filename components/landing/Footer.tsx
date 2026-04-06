import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-100 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display font-bold text-stone-900">
          Feed<span className="text-amber-500">Bak</span>
        </p>

        <p className="text-sm text-stone-400">
          © {new Date().getFullYear()} FeedBak. Fait avec ☕ pour les indépendants.
        </p>

        <div className="flex items-center gap-6 text-sm text-stone-400">
          <Link href="#" className="hover:text-stone-600 transition-colors">Mentions légales</Link>
          <Link href="#" className="hover:text-stone-600 transition-colors">Confidentialité</Link>
          <Link href="/login" className="hover:text-stone-600 transition-colors">Connexion</Link>
        </div>
      </div>
    </footer>
  )
}
