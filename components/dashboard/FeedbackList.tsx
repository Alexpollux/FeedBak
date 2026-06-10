'use client'

import { useState } from 'react'
import StarRating from '@/components/ui/StarRating'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import ExportButton from '@/components/dashboard/ExportButton'

interface Project {
  id: string
  name: string
}

interface Feedback {
  id: string
  rating: number
  comment: string | null
  firstName: string | null
  lastName: string | null
  projectId: string | null
  project: Project | null
  createdAt: Date
}

interface Props {
  feedbacks: Feedback[]
  isPro?: boolean
  projects?: Project[]
}

export default function FeedbackList({ feedbacks, isPro = false, projects = [] }: Props) {
  const [filterProject, setFilterProject] = useState<string>('all')

  const filtered = filterProject === 'all'
    ? feedbacks
    : filterProject === 'none'
      ? feedbacks.filter((f) => !f.projectId)
      : feedbacks.filter((f) => f.projectId === filterProject)

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
      <div className="px-6 py-4 border-b border-stone-100 flex flex-wrap items-center gap-3">
        <p className="font-display font-semibold text-stone-800 mr-auto">Avis reçus</p>

        {/* Filtre projet */}
        {isPro && projects.length > 0 && (
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="text-sm border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 focus:outline-none focus:border-amber-400 bg-white"
          >
            <option value="all">Tous les projets</option>
            <option value="none">Sans projet</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

        {isPro && <ExportButton />}
        <p className="text-sm text-stone-400">{filtered.length} avis</p>
      </div>

      <ul className="divide-y divide-stone-50">
        {filtered.map((fb) => {
          const displayName = [fb.firstName, fb.lastName].filter(Boolean).join(' ')
          return (
            <li key={fb.id} className="px-6 py-4 flex items-start gap-4 hover:bg-stone-50/50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
                {fb.rating}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <StarRating value={fb.rating} readonly size="sm" />
                  {displayName && (
                    <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                      {displayName}
                    </span>
                  )}
                  {fb.project && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      {fb.project.name}
                    </span>
                  )}
                  <span className="text-xs text-stone-400">
                    {formatDistanceToNow(new Date(fb.createdAt), { addSuffix: true, locale: fr })}
                  </span>
                </div>
                {fb.comment ? (
                  <p className="text-sm text-stone-600 leading-relaxed">{fb.comment}</p>
                ) : (
                  <p className="text-sm text-stone-400 italic">Pas de commentaire</p>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
