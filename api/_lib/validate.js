const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Basic server-side validation. Throws a descriptive Error on failure —
// callers turn that into a 400 response. Keeps the client-side form
// validation honest instead of trusting it.
export function validateCheckoutInput({ productId, customer } = {}) {
  const errors = [];

  if (!productId || typeof productId !== "string") {
    errors.push("productId is required");
  }

  const c = customer || {};
  if (!c.name || typeof c.name !== "string" || c.name.trim().length < 2) {
    errors.push("customer.name is required");
  }
  if (!c.email || typeof c.email !== "string" || !EMAIL_RE.test(c.email)) {
    errors.push("customer.email is invalid");
  }

  const a = c.address || {};
  const requiredAddressFields = ["line1", "city", "state", "postalCode", "country"];
  for (const field of requiredAddressFields) {
    if (!a[field] || typeof a[field] !== "string" || !a[field].trim()) {
      errors.push(`customer.address.${field} is required`);
    }
  }

  if (errors.length) {
    throw new Error(errors.join("; "));
  }

  return {
    productId,
    name: c.name.trim(),
    email: c.email.trim().toLowerCase(),
    address: {
      line1: a.line1.trim(),
      line2: (a.line2 || "").trim(),
      city: a.city.trim(),
      state: a.state.trim(),
      postalCode: a.postalCode.trim(),
      country: a.country.trim(),
    },
  };
}
