import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px' }}>
        ARC<span style={{ color: 'var(--arc)' }}>LIT</span>
      </span>
      <div style={{ display: 'flex', gap: '24px', fontSize: '13px', color: 'var(--muted)' }}>
        <Link href="/policies/privacy">Privacy Policy</Link>
        <Link href="/policies/refunds">Refund Policy</Link>
        <Link href="/policies/shipping">Shipping Policy</Link>
        <Link href="/policies/terms">Terms of Service</Link>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>
        © {new Date().getFullYear()} ArcLit. All rights reserved. · ABN: [Your ABN] · Australia
      </p>
    </footer>
  )
}
