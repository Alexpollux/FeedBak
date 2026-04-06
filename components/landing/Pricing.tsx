import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: 'pour toujours',
    description: 'Pour tester et démarrer.',
    features: [
      '1 page de feedback',
      "Jusqu'à 50 avis par mois",
      'Dashboard basique',
      'Lien de partage personnalisé',
    ],
    cta: 'Commencer gratuitement',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '9€',
    period: 'par mois',
    description: 'Pour les pros qui veulent plus.',
    features: [
      'Pages de feedback illimitées',
      'Avis illimités',
      'Export CSV',
      'Sans branding FeedBak',
      'Support prioritaire',
    ],
    cta: 'Passer au Pro',
    href: '/signup?plan=pro',
    highlighted: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-[#FAFAF8]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-amber-500 uppercase tracking-widest mb-3">
            Tarifs
          </p>
          <h2 className="font-display font-bold text-4xl text-stone-900 mb-4">
            Transparent. Sans surprise.
          </h2>
          <p className="text-stone-500 text-lg">
            Commencez gratuitement, passez au Pro quand vous êtes prêt.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 relative ${
                plan.highlighted
                  ? 'border-amber-400 bg-white shadow-xl shadow-amber-100'
                  : 'border-stone-200 bg-white'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Recommandé
                </span>
              )}

              <p className="font-display font-semibold text-stone-900 text-lg mb-1">
                {plan.name}
              </p>
              <p className="text-stone-400 text-sm mb-4">{plan.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-bold text-5xl text-stone-900">
                  {plan.price}
                </span>
                <span className="text-stone-400 text-sm">/{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-stone-600">
                    <Check size={16} className="text-amber-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="block">
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  size="md"
                  className="w-full justify-center"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
