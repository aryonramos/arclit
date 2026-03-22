import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICE_AUD = 3495 // $34.95 in cents

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { qty = 1 } = req.body

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PRICE_AUD * qty,
      currency: 'aud',
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: 'ArcLit Plasma Lighter',
        qty: String(qty),
      },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
