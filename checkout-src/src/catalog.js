// Client-side copy for display purposes only. The server
// (api/_lib/catalog.js) is the authoritative source used to actually
// price the PayPal order — this file must never be trusted for money.
export const CURRENCY = "AUD";

export const PRODUCTS = {
  neutraliser: { name: "Neutraliser", price: "295.00" },
  activator: { name: "Activator", price: "359.00" },
  "rt-phone-neutraliser": { name: "RT Phone Neutraliser", price: "160.00" },
  "set-complete-protection": {
    name: "Set: RT Phone Neutraliser + Neutraliser + Activator",
    price: "789.00",
  },
  "energy-diagnostics": {
    name: "Diagnostics of your energy field",
    price: "0.00",
    description:
      "During your energy field assessment, we will explore key areas of your life such as your life purpose, relationships, work-life balance and energy drains - identifying actionable steps and empowering you with clear insights to bring balance and improvement to your life.",
  },
};

export const SET_PRODUCT_ID = "set-complete-protection";
export const SET_COMPONENT_IDS = ["neutraliser", "activator", "rt-phone-neutraliser"];
export const SET_SAVINGS = (
  SET_COMPONENT_IDS.reduce((sum, id) => sum + Number(PRODUCTS[id].price), 0) -
  Number(PRODUCTS[SET_PRODUCT_ID].price)
).toFixed(2);
export const SET_GIFT_PRODUCT_ID = "energy-diagnostics";

export function getProduct(productId) {
  return PRODUCTS[productId] || null;
}
