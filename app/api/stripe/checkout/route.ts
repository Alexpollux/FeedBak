import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile) redirect('/dashboard')

  if (profile.plan !== 'FREE') redirect('/dashboard/settings')

  // Récupérer le plan demandé (pro ou business), défaut : pro
  const { searchParams } = new URL(request.url)
  const planParam = (searchParams.get('plan') ?? 'pro').toUpperCase() as PlanKey
  const plan = PLANS[planParam] ?? PLANS.PRO

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
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?success=true`,
    cancel_url: `${appUrl}/dashboard/settings?canceled=true`,
    metadata: { userId: profile.id, plan: planParam },
  })

  redirect(session.url!)
}
