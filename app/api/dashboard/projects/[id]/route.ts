import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/dashboard/projects/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const { id } = await params

  // Vérifier que le projet appartient bien à cet utilisateur
  const project = await prisma.project.findFirst({
    where: { id, userId: profile.id },
  })
  if (!project) return NextResponse.json({ error: 'Projet introuvable' }, { status: 404 })

  await prisma.project.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
