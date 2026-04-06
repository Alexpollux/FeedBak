import Link from 'next/link'

export default function MerciPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display font-bold text-2xl text-stone-900 mb-3">
          Merci pour votre avis !
        </h1>
        <p className="text-stone-400 text-sm leading-relaxed mb-8">
          Votre retour est précieux et aide à améliorer le service.
          Il a bien été transmis.
        </p>
        <Link
          href="/"
          className="text-sm text-amber-600 font-medium hover:underline"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
