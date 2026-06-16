import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/dashboard/Sidebar'
import Badge from '@/components/ui/Badge'
import ProSettings from '@/components/dashboard/ProSettings'
import RedirectSettings from '@/components/dashboard/RedirectSettings'
import UpgradeBusinessButton from '@/components/dashboard/UpgradeBusinessButton'
import { ArrowRight } from 'lucide-react'

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string; success?: string; canceled?: string }>
}) {
  const { upgraded, success, canceled } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { projects: { orderBy: { order: 'asc' } } },
  })
  if (!profile) redirect('/dashboard')

  const isPro = profile.plan === 'PRO'
  const isBusiness = profile.plan === 'BUSINESS'

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      <Sidebar slug={profile.slug} />

      <main className="flex-1 p-6 md:p-10 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-stone-900">Paramètres</h1>
          <p className="text-stone-400 text-sm mt-1">Gérez votre compte et votre abonnement</p>
        </div>

        {upgraded === 'true' && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-4">
            🚀 Bienvenue sur le plan Business ! Votre accès est activé immédiatement.
          </div>
        )}
        {success === 'true' && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 mb-4">
            ✅ Abonnement activé avec succès !
          </div>
        )}
        {canceled === 'true' && (
          <div className="bg-stone-100 border border-stone-200 rounded-xl px-4 py-3 text-sm text-stone-600 mb-4">
            Paiement annulé. Votre plan actuel est conservé.
          </div>
        )}

        {/* Profil */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-4">
          <h2 className="font-display font-semibold text-stone-800 mb-4">Mon compte</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-400">Nom</span>
              <span className="text-stone-700 font-medium">{profile.name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Email</span>
              <span className="text-stone-700 font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Slug</span>
              <span className="text-stone-700 font-mono font-medium">{profile.slug}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Plan</span>
              <Badge variant={isBusiness ? 'business' : isPro ? 'pro' : 'free'}>
                {isBusiness ? '🚀 Business' : isPro ? '⚡ Pro' : 'Gratuit'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Lien de redirection — disponible pour tous */}
        <div className="mb-4">
          <RedirectSettings redirectUrl={profile.redirectUrl ?? null} />
        </div>

        {/* Projets — tous les plans, champs Prénom/Nom Pro/Business uniquement */}
        <div className="mb-4">
          <ProSettings
            enableFirstName={profile.enableFirstName}
            enableLastName={profile.enableLastName}
            projects={profile.projects}
            projectLimit={profile.projectLimit}
            showFields={isPro || isBusiness}
          />
        </div>

        {/* Upgrade FREE → PRO */}
        {profile.plan === 'FREE' && (
          <div className="space-y-4">
            {/* PRO */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display font-semibold text-stone-900 mb-1">Plan Pro ⚡</h2>
                  <ul className="text-sm text-stone-500 space-y-1">
                    <li>✓ Champs Prénom & Nom</li>
                    <li>✓ Jusqu'à 5 projets</li>
                    <li>✓ Export CSV</li>
                    <li>✓ Avis illimités</li>
                  </ul>
                </div>
                <span className="font-display font-bold text-2xl text-amber-600">
                  15€<span className="text-sm font-normal text-stone-400">/mois</span>
                </span>
              </div>
              <a
                href="/api/stripe/checkout?plan=pro"
                className="inline-flex items-center gap-2 bg-amber-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors"
              >
                Passer au Pro <ArrowRight size={14} />
              </a>
            </div>

            {/* BUSINESS */}
            <div className="bg-gradient-to-br from-stone-50 to-slate-50 rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display font-semibold text-stone-900 mb-1">Plan Business 🚀</h2>
                  <ul className="text-sm text-stone-500 space-y-1">
                    <li>✓ Tout le plan Pro</li>
                    <li>✓ Jusqu'à 20 projets</li>
                    <li>✓ Support prioritaire</li>
                  </ul>
                </div>
                <span className="font-display font-bold text-2xl text-stone-700">
                  30€<span className="text-sm font-normal text-stone-400">/mois</span>
                </span>
              </div>
              <a
                href="/api/stripe/checkout?plan=business"
                className="inline-flex items-center gap-2 bg-stone-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-stone-700 transition-colors"
              >
                Passer au Business <ArrowRight size={14} />
              </a>
            </div>
          </div>
        )}

        {/* Upgrade Pro → Business */}
        {isPro && (
          <div className="bg-gradient-to-br from-stone-50 to-slate-50 rounded-2xl border border-stone-200 p-6 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-display font-semibold text-stone-900 mb-1">Passer au Business 🚀</h2>
                <ul className="text-sm text-stone-500 space-y-1">
                  <li>✓ 20 projets (vs 5 en Pro)</li>
                  <li>✓ Sans branding FeedBak</li>
                  <li>✓ Support dédié</li>
                </ul>
                <p className="text-xs text-stone-400 mt-3">
                  Le passage est immédiat. La différence au prorata sera facturée aujourd'hui.
                </p>
              </div>
              <span className="font-display font-bold text-2xl text-stone-700 shrink-0 ml-4">
                30€<span className="text-sm font-normal text-stone-400">/mois</span>
              </span>
            </div>
            <UpgradeBusinessButton />
          </div>
        )}

        {/* Gérer abonnement (Pro ou Business) */}
        {(isPro || isBusiness) && (
          <div className="bg-white rounded-2xl border border-stone-100 p-6">
            <h2 className="font-display font-semibold text-stone-800 mb-2">
              Abonnement {isBusiness ? 'Business 🚀' : 'Pro ⚡'} actif
            </h2>
            <p className="text-sm text-stone-400 mb-4">
              Votre abonnement est géré via Stripe.
            </p>
            <a
              href="/api/stripe/portal"
              className="text-sm text-amber-600 font-medium hover:underline"
            >
              Gérer / annuler mon abonnement →
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
