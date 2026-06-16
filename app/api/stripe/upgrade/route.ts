import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await prisma.user.findUnique({ where: { email: user.email! } })
  if (!profile?.stripeCustomerId || profile.plan !== 'PRO') {
    redirect('/dashboard/settings')
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: profile.stripeCustomerId,
    status: 'active',
    limit: 1,
  })

  const subscription = subscriptions.data[0]
  if (!subscription) redirect('/dashboard/settings')

  await stripe.subscriptions.update(subscription.id, {
    items: [{
      id: subscription.items.data[0].id,
      price: PLANS.BUSINESS.priceId,
    }],
    proration_behavior: 'create_prorations',
  })

  await prisma.user.update({
    where: { id: profile.id },
    data: {
      plan: 'BUSINESS',
      projectLimit: PLANS.BUSINESS.projectLimit,
    },
  })

  redirect('/dashboard/settings?upgraded=true')
}
