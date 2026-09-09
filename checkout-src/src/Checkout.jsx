import { useMemo, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PRODUCTS, getProduct } from "./catalog";

const EMPTY_ADDRESS = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "AU",
};

function getInitialProductId() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("product");
  return fromQuery && PRODUCTS[fromQuery] ? fromQuery : "activator";
}

export default function Checkout() {
  const [productId, setProductId] = useState(getInitialProductId);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const product = getProduct(productId);

  const isFormValid = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return (
      name.trim().length >= 2 &&
      emailOk &&
      address.line1.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.postalCode.trim() &&
      address.country.trim()
    );
  }, [name, email, address]);

  function updateAddress(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  if (result) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <h2>Payment successful</h2>
          <p>
            Thanks, {name}! Your order for {product.name} is confirmed. A
            receipt has been sent to {email}.
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

      <div className="checkout-summary">
        <div>
          <div className="checkout-summary-name">{product.name}</div>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={{ marginTop: "0.5rem" }}
          >
            {Object.entries(PRODUCTS).map(([id, p]) => (
              <option key={id} value={id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="checkout-summary-price">AUD ${product.price}</div>
      </div>

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
          forceReRender={[productId]}
          createOrder={async () => {
            setError("");
            const res = await fetch("/api/create-paypal-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId }),
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
                productId,
                customer: { name, email, address },
              }),
            });
            const payload = await res.json();
            if (!res.ok) {
              setError(payload.error || "Payment could not be completed");
              return;
            }
            setResult(payload);
          }}
          onError={(err) => {
            console.error("PayPal button error:", err);
            setError("Something went wrong with PayPal. Please try again.");
          }}
        />
        {!isFormValid && (
          <p className="checkout-disabled-note">
            Fill in your name, email, and shipping address to enable payment.
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
