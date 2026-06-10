import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function MerciPage({ params }: Props) {
  const { slug } = await params
  const user = await prisma.user.findUnique({ where: { slug } })
  const redirectUrl = user?.redirectUrl ?? null

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="font-display font-bold text-2xl text-stone-900 mb-3">
          Merci pour votre avis !
        </h1>
        <p className="text-stone-400 text-sm leading-relaxed mb-8">
          Votre retour est précieux et aide à améliorer le service.
          Il a bien été transmis.
        </p>
        {redirectUrl && (
          <a
            href={redirectUrl}
            className="inline-block bg-amber-500 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors"
          >
            Retourner sur le site →
          </a>
        )}
      </div>
    </div>
  )
}
