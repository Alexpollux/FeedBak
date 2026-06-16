import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/projects — liste des projets
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { projects: { orderBy: { order: 'asc' } } },
  })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  return NextResponse.json(profile.projects)
}

// POST /api/dashboard/projects — créer un projet
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { projects: true },
  })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  if (profile.projects.length >= profile.projectLimit) {
    return NextResponse.json(
      { error: `Limite atteinte (${profile.projectLimit} projets max sur votre plan).` },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { name } = body

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Nom de projet invalide.' }, { status: 400 })
  }

  if (name.trim().length > 80) {
    return NextResponse.json({ error: 'Nom de projet trop long (80 caractères max).' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      userId: profile.id,
      name: name.trim(),
      order: profile.projects.length,
    },
  })

  return NextResponse.json(project)
}
