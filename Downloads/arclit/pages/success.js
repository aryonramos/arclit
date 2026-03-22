import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Success() {
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'purchase_complete' })
    }).catch(() => {})
  }, [])

  return (
    <>
      <Head>
        <title>Order Confirmed — ArcLit</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh', background: '#080808', color: '#f5f5f5',
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '40px 24px',
      }}>
        {/* Arc animation */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(79,195,247,0.1)', border: '1px solid rgba(79,195,247,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '32px', fontSize: '36px',
          animation: 'pulse-arc 2s infinite',
        }}>
          ⚡
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(36px, 6vw, 56px)', letterSpacing: '-2px',
          marginBottom: '16px',
        }}>
          Order confirmed.
        </h1>
        <p style={{ fontSize: '18px', color: '#888', marginBottom: '8px' }}>
          Your ArcLit is on its way.
        </p>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '48px', maxWidth: '400px' }}>
          You'll receive a confirmation email shortly. Delivery typically takes 5–10 business days within Australia.
        </p>

        <div style={{
          background: '#111', border: '1px solid #2a2a2a', borderRadius: '12px',
          padding: '24px 32px', marginBottom: '40px', maxWidth: '420px', width: '100%',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Order received and confirmed', 'Payment processed securely', 'Dispatched within 1–2 business days', 'Tracking email on the way'].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <span style={{ color: '#4fc3f7', fontWeight: 700 }}>✓</span>
                <span style={{ color: i < 2 ? '#f5f5f5' : '#666' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <Link href="/" style={{
          background: '#4fc3f7', color: '#000',
          padding: '14px 40px', borderRadius: '4px',
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase',
        }}>
          Back to ArcLit
        </Link>

        <style>{`
          @keyframes pulse-arc {
            0%, 100% { box-shadow: 0 0 20px rgba(79,195,247,0.15); }
            50% { box-shadow: 0 0 40px rgba(79,195,247,0.3); }
          }
        `}</style>
      </div>
    </>
  )
}
