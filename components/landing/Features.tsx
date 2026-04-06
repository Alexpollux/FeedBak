import { Link2, Star, BarChart2 } from 'lucide-react'

const features = [
  {
    icon: Link2,
    title: 'Votre page en 30 secondes',
    description:
      'Choisissez votre slug, personnalisez le nom de votre activité, et votre page est prête à partager. Aucune compétence technique requise.',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: Star,
    title: 'Vos clients notent en 2 clics',
    description:
      'Interface ultra-simple : une note sur 5 et un commentaire optionnel. Aucun compte à créer pour vos clients. Taux de complétion maximal.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: BarChart2,
    title: 'Dashboard clair et actionnable',
    description:
      'Note moyenne, nombre d\'avis, évolution dans le temps. Tout ce dont vous avez besoin pour comprendre et améliorer votre service.',
    color: 'bg-emerald-50 text-emerald-500',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber-500 uppercase tracking-widest mb-3">
            Fonctionnalités
          </p>
          <h2 className="font-display font-bold text-4xl text-stone-900 mb-4">
            Simple. Efficace. Fait pour vous.
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Conçu pour les indépendants et petites boutiques qui veulent des vrais retours clients, sans la complexité.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-stone-100 bg-[#FAFAF8] hover:border-amber-200 hover:shadow-md transition-all duration-300"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${f.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-semibold text-lg text-stone-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
