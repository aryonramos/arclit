import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

const policies = {
  privacy: {
    title: 'Privacy Policy',
    content: `
**Last updated:** ${new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}

ArcLit ("we", "our", "us") is committed to protecting your privacy. This policy explains how we collect, use, and store your information.

**Information we collect**

When you place an order, we collect your name, email address, shipping address, and payment information. Payment details are processed and stored securely by Stripe — we never store your card details.

We also collect anonymised website analytics including page views, referral sources, and purchase events to help us improve our store.

**How we use your information**

We use your information to fulfil your order, send order confirmations and shipping updates, and improve our website experience. We do not sell your data to third parties.

**Cookies**

We use essential cookies for checkout functionality. We may use analytics cookies to understand traffic. You can disable cookies in your browser settings.

**Contact**

For privacy enquiries, contact us at hello@arclit.com.au
    `
  },
  refunds: {
    title: 'Refund Policy',
    content: `
**Our guarantee**

We want you to love your ArcLit. If your product arrives damaged, faulty, or not as described, we will replace it or issue a full refund — no questions asked.

**Eligibility**

To be eligible for a refund or replacement:
- Contact us within 14 days of receiving your order
- Provide your order number and a brief description of the issue
- Photos of the fault may be requested

**Change of mind**

We currently do not accept change-of-mind returns. Please read the product description carefully before purchasing.

**Refund timeline**

Once approved, refunds are processed within 3–5 business days to your original payment method.

**Contact**

Email us at hello@arclit.com.au with subject line "Refund Request – [Order Number]"
    `
  },
  shipping: {
    title: 'Shipping Policy',
    content: `
**Where we ship**

We currently ship within Australia only.

**Shipping cost**

Free standard shipping on all orders, Australia-wide.

**Processing time**

Orders are processed and dispatched within 1–2 business days of payment confirmation.

**Delivery timeframes**

Standard delivery: 5–10 business days after dispatch.

Please note that delivery times may vary depending on your location and during peak periods (e.g. Christmas).

**Tracking**

A tracking number will be emailed to you once your order has been dispatched.

**Lost or delayed parcels**

If your parcel has not arrived within 15 business days of dispatch, please contact us at hello@arclit.com.au and we will investigate with our shipping partner.
    `
  },
  terms: {
    title: 'Terms of Service',
    content: `
**Agreement**

By accessing or purchasing from ArcLit (arclit.com.au), you agree to these Terms of Service.

**Products**

We reserve the right to modify product descriptions, prices, and availability at any time without notice. Images are for illustrative purposes.

**Orders**

All orders are subject to availability and confirmation. We reserve the right to cancel any order at our discretion and will issue a full refund if this occurs.

**Pricing**

All prices are in Australian Dollars (AUD) and are inclusive of GST where applicable.

**Limitation of liability**

ArcLit shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website.

**Governing law**

These terms are governed by the laws of Australia.

**Contact**

For any enquiries, contact hello@arclit.com.au
    `
  }
}

export default function Policy() {
  const router = useRouter()
  const { slug } = router.query
  const policy = policies[slug]

  if (!policy) return null

  return (
    <>
      <Head>
        <title>{policy.title} — ArcLit</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ borderBottom: '1px solid #1e1e1e', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px' }}>
            ARC<span style={{ color: '#4fc3f7' }}>LIT</span>
          </Link>
        </div>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '60px 24px' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-1px', marginBottom: '40px' }}>
            {policy.title}
          </h1>
          <div style={{ fontSize: '15px', lineHeight: 1.9, color: '#ccc' }}>
            {policy.content.trim().split('\n').map((line, i) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h2 key={i} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#f5f5f5', marginTop: '32px', marginBottom: '12px' }}>{line.replace(/\*\*/g, '')}</h2>
              }
              if (line.startsWith('- ')) {
                return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px' }}>{line.slice(2)}</li>
              }
              if (line.trim() === '') return <br key={i} />
              return <p key={i} style={{ marginBottom: '12px' }}>{line}</p>
            })}
          </div>
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #1e1e1e' }}>
            <Link href="/" style={{ fontSize: '14px', color: '#4fc3f7' }}>← Back to ArcLit</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(policies).map(slug => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  return { props: {} }
}
