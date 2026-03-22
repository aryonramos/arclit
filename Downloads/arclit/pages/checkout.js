import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

const BUNDLES = {
  1: { price: 34.95, label: '1 Lighter' },
  2: { price: 59.95, label: '2 Lighters' },
  3: { price: 79.95, label: '3 Lighters' },
}

export default function Checkout() {
  const router = useRouter()
  const qty = parseInt(router.query.qty) || 1
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!router.isReady) return
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
    })
      .then(r => r.json())
      .then(data => {
        setClientSecret(data.clientSecret)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Track checkout page view
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'checkout_view', qty })
    }).catch(() => {})
  }, [router.isReady, qty])

  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#4fc3f7',
      colorBackground: '#111111',
      colorText: '#f5f5f5',
      colorDanger: '#ff6b6b',
      fontFamily: 'DM Sans, sans-serif',
      borderRadius: '4px',
      spacingUnit: '4px',
    },
    rules: {
      '.Input': { border: '1px solid #2a2a2a', backgroundColor: '#0d0d0d' },
      '.Input:focus': { border: '1px solid #4fc3f7', boxShadow: '0 0 0 2px rgba(79,195,247,0.1)' },
      '.Label': { color: '#888', fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase' },
    }
  }

  const bundle = BUNDLES[qty] || BUNDLES[1]
  const total = bundle.price.toFixed(2)

  return (
    <>
      <Head>
        <title>Checkout — ArcLit</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f5', fontFamily: 'DM Sans, sans-serif' }}>
        {/* Top bar */}
        <div style={{
          borderBottom: '1px solid #1e1e1e', padding: '0 24px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
            ARC<span style={{ color: '#4fc3f7' }}>LIT</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#888' }}>
            <span style={{ color: '#4fc3f7' }}>🔒</span> Secure checkout powered by Stripe
          </div>
        </div>

        <div style={{
          maxWidth: '980px', margin: '0 auto', padding: '48px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '48px',
        }}>
          {/* Order summary */}
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '32px', letterSpacing: '-0.5px' }}>
              Order summary
            </h2>

            {/* Product line */}
            <div style={{
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px',
              display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px',
            }}>
              {/* Mini product image */}
              <div style={{
                width: '64px', height: '64px', background: '#1a1a1a', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: '1px solid #2a2a2a',
              }}>
                <svg viewBox="0 0 60 60" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
                  <rect x="20" y="12" width="20" height="36" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1"/>
                  <rect x="20" y="8" width="20" height="8" rx="3" fill="#222" stroke="#333" strokeWidth="0.5"/>
                  <path d="M27 11 Q30 8 33 11" stroke="#4fc3f7" strokeWidth="1.5" fill="none" strokeLinecap="round">
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite"/>
                  </path>
                  <ellipse cx="30" cy="11" rx="5" ry="3" fill="rgba(79,195,247,0.2)">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.4s" repeatCount="indefinite"/>
                  </ellipse>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: '15px', marginBottom: '4px' }}>ArcLit Plasma Lighter</p>
                <p style={{ fontSize: '13px', color: '#888' }}>{bundle.label}</p>
              </div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: '#4fc3f7' }}>
                ${bundle.price.toFixed(2)}
              </p>
            </div>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#888' }}>
                <span>Subtotal ({bundle.label})</span>
                <span>${bundle.price.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#888' }}>
                <span>Shipping</span>
                <span style={{ color: '#4fc3f7' }}>Free</span>
              </div>
              <div style={{ height: '1px', background: '#2a2a2a' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ color: '#4fc3f7', fontFamily: 'Syne, sans-serif', fontWeight: 800 }}>${total} AUD</span>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{
              background: '#111', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
              {['🔒 256-bit SSL encryption', '📦 Free shipping Australia-wide', '↩ 14-day money back guarantee', '⚡ Ships within 1–2 business days'].map(t => (
                <div key={t} style={{ fontSize: '13px', color: '#888' }}>{t}</div>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '32px', letterSpacing: '-0.5px' }}>
              Payment
            </h2>

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#888', fontSize: '14px', padding: '40px 0' }}>
                <div style={{
                  width: '20px', height: '20px', border: '2px solid #2a2a2a',
                  borderTopColor: '#4fc3f7', borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Preparing secure checkout...
              </div>
            )}

            {!loading && clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                <CheckoutForm qty={qty} total={total} />
              </Elements>
            )}

            {!loading && !clientSecret && (
              <div style={{ background: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: '8px', padding: '20px', fontSize: '14px', color: '#ff6b6b' }}>
                Unable to load checkout. Please refresh the page or contact support.
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  )
}

function CheckoutForm({ qty, total }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [address, setAddress] = useState({ line1: '', city: '', state: '', postcode: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: { name, email },
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #2a2a2a',
    borderRadius: '4px', padding: '12px 14px', color: '#f5f5f5',
    fontFamily: 'DM Sans, sans-serif', fontSize: '15px', outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle = { fontSize: '11px', color: '#888', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }

  return (
    <form onSubmit={handleSubmit}>
      {/* Contact */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontWeight: 500, fontSize: '14px', color: '#ccc', marginBottom: '14px' }}>Contact</p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="you@email.com" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4fc3f7'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>
          <div>
            <label style={labelStyle}>Full name</label>
            <input value={name} onChange={e => setName(e.target.value)} type="text" required placeholder="Your name" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4fc3f7'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontWeight: 500, fontSize: '14px', color: '#ccc', marginBottom: '14px' }}>Shipping address</p>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={labelStyle}>Street address</label>
            <input value={address.line1} onChange={e => setAddress(a => ({ ...a, line1: e.target.value }))} type="text" required placeholder="123 Main St" style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#4fc3f7'}
              onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>City</label>
              <input value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} type="text" required placeholder="Sydney" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4fc3f7'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
            </div>
            <div>
              <label style={labelStyle}>State</label>
              <input value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} type="text" required placeholder="NSW" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4fc3f7'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
            </div>
            <div>
              <label style={labelStyle}>Postcode</label>
              <input value={address.postcode} onChange={e => setAddress(a => ({ ...a, postcode: e.target.value }))} type="text" required placeholder="2000" style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4fc3f7'}
                onBlur={e => e.target.style.borderColor = '#2a2a2a'} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input value="Australia" disabled style={{ ...inputStyle, color: '#666', cursor: 'not-allowed' }} />
          </div>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontWeight: 500, fontSize: '14px', color: '#ccc', marginBottom: '14px' }}>Payment details</p>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {error && (
        <div style={{ background: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: '6px', padding: '12px 16px', fontSize: '14px', color: '#ff6b6b', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={!stripe || loading} style={{
        width: '100%', background: loading ? '#2a4a5a' : '#4fc3f7',
        color: '#000', border: 'none', padding: '16px',
        borderRadius: '4px', fontFamily: 'Syne, sans-serif',
        fontWeight: 700, fontSize: '15px', letterSpacing: '1px',
        textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
      }}>
        {loading ? (
          <>
            <div style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Processing...
          </>
        ) : (
          `Pay $${total} AUD`
        )}
      </button>

      <p style={{ fontSize: '11px', color: '#555', textAlign: 'center', marginTop: '16px' }}>
        Your payment is processed securely by Stripe. ArcLit never stores your card details.
      </p>
    </form>
  )
}
