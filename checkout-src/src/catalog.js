// Client-side copy for display purposes only. The server
// (api/_lib/catalog.js) is the authoritative source used to actually
// price the PayPal order — this file must never be trusted for money.
export const CURRENCY = "AUD";

export const PRODUCTS = {
  neutraliser: { name: "Neutraliser", price: "295.00" },
  activator: { name: "Activator", price: "359.00" },
  "rt-phone-neutraliser": { name: "RT Phone Neutraliser", price: "160.00" },
};

export function getProduct(productId) {
  return PRODUCTS[productId] || null;
}
