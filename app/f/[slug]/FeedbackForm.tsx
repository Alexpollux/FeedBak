'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StarRating from '@/components/ui/StarRating'
import Button from '@/components/ui/Button'

export default function FeedbackForm({ userId, slug }: { userId: string; slug: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Veuillez sélectionner une note.')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rating, comment }),
    })

    if (res.ok) {
      router.push(`/f/${slug}/merci`)
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Quelle note donneriez-vous ?
          </label>
          <div className="flex justify-center">
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
          {rating > 0 && (
            <p className="text-center text-xs text-stone-400 mt-2">
              {['', 'Très mauvais', 'Mauvais', 'Correct', 'Bien', 'Excellent !'][rating]}
            </p>
          )}
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            Un commentaire ? <span className="text-stone-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full justify-center"
        >
          {loading ? 'Envoi...' : 'Envoyer mon avis'}
        </Button>
      </form>
    </div>
  )
}
