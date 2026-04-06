import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import FeedbackForm from './FeedbackForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const user = await prisma.user.findUnique({ where: { slug } })
  if (!user) return {}
  return {
    title: `Laisser un avis — ${user.name ?? slug}`,
    description: `Partagez votre expérience avec ${user.name ?? slug}`,
  }
}

export default async function PublicFeedbackPage({ params }: Props) {
  const { slug } = await params
  const user = await prisma.user.findUnique({ where: { slug } })
  if (!user) notFound()

  const feedbackCount = await prisma.feedback.count({ where: { userId: user.id } })
  const avgResult = await prisma.feedback.aggregate({
    where: { userId: user.id },
    _avg: { rating: true },
  })
  const average = avgResult._avg.rating

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl mx-auto mb-4">
            {user.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <h1 className="font-display font-bold text-2xl text-stone-900 mb-1">
            {user.name ?? slug}
          </h1>
          <p className="text-stone-400 text-sm">
            Partagez votre expérience en quelques secondes
          </p>

          {feedbackCount > 0 && average && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-amber-500 font-bold text-sm">{average.toFixed(1)}</span>
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(average) ? '#FCD34D' : 'none'} stroke="#FCD34D" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-stone-400 text-xs">({feedbackCount} avis)</span>
            </div>
          )}
        </div>

        {/* Formulaire */}
        <FeedbackForm userId={user.id} slug={slug} />

        {/* Branding */}
        <p className="text-center text-xs text-stone-300 mt-8">
          Propulsé par{' '}
          <a href="/" className="text-amber-400 hover:underline">FeedBak</a>
        </p>
      </div>
    </div>
  )
}
