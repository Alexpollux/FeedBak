import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/dashboard/redirect
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  const body = await request.json()
  const { redirectUrl } = body

  // Validation basique de l'URL
  if (redirectUrl && redirectUrl.trim().length > 0) {
    try {
      const url = new URL(redirectUrl.trim())
      if (!['http:', 'https:'].includes(url.protocol)) {
        return NextResponse.json({ error: 'URL invalide (http/https uniquement).' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'URL invalide.' }, { status: 400 })
    }
  }

  await prisma.user.update({
    where: { id: profile.id },
    data: { redirectUrl: redirectUrl?.trim() || null },
  })

  return NextResponse.json({ success: true })
}
