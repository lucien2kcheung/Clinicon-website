/**
 * POST /api/checkout — creates a Stripe Checkout Session and returns its URL.
 *
 * Runs as a Vercel serverless function. Requires two environment variables in
 * the Vercel project (Settings → Environment Variables):
 *
 *   STRIPE_SECRET_KEY   sk_test_… while testing, sk_live_… in production
 *   SITE_URL            https://www.vitas.com.hk   (optional; inferred if absent)
 *
 * The browser sends only product ids and quantities. Every price, name and the
 * shipping rule are re-read here from src/data.mjs, so a tampered cart cannot
 * change what the customer is charged.
 */

import Stripe from 'stripe';
import { PRODUCTS, SHOP } from '../src/data.mjs';

const MAX_QTY = 20;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return res.status(503).json({
      error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in the Vercel project.',
    });
  }

  const stripe = new Stripe(key);

  try {
    const { items = [], promo = null, lang = 'en' } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    /* Re-price every line from the catalogue — never trust the client. */
    const lineItems = [];
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return res.status(400).json({ error: `Unknown product: ${item.id}` });

      const qty = Math.min(MAX_QTY, Math.max(1, parseInt(item.qty, 10) || 1));
      lineItems.push({
        quantity: qty,
        price_data: {
          currency: SHOP.currency,
          unit_amount: product.price,
          product_data: {
            name: `VITAS ${product.name.en} — ${product.name.zh}`,
            description: product.variant.en,
          },
        },
      });
    }

    const subtotal = lineItems.reduce(
      (sum, line) => sum + line.price_data.unit_amount * line.quantity,
      0
    );

    /* Discounts: look the code up in Stripe rather than trusting the browser.
       Create the promotion code once in the Stripe dashboard (see README). */
    const discounts = [];
    if (promo) {
      const found = await stripe.promotionCodes.list({
        code: String(promo).trim().toUpperCase(),
        active: true,
        limit: 1,
      });
      if (found.data.length) discounts.push({ promotion_code: found.data[0].id });
    }

    const origin =
      process.env.SITE_URL ||
      (req.headers.origin ? String(req.headers.origin) : 'https://www.vitas.com.hk');
    const prefix = lang === 'zh' ? '/zh' : '';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      discounts: discounts.length ? discounts : undefined,
      allow_promotion_codes: discounts.length ? undefined : true,
      locale: lang === 'zh' ? 'zh-HK' : 'en',
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['HK'] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        subtotal >= SHOP.freeShippingOver
          ? {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 0, currency: SHOP.currency },
                display_name: 'Free local delivery · 本地免費送遞',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 2 },
                  maximum: { unit: 'business_day', value: 4 },
                },
              },
            }
          : {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: 3000, currency: SHOP.currency },
                display_name: 'Local delivery · 本地送遞',
                delivery_estimate: {
                  minimum: { unit: 'business_day', value: 2 },
                  maximum: { unit: 'business_day', value: 4 },
                },
              },
            },
      ],
      success_url: `${origin}${prefix}/checkout/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${prefix}/checkout/cancelled/`,
    });

    return res.status(200).json({ url: session.url, id: session.id });
  } catch (error) {
    console.error('checkout failed', error);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
}
