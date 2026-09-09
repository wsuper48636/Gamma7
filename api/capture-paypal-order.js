import { paypalFetch } from "./_lib/paypal.js";
import { getProduct } from "./_lib/catalog.js";
import { validateCheckoutInput } from "./_lib/validate.js";
import { getSupabaseAdmin } from "./_lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderID } = req.body || {};
  if (!orderID || typeof orderID !== "string") {
    return res.status(400).json({ error: "orderID is required" });
  }

  let input;
  try {
    input = validateCheckoutInput(req.body);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const product = getProduct(input.productId);
  if (!product) {
    return res.status(400).json({ error: "Unknown productId" });
  }

  try {
    // Capture on PayPal's servers — this is the actual charge.
    const capture = await paypalFetch(
      `/v2/checkout/orders/${orderID}/capture`,
      { method: "POST" }
    );

    const purchaseUnit = capture.purchase_units?.[0];
    const captureRecord = purchaseUnit?.payments?.captures?.[0];

    if (capture.status !== "COMPLETED" || captureRecord?.status !== "COMPLETED") {
      return res.status(402).json({
        error: "Payment was not completed",
        status: capture.status,
      });
    }

    // Verify the amount PayPal actually captured matches our own catalog
    // price for the product — never trust the client's own claim of what
    // was paid, even after a successful capture.
    const capturedAmount = captureRecord.amount;
    if (
      !capturedAmount ||
      capturedAmount.value !== product.price ||
      capturedAmount.currency_code !== "AUD"
    ) {
      console.error("Captured amount mismatch", {
        orderID,
        expected: product.price,
        got: capturedAmount,
      });
      return res.status(402).json({ error: "Captured amount does not match order" });
    }

    const supabase = getSupabaseAdmin();
    const { data: dbOrder, error: dbError } = await supabase
      .from("orders")
      .insert({
        paypal_order_id: capture.id,
        paypal_capture_id: captureRecord.id,
        product_id: input.productId,
        product_name: product.name,
        amount: capturedAmount.value,
        currency: capturedAmount.currency_code,
        customer_name: input.name,
        customer_email: input.email,
        shipping_line1: input.address.line1,
        shipping_line2: input.address.line2,
        shipping_city: input.address.city,
        shipping_state: input.address.state,
        shipping_postal_code: input.address.postalCode,
        shipping_country: input.address.country,
        status: "paid",
      })
      .select()
      .single();

    if (dbError) {
      // The payment succeeded but we failed to record it — log loudly so
      // this can be reconciled manually rather than silently losing the
      // order.
      console.error("Failed to store order after successful capture:", {
        orderID,
        captureId: captureRecord.id,
        dbError,
      });
      return res.status(500).json({
        error: "Payment captured but failed to save order. Contact support.",
        paypalCaptureId: captureRecord.id,
      });
    }

    return res.status(200).json({ success: true, orderId: dbOrder.id });
  } catch (err) {
    console.error("capture-paypal-order failed:", err);
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
}
