import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useEffect, useState, useRef } from 'react'

const PRICE = 34.95
const STOCK_COUNT = 23

export default function Home() {
  const [qty, setQty] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [countdown, setCountdown] = useState({ hours: 5, mins: 47, secs: 13 })
  const productRef = useRef(null)

  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view', page: 'home',
        referrer: document.referrer,
        utm_source: new URLSearchParams(window.location.search).get('utm_source') || '',
        utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || '',
      })
    }).catch(() => {})
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 5; mins = 59; secs = 59 }
        return { hours, mins, secs }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Show sticky bar once buy buttons scroll out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (productRef.current) observer.observe(productRef.current)
    return () => observer.disconnect()
  }, [])

  function handleAddToCart() {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'add_to_cart', qty })
    }).catch(() => {})
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const pad = n => String(n).padStart(2, '0')

  const imageLabels = ['Front', 'Arc firing', 'In hand', 'USB-C']

  const features = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      title: 'Plasma arc technology',
      desc: 'Electric arc instead of gas — windproof, refillable, and cleaner than any traditional lighter.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12H19"/><path d="M12 5v14"/><circle cx="12" cy="12" r="9"/></svg>,
      title: 'USB rechargeable',
      desc: 'Built-in battery charges via USB-C. One charge lasts up to 300 ignitions.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 10 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>,
      title: 'Windproof by design',
      desc: 'No flame means no wind resistance. Works outdoors, at the beach, camping — anywhere.'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      title: 'Premium finish',
      desc: 'Compact matte aluminium casing. Fits in any pocket. Looks expensive without the price tag.'
    },
  ]

  const faqs = [
    { q: 'How does a plasma arc lighter actually work?', a: 'Instead of burning gas, it creates a high-voltage electric arc between two electrodes. The arc is hot enough to ignite candles, incense, paper, and more — without any flame or fuel.' },
    { q: 'How long does the battery last?', a: 'A full charge via USB-C gives you approximately 200–300 ignitions. A full charge takes about 1 hour.' },
    { q: 'Is it safe?', a: 'Yes. The arc only activates when the lid is open and the button is held. There is no open flame and no flammable gas stored inside.' },
    { q: 'How long does shipping take?', a: 'Standard delivery is 5–10 business days within Australia. Tracking is provided for every order.' },
    { q: 'What is your refund policy?', a: 'If your ArcLit arrives damaged or faulty, we will replace it or issue a full refund. Contact us within 14 days of delivery.' },
  ]

  return (
    <>
      <Head>
        <title>ArcLit — The Electric Arc Lighter</title>
        <meta name="description" content="Windproof. USB rechargeable. No gas. The ArcLit plasma lighter is the last lighter you'll ever need." />
        <meta property="og:title" content="ArcLit — The Electric Arc Lighter" />
        <meta property="og:description" content="Windproof USB plasma lighter. No gas, no flame, no compromise." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* ── STICKY BUY BAR ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(8,8,8,0.97)', borderTop: '1px solid #2a2a2a',
        backdropFilter: 'blur(12px)', padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        transform: showStickyBar ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>ArcLit Plasma Lighter</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--arc)' }}>${PRICE} AUD</div>
        </div>
        <Link href={`/checkout?qty=1`} style={{
          background: 'var(--arc)', color: '#000',
          padding: '13px 28px', borderRadius: '4px',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          Buy Now
        </Link>
      </div>

      <main style={{ paddingTop: '64px' }}>

        {/* ── HERO ── */}
        <section style={{
          minHeight: '92vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '80px 24px 60px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, rgba(79,195,247,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(79,195,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px', pointerEvents: 'none',
          }} />

          <div className="fade-up" style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(79,195,247,0.08)', border: '1px solid rgba(79,195,247,0.2)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '32px',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--arc)', display: 'inline-block', animation: 'pulse-arc 2s infinite' }} />
              <span style={{ fontSize: '12px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>USB Plasma Technology</span>
            </div>
          </div>

          <h1 className="fade-up-1" style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(48px, 9vw, 96px)',
            fontWeight: 800, lineHeight: 1.0, letterSpacing: '-3px', marginBottom: '24px',
          }}>
            The last lighter<br />
            <span style={{ color: 'var(--arc)', animation: 'flicker 8s infinite' }}>you'll ever buy.</span>
          </h1>

          <p className="fade-up-2" style={{
            fontSize: 'clamp(15px, 2.5vw, 20px)', color: 'var(--muted)',
            maxWidth: '520px', marginBottom: '48px', lineHeight: 1.7,
          }}>
            No gas. No flame. Just a clean electric arc that lights anything — in any weather, anywhere.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/checkout" style={{
              background: 'var(--arc)', color: '#000',
              padding: '16px 36px', borderRadius: '4px',
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase',
              animation: 'pulse-arc 3s infinite', display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(79,195,247,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
              Get ArcLit — ${PRICE}
            </Link>
            <Link href="/#how-it-works" style={{
              border: '1px solid var(--border)', color: 'var(--muted)',
              padding: '16px 28px', borderRadius: '4px',
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: '15px', letterSpacing: '0.5px', display: 'inline-block',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--arc)'; e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
              See how it works
            </Link>
          </div>

          <div className="fade-up-4" style={{
            display: 'flex', gap: '24px', marginTop: '56px',
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {['Free shipping Australia', 'USB rechargeable', '14-day guarantee'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--muted)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* ── PRODUCT SECTION ── */}
        <section id="product" style={{
          padding: '80px 24px',
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '56px', alignItems: 'start',
        }}>
          {/* Image gallery */}
          <div>
            <div style={{
              background: '#0d0d0d', border: '1px solid var(--border)', borderRadius: '16px',
              aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', marginBottom: '12px', position: 'relative',
              animation: 'pulse-arc 4s infinite',
            }}>
              <ProductSVG type={activeImage} />
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--arc)', color: '#000',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '11px', padding: '5px 12px', borderRadius: '4px', letterSpacing: '0.5px',
              }}>NEW</div>
            </div>
            {/* Thumbnails */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {imageLabels.map((label, i) => (
                <button key={i} onClick={() => setActiveImage(i)} style={{
                  background: i === activeImage ? 'rgba(79,195,247,0.08)' : 'var(--surface)',
                  border: `1px solid ${i === activeImage ? 'var(--arc)' : 'var(--border)'}`,
                  borderRadius: '8px', aspectRatio: '1', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '4px', transition: 'all 0.2s', padding: '6px',
                }}>
                  <ThumbIcon type={i} active={i === activeImage} />
                  <span style={{ fontSize: '9px', color: i === activeImage ? 'var(--arc)' : 'var(--muted)', letterSpacing: '0.3px' }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div>
            <p style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              ArcLit Plasma Lighter
            </p>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(30px, 5vw, 48px)', lineHeight: 1.1,
              letterSpacing: '-1.5px', marginBottom: '16px',
            }}>
              Electric arc.<br />Zero gas.
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '24px', fontSize: '15px' }}>
              The ArcLit uses high-voltage plasma technology to create a flameless electric arc. Windproof, rechargeable via USB-C, and built to last. Light candles, incense, BBQs, and more — no refills, ever.
            </p>

            {/* Countdown */}
            <div style={{
              background: 'rgba(79,195,247,0.05)', border: '1px solid rgba(79,195,247,0.2)',
              borderRadius: '8px', padding: '12px 16px', marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Sale ends in
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[
                  { val: pad(countdown.hours), label: 'HRS' },
                  { val: pad(countdown.mins), label: 'MIN' },
                  { val: pad(countdown.secs), label: 'SEC' },
                ].map((t, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ background: 'var(--surface2)', borderRadius: '5px', padding: '5px 8px', textAlign: 'center', minWidth: '40px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--arc)', lineHeight: 1 }}>{t.val}</div>
                      <div style={{ fontSize: '8px', color: 'var(--muted)', letterSpacing: '1px', marginTop: '2px' }}>{t.label}</div>
                    </div>
                    {i < 2 && <span style={{ color: 'var(--arc)', fontWeight: 700, fontSize: '16px' }}>:</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Stock scarcity bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} style={{
                    width: '16px', height: '5px', borderRadius: '3px',
                    background: i < 3 ? '#222' : 'var(--arc)',
                    opacity: i < 3 ? 0.5 : 1,
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Only <span style={{ color: 'var(--white)', fontWeight: 600 }}>{STOCK_COUNT} left</span> in stock
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '38px', color: 'var(--arc)' }}>${PRICE}</span>
              <span style={{ fontSize: '14px', color: 'var(--muted)', textDecoration: 'line-through' }}>$59.95</span>
              <span style={{ background: 'rgba(79,195,247,0.1)', color: 'var(--arc)', fontSize: '11px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>42% OFF</span>
            </div>

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Qty</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'var(--surface)', border: 'none', color: 'var(--white)', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer' }}>−</button>
                <span style={{ padding: '0 20px', fontSize: '15px', fontWeight: 500, background: 'var(--black)' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--white)', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* CTA buttons - observed for sticky bar */}
            <div ref={productRef} style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button onClick={handleAddToCart} style={{
                flex: 1, minWidth: '130px',
                background: addedToCart ? 'rgba(79,195,247,0.12)' : 'var(--surface)',
                border: `1px solid ${addedToCart ? 'var(--arc)' : 'var(--border)'}`,
                color: addedToCart ? 'var(--arc)' : 'var(--white)',
                padding: '14px 16px', borderRadius: '4px',
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: '13px', letterSpacing: '0.5px', transition: 'all 0.3s', cursor: 'pointer',
              }}>
                {addedToCart ? '✓ Added' : 'Add to cart'}
              </button>
              <Link href={`/checkout?qty=${qty}`} style={{
                flex: 2, minWidth: '150px',
                background: 'var(--arc)', color: '#000',
                padding: '14px 16px', borderRadius: '4px',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase',
                textAlign: 'center', display: 'inline-block',
              }}>
                Buy Now
              </Link>
            </div>

            {/* Trust badges — no emojis */}
            <div style={{
              display: 'flex', gap: '16px', flexWrap: 'wrap',
              padding: '14px 16px', background: 'var(--surface)',
              borderRadius: '8px', border: '1px solid var(--border)',
            }}>
              {['Secure checkout', 'Free shipping AUS', '14-day guarantee'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--muted)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" style={{
          padding: '100px 24px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>The technology</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1.5px', marginBottom: '56px' }}>How it works</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2px' }}>
              {[
                { step: '01', title: 'Open the lid', desc: 'Flip the lid open to expose the arc electrodes and activate the device.' },
                { step: '02', title: 'Press and hold', desc: 'Hold the button. High-voltage electricity bridges the two electrodes.' },
                { step: '03', title: 'Arc ignites', desc: 'A superheated plasma arc appears instantly — no gas, no flame.' },
                { step: '04', title: 'Light anything', desc: 'Touch the arc to candles, incense, BBQs, paper. Works in any wind.' },
              ].map((s, i) => (
                <div key={i} style={{
                  padding: '28px 20px', background: 'var(--black)',
                  border: '1px solid var(--border)', textAlign: 'left',
                  borderRadius: i === 0 ? '12px 0 0 12px' : i === 3 ? '0 12px 12px 0' : '0',
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '36px', color: 'var(--arc)', opacity: 0.25, marginBottom: '14px', lineHeight: 1 }}>{s.step}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', marginBottom: '8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: '100px 24px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Why ArcLit</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1.5px' }}>Built different</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '12px', padding: '24px', transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ marginBottom: '14px' }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section style={{
          padding: '100px 24px',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <p style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Reviews</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1.5px' }}>What people are saying</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Jake M.', stars: 5, text: "Seen these on TikTok and finally ordered. Genuinely one of the coolest things I own. Show it to everyone." },
                { name: 'Callum R.', stars: 5, text: "Used a gas lighter for 10 years. Never going back. The arc is so satisfying and it works in any wind." },
                { name: 'Tom S.', stars: 5, text: "Ordered for camping, now I use it every day. Charging it once a month is all it takes. Insane value." },
              ].map((r, i) => (
                <div key={i} style={{ background: 'var(--black)', border: '1px solid var(--border)', borderRadius: '12px', padding: '22px' }}>
                  <div style={{ color: 'var(--arc)', fontSize: '14px', marginBottom: '10px', letterSpacing: '2px' }}>{'★'.repeat(r.stars)}</div>
                  <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '14px' }}>"{r.text}"</p>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)' }}>{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: '100px 24px', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '11px', color: 'var(--arc)', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 48px)', letterSpacing: '-1.5px' }}>Common questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ padding: '100px 24px', textAlign: 'center', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 'clamp(32px, 7vw, 72px)', letterSpacing: '-2px',
            lineHeight: 1.05, marginBottom: '20px',
          }}>
            Stop buying gas.<br />
            <span style={{ color: 'var(--arc)' }}>Start using arc.</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '17px', marginBottom: '36px' }}>
            ${PRICE} AUD · Free shipping · 14-day guarantee
          </p>
          <Link href="/checkout" style={{
            background: 'var(--arc)', color: '#000',
            padding: '18px 52px', borderRadius: '4px',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase',
            display: 'inline-block', animation: 'pulse-arc 3s infinite',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(79,195,247,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}>
            Get ArcLit Now
          </Link>
        </section>
      </main>

      <Footer />
      <div style={{ height: '80px' }} />
    </>
  )
}

function ProductSVG({ type }) {
  if (type === 1) return (
    <svg viewBox="0 0 300 300" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="200" rx="60" ry="16" fill="rgba(79,195,247,0.08)" />
      <rect x="115" y="80" width="70" height="140" rx="12" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
      <rect x="115" y="62" width="70" height="26" rx="7" fill="#222" stroke="#2a2a2a" strokeWidth="1"/>
      <rect x="138" y="66" width="5" height="14" rx="2.5" fill="#333"/>
      <rect x="157" y="66" width="5" height="14" rx="2.5" fill="#333"/>
      <path d="M143 70 Q150 62 157 70" stroke="#4fc3f7" strokeWidth="3" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0.2;1" dur="0.3s" repeatCount="indefinite"/>
      </path>
      <path d="M143 74 Q150 66 157 74" stroke="#81d4fa" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="0.3s" begin="0.1s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="150" cy="70" rx="22" ry="13" fill="rgba(79,195,247,0.3)">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.3s" repeatCount="indefinite"/>
      </ellipse>
      <ellipse cx="150" cy="70" rx="40" ry="25" fill="rgba(79,195,247,0.12)">
        <animate attributeName="opacity" values="0.8;0.1;0.8" dur="0.3s" repeatCount="indefinite"/>
      </ellipse>
      <text x="150" y="148" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill="#4fc3f7" letterSpacing="2">ARCLIT</text>
    </svg>
  )
  if (type === 2) return (
    <svg viewBox="0 0 300 300" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 220 Q105 185 120 170 Q132 162 145 165 L155 165 Q168 162 180 170 Q195 185 200 220 Z" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M122 165 L122 145 Q122 139 128 139 Q134 139 134 145 L134 165" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M134 165 L134 138 Q134 132 140 132 Q146 132 146 138 L146 165" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M146 165 L146 140 Q146 134 152 134 Q158 134 158 140 L158 165" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M158 165 L158 143 Q158 137 164 137 Q170 137 170 143 L170 165" fill="#111" stroke="#2a2a2a" strokeWidth="1"/>
      <rect x="118" y="88" width="64" height="82" rx="10" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
      <rect x="118" y="72" width="64" height="22" rx="7" fill="#222" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M136 79 Q150 71 164 79" stroke="#4fc3f7" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="150" cy="77" rx="18" ry="10" fill="rgba(79,195,247,0.2)">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.4s" repeatCount="indefinite"/>
      </ellipse>
      <text x="150" y="132" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#4fc3f7" letterSpacing="2">ARCLIT</text>
    </svg>
  )
  if (type === 3) return (
    <svg viewBox="0 0 300 300" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect x="118" y="88" width="64" height="120" rx="10" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
      <rect x="118" y="72" width="64" height="22" rx="7" fill="#222" stroke="#2a2a2a" strokeWidth="1"/>
      <path d="M136 79 Q150 71 164 79" stroke="#4fc3f7" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4"/>
      <text x="150" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#4fc3f7" letterSpacing="2">ARCLIT</text>
      <rect x="136" y="202" width="28" height="8" rx="4" fill="#111" stroke="#4fc3f7" strokeWidth="1.5"/>
      <path d="M150 210 Q150 228 175 235 Q200 242 210 228" stroke="#4fc3f7" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="4 3">
        <animate attributeName="strokeDashoffset" values="0;-14" dur="1s" repeatCount="indefinite"/>
      </path>
      <circle cx="210" cy="228" r="7" fill="#1a1a1a" stroke="#4fc3f7" strokeWidth="1.5"/>
      <text x="150" y="265" textAnchor="middle" fontFamily="sans-serif" fontSize="10" fill="#888">USB-C charging</text>
    </svg>
  )
  // Default: front view
  return (
    <svg viewBox="0 0 300 300" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="150" cy="205" rx="65" ry="16" fill="rgba(79,195,247,0.08)" />
      <rect x="118" y="90" width="64" height="120" rx="11" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1.5"/>
      <rect x="118" y="72" width="64" height="24" rx="7" fill="#222" stroke="#2a2a2a" strokeWidth="1"/>
      <rect x="136" y="77" width="4.5" height="12" rx="2" fill="#444"/>
      <rect x="159" y="77" width="4.5" height="12" rx="2" fill="#444"/>
      <path d="M140 80 Q150 73 160 80" stroke="#4fc3f7" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <animate attributeName="opacity" values="1;0.3;1" dur="0.4s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="150" cy="78" rx="16" ry="9" fill="rgba(79,195,247,0.15)">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.4s" repeatCount="indefinite"/>
      </ellipse>
      <rect x="130" y="150" width="40" height="22" rx="5" fill="#222" stroke="#333" strokeWidth="1"/>
      <rect x="140" y="155" width="20" height="12" rx="2.5" fill="#1a1a1a"/>
      <rect x="136" y="207" width="28" height="7" rx="3.5" fill="#111" stroke="#333" strokeWidth="1"/>
      <text x="150" y="130" textAnchor="middle" fontFamily="sans-serif" fontSize="9" fontWeight="700" fill="#4fc3f7" letterSpacing="2">ARCLIT</text>
      <rect x="121" y="93" width="3" height="60" rx="1.5" fill="rgba(255,255,255,0.03)"/>
    </svg>
  )
}

function ThumbIcon({ type, active }) {
  const c = active ? '#4fc3f7' : '#666'
  if (type === 0) return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="8" y="2" width="8" height="20" rx="3"/></svg>
  if (type === 1) return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  if (type === 2) return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M18 11V6a2 2 0 0 0-4 0v0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8l-1.4-1.4a2 2 0 0 0-2.83 2.82L7 20"/></svg>
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 22V8M5 12H2a10 10 0 0 0 20 0h-3"/><path d="M12 2v3"/></svg>
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: open ? 'var(--surface)' : 'transparent',
      border: '1px solid var(--border)', borderRadius: '8px',
      overflow: 'hidden', transition: 'background 0.2s',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', background: 'none', border: 'none', color: 'var(--white)',
        padding: '18px 22px', textAlign: 'left',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 500, cursor: 'pointer',
      }}>
        <span style={{ paddingRight: '16px' }}>{q}</span>
        <span style={{ color: 'var(--arc)', fontSize: '20px', transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 22px 18px', fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8 }}>{a}</div>
      )}
    </div>
  )
}
