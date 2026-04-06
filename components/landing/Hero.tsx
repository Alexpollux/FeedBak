import Link from 'next/link'
import Button from '@/components/ui/Button'
import { ArrowRight, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="pt-24 pb-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        {/* Social proof pill */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm text-amber-700 mb-8">
          <div className="flex">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={12} className="fill-amber-400 stroke-amber-400" />
            ))}
          </div>
          Déjà utilisé par 200+ indépendants
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl text-stone-900 leading-tight mb-6">
          Transformez chaque client{' '}
          <span className="text-amber-500">en ambassadeur</span>
        </h1>

        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Créez votre page de feedback en 30 secondes. Partagez le lien.
          Regardez les avis arriver — sans friction pour vos clients.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link href="/signup">
            <Button size="lg">
              Essayer gratuitement
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/f/demo">
            <Button variant="outline" size="lg">
              Voir une page exemple
            </Button>
          </Link>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white shadow-xl shadow-stone-100 overflow-hidden text-left">
          {/* Fausse barre de navigation */}
          <div className="bg-stone-50 border-b border-stone-100 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <div className="w-3 h-3 rounded-full bg-yellow-300" />
              <div className="w-3 h-3 rounded-full bg-green-300" />
            </div>
            <div className="flex-1 mx-4 h-6 bg-stone-200 rounded-md text-xs flex items-center px-3 text-stone-400">
              feedbak.app/dashboard
            </div>
          </div>

          {/* Faux contenu dashboard */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold text-stone-800">Mes avis récents</p>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">24 ce mois</span>
            </div>

            {[
              { name: 'Sophie M.', rating: 5, comment: 'Service impeccable, je recommande vraiment !' },
              { name: 'Thomas R.', rating: 4, comment: 'Très satisfait, livraison rapide et soignée.' },
              { name: 'Isabelle D.', rating: 5, comment: 'Exactement ce que je cherchais, merci beaucoup.' },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
                  {item.name[0]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-stone-800">{item.name}</span>
                    <div className="flex">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={11} className="fill-amber-400 stroke-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 truncate">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
