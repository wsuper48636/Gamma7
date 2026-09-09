# Gamma-7

Static mirror of the gamma7.online marketing site, deployed to Vercel from
this GitHub repository (`main` branch) instead of v0's direct deploy
pipeline.

## Checkout (PayPal + Supabase)

`/checkout` is a small React app (source in `checkout-src/`, built by Vite
into `checkout/` at deploy time — see `vercel.json`'s `buildCommand`) that
takes a customer's name, email, and shipping address, then charges them via
PayPal. `api/create-paypal-order.js` and `api/capture-paypal-order.js` are
Vercel serverless functions that create/capture the PayPal order
server-side (pricing always comes from `api/_lib/catalog.js`, never the
client) and, once PayPal confirms the capture, insert the order into
Supabase (`api/_lib/supabase.js`, using the service-role key — never
exposed to the browser).

Before this works you need to:
1. Copy `.env.example` to `.env` locally, and set the same variables as
   Environment Variables on the Vercel project (Settings → Environment
   Variables) — `PAYPAL_CLIENT_ID`/`PAYPAL_SECRET` from a PayPal REST app
   at developer.paypal.com, and `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`
   from your Supabase project's API settings.
2. Run `supabase/schema.sql` in the Supabase SQL editor to create the
   `orders` table.
3. Switch `PAYPAL_API_BASE` from the sandbox to `https://api-m.paypal.com`
   (and use a Live PayPal app) when you're ready to accept real payments.
