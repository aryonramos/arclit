import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px',
        background: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e1e1e',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', flexShrink: 0 }}>
          ARC<span style={{ color: 'var(--arc)' }}>LIT</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          <Link href="/#product" style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
            Product
          </Link>
          <Link href="/#how-it-works" style={{ fontSize: '14px', color: 'var(--muted)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--white)'}
            onMouseLeave={e => e.target.style.color = 'var(--muted)'}>
            How it works
          </Link>
          <Link href="/checkout" style={{
            fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)',
            background: 'var(--arc)', color: '#000',
            padding: '8px 20px', borderRadius: '4px',
            letterSpacing: '0.5px', textTransform: 'uppercase',
          }}>
            Buy Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="mobile-nav-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', display: 'none', flexDirection: 'column',
            gap: '5px', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: menuOpen ? 'var(--arc)' : 'var(--white)',
            borderRadius: '2px',
            transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            transition: 'all 0.25s',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: menuOpen ? 'var(--arc)' : 'var(--white)',
            borderRadius: '2px',
            opacity: menuOpen ? 0 : 1,
            transition: 'all 0.25s',
          }} />
          <span style={{
            display: 'block', width: '22px', height: '2px',
            background: menuOpen ? 'var(--arc)' : 'var(--white)',
            borderRadius: '2px',
            transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
            transition: 'all 0.25s',
          }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div style={{
        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 99,
        background: 'rgba(8,8,8,0.98)',
        borderBottom: '1px solid #1e1e1e',
        backdropFilter: 'blur(12px)',
        padding: menuOpen ? '24px' : '0 24px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        maxHeight: menuOpen ? '300px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s ease, padding 0.35s ease',
      }}>
        <Link href="/#product" onClick={() => setMenuOpen(false)} style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--muted)' }}>
          Product
        </Link>
        <Link href="/#how-it-works" onClick={() => setMenuOpen(false)} style={{ fontSize: '18px', fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--muted)' }}>
          How it works
        </Link>
        <Link href="/checkout" onClick={() => setMenuOpen(false)} style={{
          display: 'inline-block',
          background: 'var(--arc)', color: '#000',
          padding: '14px 28px', borderRadius: '4px',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          Buy Now — $34.95
        </Link>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: flex !important; }
        }
        @media (min-width: 641px) {
          .mobile-nav-btn { display: none !important; }
        }
      `}</style>
    </>
  )
}
