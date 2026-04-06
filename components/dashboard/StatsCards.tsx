import { Star, MessageSquare, TrendingUp } from 'lucide-react'

interface Props {
  total: number
  average: number
  thisMonth: number
}

export default function StatsCards({ total, average, thisMonth }: Props) {
  const cards = [
    {
      label: 'Note moyenne',
      value: average > 0 ? average.toFixed(1) : '—',
      sub: 'sur 5',
      icon: Star,
      color: 'bg-amber-50 text-amber-500',
    },
    {
      label: 'Total des avis',
      value: total,
      sub: 'depuis le début',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-500',
    },
    {
      label: 'Ce mois-ci',
      value: thisMonth,
      sub: 'nouveaux avis',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-stone-100 p-5 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xs text-stone-400 font-medium">{card.label}</p>
              <p className="font-display font-bold text-2xl text-stone-900 leading-tight">
                {card.value}
                <span className="text-sm text-stone-400 font-normal ml-1">{card.sub}</span>
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
