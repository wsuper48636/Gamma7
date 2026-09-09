import { paypalFetch } from "./_lib/paypal.js";
import { getProduct, CURRENCY } from "./_lib/catalog.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { productId } = req.body || {};
    const product = getProduct(productId);
    if (!product) {
      return res.status(400).json({ error: "Unknown productId" });
    }

    // Price comes from our own catalog, never from the client, so a
    // tampered request can't check out at an arbitrary amount.
    const order = await paypalFetch("/v2/checkout/orders", {
      method: "POST",
      body: {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: product.name,
            custom_id: productId,
            amount: {
              currency_code: CURRENCY,
              value: product.price,
            },
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
