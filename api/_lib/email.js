import { Resend } from "resend";

// Order-confirmation emails via Resend. If RESEND_API_KEY isn't configured,
// this quietly no-ops rather than failing the checkout — the order is
// already captured and saved by the time this runs, so a missing/failed
// email should never turn a successful purchase into an error response.
function money(amount, currency) {
  return `${currency} $${Number(amount).toFixed(2)}`;
}

function customerEmailHtml({ name, productName, amount, currency, address, paypalOrderId }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #80bb03;">Thanks for your order, ${name}!</h2>
      <p>Your payment for <strong>${productName}</strong> (${money(amount, currency)}) has been received.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0; color: #6b7280;">Order reference</td><td style="padding: 4px 0; text-align: right;">${paypalOrderId}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Product</td><td style="padding: 4px 0; text-align: right;">${productName}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Amount</td><td style="padding: 4px 0; text-align: right;">${money(amount, currency)}</td></tr>
      </table>
      <p style="color: #6b7280;">Shipping to:<br/>
        ${address.line1}${address.line2 ? `<br/>${address.line2}` : ""}<br/>
        ${address.city}, ${address.state} ${address.postalCode}<br/>
        ${address.country}
      </p>
      <p style="color: #6b7280; font-size: 14px;">Gamma-7</p>
    </div>
  `;
}

function merchantEmailHtml({ name, email, productName, amount, currency, address, paypalOrderId, paypalCaptureId }) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>New order: ${productName}</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0; color: #6b7280;">Customer</td><td style="padding: 4px 0; text-align: right;">${name}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Email</td><td style="padding: 4px 0; text-align: right;">${email}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">Amount</td><td style="padding: 4px 0; text-align: right;">${money(amount, currency)}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">PayPal order</td><td style="padding: 4px 0; text-align: right;">${paypalOrderId}</td></tr>
        <tr><td style="padding: 4px 0; color: #6b7280;">PayPal capture</td><td style="padding: 4px 0; text-align: right;">${paypalCaptureId}</td></tr>
      </table>
      <p style="color: #6b7280;">Ship to:<br/>
        ${address.line1}${address.line2 ? `<br/>${address.line2}` : ""}<br/>
        ${address.city}, ${address.state} ${address.postalCode}<br/>
        ${address.country}
      </p>
    </div>
  `;
}

export async function sendOrderEmails(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_FROM_EMAIL;
  const merchantEmail = process.env.MERCHANT_NOTIFICATION_EMAIL;

  if (!apiKey || !fromEmail) {
    console.warn(
      "Skipping order emails: RESEND_API_KEY / ORDER_FROM_EMAIL not configured"
    );
    return;
  }

  const resend = new Resend(apiKey);
  const replyTo = process.env.SUPPORT_EMAIL || undefined;

  const sends = [
    resend.emails.send({
      from: fromEmail,
      to: order.email,
      replyTo,
      subject: `Your Gamma-7 order — ${order.productName}`,
      html: customerEmailHtml(order),
    }),
  ];

  if (merchantEmail) {
    sends.push(
      resend.emails.send({
        from: fromEmail,
        to: merchantEmail,
        subject: `New order: ${order.productName} (${money(order.amount, order.currency)})`,
        html: merchantEmailHtml(order),
      })
    );
  }

  const results = await Promise.allSettled(sends);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("Order email failed to send:", r.reason);
    }
  }
}
