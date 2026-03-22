# ArcLit — USB Plasma Lighter Store

A complete Next.js dropshipping storefront with embedded Stripe checkout and automated analytics email reports.

---

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Payments**: Stripe (embedded Payment Element — stays on your domain)
- **Analytics**: Custom event tracking → weekly email reports via Nodemailer
- **Deployment**: Vercel
- **Fonts**: Syne + DM Sans (Google Fonts)

---

## Project Structure

```
arclit/
├── pages/
│   ├── index.js              # Product landing page
│   ├── checkout.js           # Custom checkout with Stripe
│   ├── success.js            # Post-purchase confirmation
│   ├── policies/[slug].js    # Privacy, Refunds, Shipping, Terms
│   └── api/
│       ├── create-payment-intent.js  # Stripe PaymentIntent
│       ├── webhook.js                # Stripe webhook (order confirmed)
│       ├── track.js                  # Event tracking endpoint
│       └── send-report.js            # Trigger analytics email
├── lib/
│   ├── analytics.js          # Event storage + summary logic
│   └── email.js              # Nodemailer report sender
├── styles/
│   └── globals.css
├── vercel.json               # Cron job (Monday 9am report)
└── .env.local.example        # Environment variable template
```

---

## Analytics Tracked

| Metric | How |
|---|---|
| Page visits | `page_view` event on every load |
| Traffic source | UTM params + `document.referrer` |
| Add to cart (no purchase) | `add_to_cart` event tracked separately from orders |
| Cart abandonment rate | `(add_to_carts - orders) / add_to_carts × 100` |
| Conversion rate | `orders / page_views × 100` |
| Average order value | `total_revenue / total_orders` |

Reports are emailed every **Monday at 9am** automatically via Vercel Cron.
Trigger manually: `GET /api/send-report?secret=YOUR_ADMIN_PASSWORD`

---

## Setup & Deployment

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/arclit.git
cd arclit
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

| Variable | Where to get it |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same place (starts with `pk_`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → your endpoint |
| `EMAIL_FROM` | Your Gmail address |
| `EMAIL_TO` | Where you want reports sent (can be same) |
| `EMAIL_PASSWORD` | Gmail App Password (NOT your login password) |
| `ADMIN_PASSWORD` | Any secret string you choose |
| `NEXT_PUBLIC_URL` | Your Vercel domain once deployed |

### 3. Gmail App Password setup

1. Go to your Google Account → Security
2. Enable 2-Factor Authentication (required)
3. Search "App passwords" → Create one for "Mail"
4. Use that 16-character password as `EMAIL_PASSWORD`

### 4. Run locally

```bash
npm run dev
# Visit http://localhost:3000
```

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at **vercel.com/new** and import the project.

**Add environment variables in Vercel:**
- Go to your project → Settings → Environment Variables
- Add every variable from `.env.local.example`

### 6. Set up Stripe Webhook

1. Go to **Stripe Dashboard → Developers → Webhooks**
2. Click **Add endpoint**
3. URL: `https://your-domain.vercel.app/api/webhook`
4. Events to listen for: `payment_intent.succeeded`
5. Copy the **Signing secret** → paste as `STRIPE_WEBHOOK_SECRET` in Vercel

### 7. UTM tracking for social content

Add UTM parameters to your bio links so you can see exactly which platform drives sales:

- TikTok bio: `https://arclit.com.au?utm_source=tiktok`
- Instagram bio: `https://arclit.com.au?utm_source=instagram`

These will show up in your weekly analytics report under **Traffic sources**.

---

## Updating product price

The price is set in two places:

1. `pages/index.js` — line 8: `const PRICE = 34.95`
2. `pages/checkout.js` — line 9: `const PRICE = 34.95`
3. `pages/api/create-payment-intent.js` — line 5: `const PRICE_AUD = 3495` (in cents)

Change all three to update.

---

## Going live checklist

- [ ] Replace Stripe test keys with live keys in Vercel env vars
- [ ] Set up Stripe webhook with live endpoint
- [ ] Add your ABN to `components/Footer.js`
- [ ] Replace placeholder reviews in `pages/index.js` with real ones when you get them
- [ ] Point custom domain in Vercel (Settings → Domains)
- [ ] Add product photos once you have them (replace SVG illustration in index.js)
- [ ] Test a full purchase with Stripe test card `4242 4242 4242 4242`

---

## Customising

**Change store name**: Find/replace `ArcLit` and `ARCLIT` throughout
**Change colour**: Find/replace `#4fc3f7` and `var(--arc)` in globals.css and inline styles
**Add product variants**: Extend the qty selector in index.js and add variant state
**Add more products**: Duplicate pages and create separate PaymentIntents per product
