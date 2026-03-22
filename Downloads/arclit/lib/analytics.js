import fs from 'fs'
import path from 'path'

// In production, replace this with a real database (Supabase, PlanetScale, etc.)
// For Vercel, use Vercel KV or an external DB since the filesystem is ephemeral.
const DATA_FILE = path.join(process.cwd(), 'analytics-data.json')

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
    }
  } catch {}
  return { events: [] }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function recordEvent(payload) {
  const data = readData()
  data.events.push({
    ...payload,
    timestamp: new Date().toISOString(),
  })
  writeData(data)
}

export async function getAnalyticsSummary() {
  const data = readData()
  const events = data.events || []

  // Last 7 days
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recent = events.filter(e => new Date(e.timestamp) > cutoff)

  const pageViews = recent.filter(e => e.event === 'page_view').length
  const checkoutViews = recent.filter(e => e.event === 'checkout_view').length
  const addToCarts = recent.filter(e => e.event === 'add_to_cart').length
  const orders = recent.filter(e => e.event === 'order_complete')
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  const totalOrders = orders.length
  const totalQty = orders.reduce((sum, o) => sum + (o.qty || 1), 0)

  // Traffic sources
  const sources = {}
  recent.filter(e => e.event === 'page_view').forEach(e => {
    const src = e.utm_source || (e.referrer ? new URL(e.referrer).hostname : 'direct') || 'direct'
    sources[src] = (sources[src] || 0) + 1
  })

  // Conversion rate
  const conversionRate = pageViews > 0 ? ((totalOrders / pageViews) * 100).toFixed(2) : '0.00'
  // Cart abandonment
  const cartAbandonmentRate = addToCarts > 0 ? (((addToCarts - totalOrders) / addToCarts) * 100).toFixed(1) : '0.0'
  // AOV
  const aov = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'

  return {
    period: 'Last 7 days',
    pageViews,
    checkoutViews,
    addToCarts,
    totalOrders,
    totalRevenue: totalRevenue.toFixed(2),
    aov,
    conversionRate,
    cartAbandonmentRate,
    topSources: Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source, count]) => ({ source, count })),
  }
}
