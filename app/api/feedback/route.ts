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
  const { userId, rating, comment } = body

  if (!userId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  // Limite longueur du commentaire
  if (comment && comment.length > 1000) {
    return NextResponse.json({ error: 'Commentaire trop long (1000 caractères max).' }, { status: 400 })
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
