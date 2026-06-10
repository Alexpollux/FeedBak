import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/dashboard/settings — mettre à jour enableFirstName / enableLastName
export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })

  if (profile.plan === 'FREE') {
    return NextResponse.json({ error: 'Fonctionnalité réservée aux plans Pro et Business.' }, { status: 403 })
  }

  const body = await request.json()
  const { enableFirstName, enableLastName } = body

  const updated = await prisma.user.update({
    where: { id: profile.id },
    data: {
      enableFirstName: typeof enableFirstName === 'boolean' ? enableFirstName : undefined,
      enableLastName: typeof enableLastName === 'boolean' ? enableLastName : undefined,
    },
  })

  return NextResponse.json({ enableFirstName: updated.enableFirstName, enableLastName: updated.enableLastName })
}
