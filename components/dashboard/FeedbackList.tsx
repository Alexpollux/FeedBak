import StarRating from '@/components/ui/StarRating'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import ExportButton from '@/components/dashboard/ExportButton'

interface Feedback {
  id: string
  rating: number
  comment: string | null
  createdAt: Date
}

export default function FeedbackList({ feedbacks, isPro = false }: { feedbacks: Feedback[], isPro?: boolean }) {
  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-display font-semibold text-stone-700 mb-1">Pas encore d'avis</p>
        <p className="text-sm text-stone-400">
          Partagez votre lien de feedback à vos clients pour commencer.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <p className="font-display font-semibold text-stone-800">Avis reçus</p>
        <div className="flex items-center gap-3">
          {isPro && <ExportButton />}
          <p className="text-sm text-stone-400">{feedbacks.length} avis</p>
        </div>
      </div>

      <ul className="divide-y divide-stone-50">
        {feedbacks.map((fb) => (
          <li key={fb.id} className="px-6 py-4 flex items-start gap-4 hover:bg-stone-50/50 transition-colors">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
              {fb.rating}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <StarRating value={fb.rating} readonly size="sm" />
                <span className="text-xs text-stone-400">
                  {formatDistanceToNow(new Date(fb.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </span>
              </div>
              {fb.comment ? (
                <p className="text-sm text-stone-600 leading-relaxed">{fb.comment}</p>
              ) : (
                <p className="text-sm text-stone-400 italic">Pas de commentaire</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
