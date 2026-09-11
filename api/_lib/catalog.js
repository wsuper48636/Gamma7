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

const MAX_QUANTITY_PER_ITEM = 20;

// Validates a client-submitted cart and recomputes it entirely from our
// own catalog — product names, unit prices, and the total are all derived
// server-side. The client's job is only to say *which* products and *how
// many*; it never gets to say what anything costs.
export function priceCart(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const seen = new Set();
  const priced = items.map((entry) => {
    const productId = entry && entry.productId;
    const quantity = Number(entry && entry.quantity);

    if (seen.has(productId)) {
      throw new Error(`Duplicate line item for ${productId}`);
    }
    seen.add(productId);

    const product = getProduct(productId);
    if (!product) {
      throw new Error(`Unknown productId: ${productId}`);
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
      throw new Error(`Invalid quantity for ${productId}`);
    }

    const unitPrice = product.price;
    const lineTotal = (Number(unitPrice) * quantity).toFixed(2);

    return {
      productId,
      productName: product.name,
      unitPrice,
      quantity,
      lineTotal,
    };
  });

  const total = priced
    .reduce((sum, item) => sum + Number(item.lineTotal), 0)
    .toFixed(2);

  return { items: priced, total, currency: CURRENCY };
}
