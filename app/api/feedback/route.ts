import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, rating, comment } = body

  if (!userId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  // Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  // Vérifier la limite plan FREE (50 avis/mois)
  if (user.plan === 'FREE') {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthCount = await prisma.feedback.count({
      where: { userId, createdAt: { gte: startOfMonth } },
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
      userId,
      rating: Number(rating),
      comment: comment?.trim() || null,
    },
  })

  return NextResponse.json({ success: true, id: feedback.id })
}
