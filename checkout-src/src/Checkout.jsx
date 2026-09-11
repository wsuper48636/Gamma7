import { useEffect, useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PRODUCTS, getProduct, CURRENCY } from "./catalog";

const CART_KEY = "gamma7_cart";
const EMPTY_ADDRESS = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AU",
};

function readCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch (e) {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function addToCart(items, productId, quantity) {
  const next = items.map((i) => ({ ...i }));
  const existing = next.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    next.push({ productId, quantity });
  }
  return next;
}

export default function Checkout() {
  const [items, setItems] = useState(() => {
    const initial = readCart();
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get("product");
    if (fromQuery && PRODUCTS[fromQuery]) {
      const withQuery = addToCart(initial, fromQuery, 1);
      writeCart(withQuery);
      return withQuery;
    }
    return initial;
  });
  const [addProductId, setAddProductId] = useState(
    Object.keys(PRODUCTS)[0]
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  const pricedItems = useMemo(
    () =>
      items
        .map((i) => {
          const product = getProduct(i.productId);
          if (!product) return null;
          return {
            productId: i.productId,
            name: product.name,
            quantity: i.quantity,
            unitPrice: product.price,
            lineTotal: (Number(product.price) * i.quantity).toFixed(2),
          };
        })
        .filter(Boolean),
    [items]
  );

  const total = useMemo(
    () => pricedItems.reduce((sum, i) => sum + Number(i.lineTotal), 0).toFixed(2),
    [pricedItems]
  );

  const isFormValid = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return (
      pricedItems.length > 0 &&
      name.trim().length >= 2 &&
      emailOk &&
      address.line1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.postalCode.trim() &&
      address.country.trim()
    );
  }, [pricedItems, name, email, address]);

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function handleAddProduct() {
    setItems((prev) => addToCart(prev, addProductId, 1));
  }

  if (result) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <h2>Payment successful</h2>
          <p>
            Thanks, {name}! Your order ({result.items.length} item
            {result.items.length === 1 ? "" : "s"}, {CURRENCY} ${result.total})
            is confirmed. A receipt has been sent to {email}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      <p className="checkout-subtitle">
        Complete your shipping details, then pay securely with PayPal.
      </p>

      {pricedItems.length === 0 ? (
        <div className="checkout-summary" style={{ justifyContent: "center" }}>
          Your cart is empty. <a href="/products" style={{ marginLeft: 6 }}>Browse products</a>
        </div>
      ) : (
        <div className="checkout-cart">
          {pricedItems.map((item) => (
            <div className="checkout-cart-row" key={item.productId}>
              <div className="checkout-cart-name">{item.name}</div>
              <div className="checkout-cart-controls">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, parseInt(e.target.value, 10) || 0)
                  }
                  className="checkout-qty-input"
                />
                <div className="checkout-cart-price">
                  {CURRENCY} ${item.lineTotal}
                </div>
                <button
                  type="button"
                  className="checkout-remove-btn"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="checkout-add-product">
            <select
              value={addProductId}
              onChange={(e) => setAddProductId(e.target.value)}
            >
              {Object.entries(PRODUCTS).map(([id, p]) => (
                <option key={id} value={id}>
                  {p.name} — {CURRENCY} ${p.price}
                </option>
              ))}
            </select>
            <button type="button" onClick={handleAddProduct}>
              Add another product
            </button>
          </div>

          <div className="checkout-cart-total">
            <span>Total</span>
            <span>
              {CURRENCY} ${total}
            </span>
          </div>
        </div>
      )}

      <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
        <div className="checkout-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="checkout-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="checkout-field">
          <label htmlFor="line1">Address line 1</label>
          <input
            id="line1"
            value={address.line1}
            onChange={(e) => updateAddress("line1", e.target.value)}
            autoComplete="address-line1"
          />
        </div>
        <div className="checkout-field">
          <label htmlFor="line2">Address line 2 (optional)</label>
          <input
            id="line2"
            value={address.line2}
            onChange={(e) => updateAddress("line2", e.target.value)}
            autoComplete="address-line2"
          />
        </div>
        <div className="checkout-row">
          <div className="checkout-field">
            <label htmlFor="city">City</label>
            <input
              id="city"
              value={address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              autoComplete="address-level2"
            />
          </div>
          <div className="checkout-field">
            <label htmlFor="state">State</label>
            <input
              id="state"
              value={address.state}
              onChange={(e) => updateAddress("state", e.target.value)}
              autoComplete="address-level1"
            />
          </div>
        </div>
        <div className="checkout-row">
          <div className="checkout-field">
            <label htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              value={address.postalCode}
              onChange={(e) => updateAddress("postalCode", e.target.value)}
              autoComplete="postal-code"
            />
          </div>
          <div className="checkout-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              value={address.country}
              onChange={(e) => updateAddress("country", e.target.value)}
              autoComplete="country"
            />
          </div>
        </div>
      </form>

      {error && <div className="checkout-error">{error}</div>}

      <div className="checkout-paypal">
        <PayPalButtons
          disabled={!isFormValid}
          forceReRender={[JSON.stringify(items)]}
          createOrder={async () => {
            setError("");
            const res = await fetch("/api/create-paypal-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items }),
            });
            const data = await res.json();
            if (!res.ok) {
              setError(data.error || "Could not start checkout");
              throw new Error(data.error || "create-order failed");
            }
            return data.id;
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/capture-paypal-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderID: data.orderID,
                items,
                customer: { name, email, address },
              }),
            });
            const payload = await res.json();
            if (!res.ok) {
              setError(payload.error || "Payment could not be completed");
              return;
            }
            writeCart([]);
            setResult({ items: pricedItems, total });
          }}
          onError={(err) => {
            console.error("PayPal button error:", err);
            setError("Something went wrong with PayPal. Please try again.");
          }}
        />
        {!isFormValid && (
          <p className="checkout-disabled-note">
            {pricedItems.length === 0
              ? "Add a product to your cart to continue."
              : "Fill in your name, email, and shipping address to enable payment."}
          </p>
        )}
      </div>
    </div>
  );
}

export function CheckoutApp() {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  if (!clientId) {
    return (
      <div className="checkout-page">
        <div className="checkout-error">
          PayPal is not configured (missing VITE_PAYPAL_CLIENT_ID).
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{ clientId, currency: "AUD", intent: "capture" }}
    >
      <Checkout />
    </PayPalScriptProvider>
  );
}
