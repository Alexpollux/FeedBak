import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting par IP : 10 avis max par heure
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const rl = checkRateLimit(ip)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans une heure.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { slug, rating, comment } = body

  if (!slug || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  if (comment && comment.length > 1000) {
    return NextResponse.json({ error: 'Commentaire trop long (1000 caractères max).' }, { status: 400 })
  }

  // Résolution du slug → utilisateur côté serveur (userId jamais exposé au client)
  const user = await prisma.user.findUnique({ where: { slug } })
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  // Vérifier la limite plan FREE (50 avis/mois)
  if (user.plan === 'FREE') {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthCount = await prisma.feedback.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    })

    if (monthCount >= 50) {
      return NextResponse.json(
        { error: 'Limite mensuelle atteinte pour ce compte.' },
        { status: 429 }
      )
    }
  }

  const feedback = await prisma.feedback.create({
    data: {
      userId: user.id,
      rating: Number(rating),
      comment: comment?.trim() || null,
    },
  })

  return NextResponse.json({ success: true, id: feedback.id })
}
