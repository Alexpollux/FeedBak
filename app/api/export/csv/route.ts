import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  if (profile.plan !== 'PRO') {
    return NextResponse.json({ error: 'Fonctionnalité réservée au plan Pro' }, { status: 403 })
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: 'desc' },
  })

  const header = 'Note,Commentaire,Date'
  const rows = feedbacks.map((fb) => {
    const comment = fb.comment ? `"${fb.comment.replace(/"/g, '""')}"` : ''
    const date = new Date(fb.createdAt).toLocaleDateString('fr-FR')
    return `${fb.rating},${comment},${date}`
  })

  const csv = [header, ...rows].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="feedbacks-${profile.slug}.csv"`,
    },
  })
}
