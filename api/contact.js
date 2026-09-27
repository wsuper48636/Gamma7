import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured");
  }

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  return data.success === true;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, turnstileToken } = req.body || {};

  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name is required");
  }
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    errors.push("A valid email is required");
  }
  if (!message || typeof message !== "string" || message.trim().length < 5) {
    errors.push("Message is too short");
  }
  if (!turnstileToken || typeof turnstileToken !== "string") {
    errors.push("CAPTCHA verification is required");
  }
  if (errors.length) {
    return res.status(400).json({ error: errors.join("; ") });
  }

  try {
    const remoteIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim();
    const captchaOk = await verifyTurnstile(turnstileToken, remoteIp);
    if (!captchaOk) {
      return res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
    }
  } catch (err) {
    console.error("Turnstile verification failed:", err);
    return res.status(500).json({ error: "Could not verify CAPTCHA. Please try again later." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.ORDER_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SUPPORT_EMAIL || process.env.MERCHANT_NOTIFICATION_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Contact form email not configured: missing RESEND_API_KEY / ORDER_FROM_EMAIL / CONTACT_TO_EMAIL");
    return res.status(500).json({ error: "Contact form is temporarily unavailable. Please email us directly." });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #80bb03;">New contact form message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Failed to send contact form email:", err);
    return res.status(500).json({ error: "Failed to send your message. Please try again later." });
  }
}
