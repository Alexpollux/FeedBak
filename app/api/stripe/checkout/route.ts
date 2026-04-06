import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { stripe, PLANS } from '@/lib/stripe'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) redirect('/dashboard')

  if (profile.plan === 'PRO') redirect('/dashboard/settings')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // Crée ou récupère le customer Stripe
  let customerId = profile.stripeCustomerId ?? undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile.email,
      name: profile.name ?? undefined,
      metadata: { userId: profile.id },
    })
    customerId = customer.id
    await prisma.user.update({
      where: { id: profile.id },
      data: { stripeCustomerId: customerId },
    })
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PLANS.PRO.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?success=true`,
    cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
    metadata: { userId: profile.id },
  })

  redirect(session.url!)
}
