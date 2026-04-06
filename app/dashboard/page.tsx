import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/dashboard/Sidebar'
import StatsCards from '@/components/dashboard/StatsCards'
import FeedbackList from '@/components/dashboard/FeedbackList'
import Badge from '@/components/ui/Badge'
import CopyButton from '@/components/dashboard/CopyButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Récupère ou crée le profil Prisma
  let profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) {
    const meta = user.user_metadata
    profile = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: meta?.name ?? null,
        slug: meta?.slug ?? user.id.slice(0, 8),
      },
    })
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: 'desc' },
  })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonth = feedbacks.filter((f) => new Date(f.createdAt) >= startOfMonth).length
  const average = feedbacks.length
    ? feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
    : 0

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/f/${profile.slug}`

  return (
    <div className="flex min-h-screen bg-[#FAFAF8]">
      <Sidebar slug={profile.slug} />

      <main className="flex-1 p-6 md:p-10 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-stone-900">
              Bonjour{profile.name ? `, ${profile.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-stone-400 text-sm mt-1">Voici un résumé de vos avis</p>
          </div>
          <Badge variant={profile.plan === 'PRO' ? 'pro' : 'free'}>
            {profile.plan === 'PRO' ? '⚡ Pro' : 'Gratuit'}
          </Badge>
        </div>

        {/* Lien public */}
        <div className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-stone-400 font-medium mb-0.5">Votre lien de feedback</p>
            <p className="text-sm font-medium text-stone-700 font-mono">{publicUrl}</p>
          </div>
          <CopyButton text={publicUrl} />
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsCards total={feedbacks.length} average={average} thisMonth={thisMonth} />
        </div>

        {/* Liste */}
        <FeedbackList feedbacks={feedbacks} isPro={profile.plan === 'PRO'} />
      </main>
    </div>
  )
}

