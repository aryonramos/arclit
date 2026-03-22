import { getAnalyticsSummary } from '../../lib/analytics'
import { sendReportEmail } from '../../lib/email'

export default async function handler(req, res) {
  // Protect with a secret header or cron token
  const token = req.headers['x-cron-secret'] || req.query.secret
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const summary = await getAnalyticsSummary()
    await sendReportEmail(summary)
    res.json({ ok: true, summary })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
