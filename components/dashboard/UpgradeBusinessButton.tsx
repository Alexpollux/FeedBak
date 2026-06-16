'use client'

import { useState } from 'react'
import { ArrowRight, X } from 'lucide-react'

export default function UpgradeBusinessButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-stone-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
      >
        Passer au Business <ArrowRight size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X size={18} />
            </button>

            <h2 className="font-display font-bold text-xl text-stone-900 mb-1">
              Passer au plan Business 🚀
            </h2>
            <p className="text-sm text-stone-400 mb-6">
              Confirmez le changement d'abonnement
            </p>

            <div className="bg-stone-50 rounded-xl p-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Plan actuel</span>
                <span className="font-medium text-stone-700">Pro — 15€/mois</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Nouveau plan</span>
                <span className="font-medium text-stone-700">Business — 30€/mois</span>
              </div>
              <hr className="border-stone-200" />
              <div className="flex justify-between">
                <span className="text-stone-500">Facturation aujourd'hui</span>
                <span className="font-semibold text-stone-900">Différence au prorata</span>
              </div>
              <p className="text-xs text-stone-400">
                Stripe calcule automatiquement le temps restant sur votre plan Pro et ne facture que la différence pour la période en cours.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Annuler
              </button>
              <form
                action="/api/stripe/upgrade"
                method="POST"
                onSubmit={() => setLoading(true)}
                className="flex-1"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-800 text-white text-sm font-medium hover:bg-stone-700 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Traitement…' : 'Confirmer le passage'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
