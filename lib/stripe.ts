import 'server-only'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

export const PLANS = {
  PRO: {
    name: 'Pro',
    price: 15,
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    projectLimit: 5,
  },
  BUSINESS: {
    name: 'Business',
    price: 30,
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS!,
    projectLimit: 20,
  },
}

export type PlanKey = keyof typeof PLANS
