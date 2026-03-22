import Stripe from 'stripe'
import { buffer } from 'micro'
import { recordEvent } from '../../lib/analytics'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sig = req.headers['stripe-signature']
  const buf = await buffer(req)

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    await recordEvent({
      event: 'order_complete',
      amount: pi.amount / 100,
      qty: parseInt(pi.metadata.qty || '1'),
      currency: pi.currency,
    })
  }

  res.json({ received: true })
}
