// Server-side source of truth for product pricing. Never trust a price
// sent from the client — always look it up here before creating/capturing
// a PayPal order.
export const CURRENCY = "AUD";

export const PRODUCTS = {
  neutraliser: { name: "Neutraliser", price: "295.00" },
  activator: { name: "Activator", price: "359.00" },
  "rt-phone-neutraliser": { name: "RT Phone Neutraliser", price: "160.00" },
};

export function getProduct(productId) {
  return PRODUCTS[productId] || null;
}
