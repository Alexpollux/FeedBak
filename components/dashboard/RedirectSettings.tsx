'use client'

import { useState } from 'react'

interface Props {
  redirectUrl: string | null
}

export default function RedirectSettings({ redirectUrl: initial }: Props) {
  const [url, setUrl] = useState(initial ?? '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const save = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/dashboard/redirect', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redirectUrl: url || null }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess('Lien sauvegardé.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(data.error ?? 'Erreur lors de la sauvegarde.')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-6">
      <h2 className="font-display font-semibold text-stone-800 mb-1">
        Lien après envoi du formulaire
      </h2>
      <p className="text-sm text-stone-400 mb-5">
        Après avoir envoyé leur avis, vos clients verront un bouton pour revenir sur votre site.
        Laissez vide pour ne pas afficher de lien.
      </p>

      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://votre-site.com"
          className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition"
        />
        <button
          onClick={save}
          disabled={loading}
          className="bg-amber-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="mt-2 h-4">
        {success && <p className="text-sm text-green-600">{success}</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
