import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Bundle pricing in cents
export const BUNDLES = {
  1: { price: 3495, label: '1 Lighter', saving: 0 },
  2: { price: 5995, label: '2 Lighters', saving: 995 },
  3: { price: 7995, label: '3 Lighters', saving: 2490 },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { qty = 1 } = req.body
  const bundle = BUNDLES[qty] || { price: BUNDLES[1].price * qty, label: `${qty} Lighters`, saving: 0 }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: bundle.price,
      currency: 'aud',
      automatic_payment_methods: { enabled: true },
      metadata: {
        product: 'ArcLit Plasma Lighter',
        qty: String(qty),
        bundle_label: bundle.label,
      },
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
