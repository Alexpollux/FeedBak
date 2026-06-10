'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StarRating from '@/components/ui/StarRating'
import Button from '@/components/ui/Button'

const MAX_COMMENT = 1000
const MAX_NAME = 100

interface Project {
  id: string
  name: string
}

interface Props {
  slug: string
  enableFirstName: boolean
  enableLastName: boolean
  projects: Project[]
}

export default function FeedbackForm({ slug, enableFirstName, enableLastName, projects }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [projectId, setProjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (projects.length > 0 && !projectId) {
      setError('Veuillez sélectionner un projet.')
      return
    }
    if (rating === 0) {
      setError('Veuillez sélectionner une note.')
      return
    }
    setError('')
    setLoading(true)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        rating,
        comment,
        firstName: enableFirstName ? firstName : undefined,
        lastName: enableLastName ? lastName : undefined,
        projectId: projects.length > 0 ? projectId || undefined : undefined,
      }),
    })

    if (res.ok) {
      router.push(`/f/${slug}/merci`)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Prénom / Nom */}
        {(enableFirstName || enableLastName) && (
          <div className={`grid gap-4 ${enableFirstName && enableLastName ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {enableFirstName && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Prénom
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value.slice(0, MAX_NAME))}
                  placeholder="Votre prénom"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>
            )}
            {enableLastName && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Nom
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value.slice(0, MAX_NAME))}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
                />
              </div>
            )}
          </div>
        )}

        {/* Projet */}
        {projects.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Projet <span className="text-red-500">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition bg-white"
            >
              <option value="">— Sélectionner un projet —</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-3">
            Quelle note donneriez-vous ? <span className="text-red-500">*</span>
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
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-sm font-medium text-stone-700">
              Un commentaire ? <span className="text-stone-400 font-normal">(optionnel)</span>
            </label>
            <span className={`text-xs ${comment.length > MAX_COMMENT * 0.9 ? 'text-red-400' : 'text-stone-300'}`}>
              {comment.length}/{MAX_COMMENT}
            </span>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
            placeholder="Partagez votre expérience..."
            rows={4}
            maxLength={MAX_COMMENT}
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
