import { recordEvent } from '../../lib/analytics'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { event, ...data } = req.body
  if (!event) return res.status(400).json({ error: 'Missing event' })

  try {
    await recordEvent({ event, ...data })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
