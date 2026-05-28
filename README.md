# FIRA Wellness Club

Next.js site for FIRA Wellness Club with class pages, calendar availability, Stripe checkout, and booking confirmation emails.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Required in Vercel for payments and email:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`

Optional schedule source:

- `GOOGLE_SHEET_CSV_URL`

## Scripts

- `npm run dev` starts local development.
- `npm run build` creates a production build.

## Deploy

Production deploys to Vercel project `fira`.
