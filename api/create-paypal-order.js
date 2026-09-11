import { paypalFetch } from "./_lib/paypal.js";
import { priceCart } from "./_lib/catalog.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let cart;
  try {
    cart = priceCart(req.body && req.body.items);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  try {
    // Price, names, and total all come from our own catalog (priceCart),
    // never from the client, so a tampered request can't check out at an
    // arbitrary amount.
    const order = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: cart.currency,
              value: cart.total,
              breakdown: {
                item_total: { currency_code: cart.currency, value: cart.total },
              },
            },
            items: cart.items.map((item) => ({
              name: item.productName,
              quantity: String(item.quantity),
              unit_amount: { currency_code: cart.currency, value: item.unitPrice },
            })),
          },
        ],
      },
    });

    return res.status(200).json({ id: order.id });
  } catch (err) {
    console.error("create-paypal-order failed:", err);
    return res.status(500).json({ error: "Failed to create PayPal order" });
  }
}
