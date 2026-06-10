import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  if (profile.plan === 'FREE') {
    return NextResponse.json({ error: 'Fonctionnalité réservée aux plans Pro et Business' }, { status: 403 })
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { userId: profile.id },
    orderBy: { createdAt: 'desc' },
    include: { project: true },
  })

  const hasFirstName = profile.enableFirstName
  const hasLastName = profile.enableLastName
  const hasProjects = feedbacks.some((f) => f.project)

  // Construire les colonnes dynamiquement
  const headerCols = ['Note', 'Commentaire']
  if (hasFirstName) headerCols.push('Prénom')
  if (hasLastName) headerCols.push('Nom')
  if (hasProjects) headerCols.push('Projet')
  headerCols.push('Date')

  const rows = feedbacks.map((fb) => {
    const cols = [
      fb.rating.toString(),
      fb.comment ? `"${fb.comment.replace(/"/g, '""')}"` : '',
    ]
    if (hasFirstName) cols.push(fb.firstName ? `"${fb.firstName}"` : '')
    if (hasLastName) cols.push(fb.lastName ? `"${fb.lastName}"` : '')
    if (hasProjects) cols.push(fb.project ? `"${fb.project.name}"` : '')
    cols.push(new Date(fb.createdAt).toLocaleDateString('fr-FR'))
    return cols.join(',')
  })

  const csv = [headerCols.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="feedbacks-${profile.slug}.csv"`,
    },
  })
}
