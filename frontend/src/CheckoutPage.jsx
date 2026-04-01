import { useState, useEffect } from "react";
import FoodBill from "./FoodBill";
import { API_BASE } from "./apiBase";

const FOOD_IMAGES = {
  1: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  3: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  4: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  5: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  6: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80",
  7: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&q=80",
  8: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80",
  9: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80",
};

const CITIES = [
  "Rajkot", "Ahmedabad", "Surat", "Vadodara", "Gandhinagar",
  "Bhavnagar", "Jamnagar", "Junagadh", "Anand", "Nadiad",
  "Mumbai", "Pune", "Delhi", "Bangalore", "Chennai",
  "Hyderabad", "Kolkata", "Jaipur", "Lucknow", "Indore",
];

const PINCODES = [
  { code: "360001", city: "Rajkot" },
  { code: "360002", city: "Rajkot" },
  { code: "360003", city: "Rajkot" },
  { code: "360004", city: "Rajkot" },
  { code: "360005", city: "Rajkot" },
  { code: "380001", city: "Ahmedabad" },
  { code: "380006", city: "Ahmedabad" },
  { code: "380015", city: "Ahmedabad" },
  { code: "395001", city: "Surat" },
  { code: "395002", city: "Surat" },
  { code: "390001", city: "Vadodara" },
  { code: "382010", city: "Gandhinagar" },
  { code: "364001", city: "Bhavnagar" },
  { code: "361001", city: "Jamnagar" },
  { code: "362001", city: "Junagadh" },
  { code: "400001", city: "Mumbai" },
  { code: "400050", city: "Mumbai" },
  { code: "411001", city: "Pune" },
  { code: "110001", city: "Delhi" },
  { code: "560001", city: "Bangalore" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');

.co-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  padding-top: 72px;
  background: transparent;
}

.co-page::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: url("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1700&q=80");
  background-size: cover;
  background-position: center;
  filter: brightness(0.35) contrast(1.08) saturate(1.05);
}

.co-page::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(102deg, rgba(2, 11, 20, 0.9) 0%, rgba(2, 11, 20, 0.72) 45%, rgba(2, 11, 20, 0.54) 100%),
    radial-gradient(900px 350px at 2% 0%, rgba(244, 164, 53, 0.2), transparent 70%);
}

.co-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(2, 13, 24, 0.84);
  backdrop-filter: blur(8px);
}

.co-header-inner {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 24px clamp(16px, 4vw, 48px) 26px;
}

.co-back-btn {
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, color 0.2s;
}

.co-back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateX(-2px);
}

.co-kicker {
  margin-top: 18px;
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
}

.co-page-title {
  margin-top: 6px;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(1.9rem, 3vw, 2.7rem);
  color: #fff;
  letter-spacing: 0.4px;
}

.co-page-sub {
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.92rem;
}

.co-badges {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.co-badge {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
  border-radius: 3px;
  padding: 5px 11px;
  font-size: 0.67rem;
  color: rgba(255, 255, 255, 0.88);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.co-inner {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 34px clamp(16px, 4vw, 48px) 60px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 390px);
  gap: 24px;
  align-items: start;
}

.co-left {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.co-section {
  background: linear-gradient(160deg, rgba(2, 13, 24, 0.93) 0%, rgba(6, 20, 36, 0.82) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 26px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.35);
  transition: transform 0.2s, border-color 0.2s;
}

.co-section:hover {
  transform: translateY(-2px);
  border-color: var(--border2);
}

.co-section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  color: #fff;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.co-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 14px;
}

.co-field label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.74);
}

.co-field input,
.co-field select,
.co-field textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.co-field input:focus,
.co-field select:focus,
.co-field textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(244, 164, 53, 0.14);
}

.co-field input::placeholder,
.co-field textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.co-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.co-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}

.co-suggest-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 99;
  background: rgba(2, 13, 24, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 4px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}

.co-suggest-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  font-size: 0.85rem;
  color: var(--text);
  cursor: pointer;
  border-bottom: 1px solid var(--border);
  transition: background 0.16s;
}

.co-suggest-item:last-child {
  border-bottom: none;
}

.co-suggest-item:hover {
  background: var(--surface2);
}

.co-suggest-secondary {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.76rem;
}

.co-coupon-row {
  display: flex;
  gap: 10px;
}

.co-coupon-row input {
  flex: 1;
}

.co-apply-btn {
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 12px 18px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.co-apply-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.co-coupon-success {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(45, 198, 83, 0.1);
  border: 1px solid rgba(45, 198, 83, 0.26);
  color: #2dc653;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.83rem;
  font-weight: 700;
}

.co-coupon-error {
  margin-top: 6px;
  color: #e63946;
  font-size: 0.81rem;
}

.co-coupon-chips {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.co-coupon-chip {
  border: 1px dashed rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.07);
  color: var(--accent);
  border-radius: 3px;
  padding: 4px 10px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: pointer;
}

.co-pay-methods {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.co-pay-method {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 14px 10px;
  text-align: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
}

.co-pay-method:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.co-pay-method.selected {
  border-color: var(--accent);
  background: rgba(244, 164, 53, 0.15);
  box-shadow: 0 12px 24px rgba(244, 164, 53, 0.18);
}

.co-pay-method-icon {
  font-size: 1.55rem;
  margin-bottom: 8px;
}

.co-pay-method-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.co-pay-method-sub {
  font-size: 0.64rem;
  color: rgba(255, 255, 255, 0.58);
  margin-top: 3px;
}

.co-summary {
  position: sticky;
  top: 90px;
  background: linear-gradient(165deg, rgba(2, 13, 24, 0.96) 0%, rgba(8, 23, 40, 0.84) 100%);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 20px 46px rgba(0, 0, 0, 0.34);
}

.co-summary-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 16px;
}

.co-item-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.co-item-row:last-of-type {
  border-bottom: none;
}

.co-item-img {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.co-item-info {
  flex: 1;
  min-width: 0;
}

.co-item-name {
  font-size: 0.86rem;
  color: #fff;
  font-weight: 700;
}

.co-item-custom {
  margin-top: 2px;
  font-size: 0.71rem;
  color: rgba(255, 255, 255, 0.58);
}

.co-item-qty {
  margin-top: 2px;
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.58);
}

.co-item-price {
  font-family: var(--font-display);
  font-size: 0.92rem;
  color: var(--text);
  font-weight: 700;
  flex-shrink: 0;
}

.co-divider {
  height: 1px;
  background: var(--border);
  margin: 14px 0;
}

.co-row {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.64);
  font-size: 0.84rem;
  margin-bottom: 7px;
}

.co-row.discount {
  color: #2dc653;
}

.co-total {
  margin-top: 12px;
  border-top: 1px solid var(--border);
  padding-top: 12px;
  display: flex;
  justify-content: space-between;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.28rem;
  color: #fff;
}

.co-total span:last-child {
  color: var(--accent);
}

.co-place-btn {
  margin-top: 16px;
  width: 100%;
  border: none;
  border-radius: 4px;
  background: var(--accent);
  color: #0a0a0a;
  padding: 15px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

.co-place-btn:hover:not(:disabled) {
  background: #ffb84d;
  transform: scale(1.01);
}

.co-place-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.co-secure {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.74rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.co-payment-chips {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
}

.co-payment-chip {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.75);
  padding: 3px 9px;
  border-radius: 3px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.co-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.co-empty {
  width: min(680px, calc(100% - 2 * clamp(16px, 4vw, 48px)));
  max-width: 680px;
  margin: 80px auto;
  background: linear-gradient(165deg, rgba(2, 13, 24, 0.93) 0%, rgba(8, 23, 40, 0.82) 100%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  padding: 44px 28px;
  text-align: center;
  box-shadow: 0 22px 56px var(--shadow);
}

.co-empty-icon {
  font-size: 3.8rem;
  display: block;
  margin-bottom: 12px;
}

.co-empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 8px;
}

.co-empty-sub {
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 18px;
}

.co-mobile-cta {
  display: none;
}

.co-mobile-amount {
  color: var(--text);
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.co-mobile-note {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.72rem;
  margin-top: 2px;
}

@media (max-width: 980px) {
  .co-inner {
    grid-template-columns: 1fr;
  }

  .co-summary {
    position: static;
  }

  .co-pay-methods {
    grid-template-columns: 1fr 1fr;
  }

  .co-desktop-only {
    display: none;
  }

  .co-mobile-cta {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 120;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid var(--border2);
    background: var(--surface);
    border-radius: 16px;
    padding: 11px 12px;
    box-shadow: 0 16px 44px var(--shadow);
    backdrop-filter: blur(10px);
  }

  .co-page {
    padding-bottom: 96px;
  }
}

@media (max-width: 640px) {
  .co-header-inner,
  .co-inner {
    padding-left: 18px;
    padding-right: 18px;
  }

  .co-section,
  .co-summary {
    padding: 18px;
  }

  .co-page-title {
    font-size: 1.8rem;
  }

  .co-row-2,
  .co-row-3,
  .co-pay-methods {
    grid-template-columns: 1fr;
  }
}

/* Unified promo checkout polish */
.co-page {
  color-scheme: dark;
}

.co-header,
.co-section,
.co-summary,
.co-mobile-cta {
  border-radius: 8px;
  border-color: rgba(255, 255, 255, 0.16);
}

.co-header {
  background: rgba(2, 13, 24, 0.88);
}

.co-page-title,
.co-section-title,
.co-summary-title {
  letter-spacing: 0.7px;
}

.co-back-btn,
.co-apply-btn,
.co-place-btn,
.co-coupon-chip {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.co-field input,
.co-field select,
.co-field textarea {
  min-height: 46px;
}

.co-field textarea {
  min-height: 96px;
}

.co-pay-method {
  border-radius: 4px;
  min-height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.co-pay-method.selected {
  box-shadow: 0 14px 28px rgba(246, 181, 21, 0.2);
}

.co-item-row {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.co-total {
  font-size: 1.45rem;
  letter-spacing: 0.4px;
}

@media (max-width: 980px) {
  .co-mobile-cta {
    border-radius: 6px;
    bottom: 10px;
  }
}

@media (max-width: 620px) {
  .co-badges {
    gap: 6px;
  }

  .co-badge {
    font-size: 0.62rem;
    padding: 4px 8px;
  }

  .co-page-title {
    font-size: 1.6rem;
    letter-spacing: 0.6px;
  }

  .co-coupon-row {
    flex-direction: column;
  }

  .co-apply-btn {
    width: 100%;
  }

  .co-place-btn {
    padding: 14px;
  }
}
`;

const COUPONS = {
  FIRSTBITE: { discount: 0, type: "free_delivery", label: "Free Delivery!" },
  SAVE10: { discount: 0.1, type: "percent", label: "10% off!" },
  FLAT50: { discount: 50, type: "flat", label: "Rs 50 off!" },
  WELCOME20: { discount: 0.2, type: "percent", label: "20% off!" },
};

export default function CheckoutPage({ cart, user, setActivePage, setCart, showToast }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [payMethod, setPayMethod] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [pinSuggestions, setPinSuggestions] = useState([]);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.id = "co-css";
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);
    return () => document.getElementById("co-css")?.remove();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = couponApplied?.type === "free_delivery" ? 0 : 2.99;
  const tax = subtotal * 0.08;

  let discount = 0;
  if (couponApplied) {
    if (couponApplied.type === "percent") discount = subtotal * couponApplied.discount;
    if (couponApplied.type === "flat") discount = Math.min(couponApplied.discount, subtotal);
  }

  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError("");
    if (!code) return;

    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!data.success) {
        setCouponError(data.message || "Invalid coupon code");
        return;
      }
      setCouponApplied({ ...data.coupon, code });
      showToast(`Coupon applied! ${data.coupon.label} 🎉`);
    } catch {
      const fallback = COUPONS[code];
      if (!fallback) {
        setCouponError("Invalid coupon code");
        return;
      }
      setCouponApplied({ ...fallback, code });
      showToast(`Coupon applied! ${fallback.label} 🎉`);
    }
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      showToast("Please enter your name");
      return false;
    }
    if (!form.phone.trim()) {
      showToast("Please enter your phone");
      return false;
    }
    if (!form.address.trim()) {
      showToast("Please enter your address");
      return false;
    }
    if (!form.city.trim()) {
      showToast("Please enter your city");
      return false;
    }
    if (!form.pincode.trim()) {
      showToast("Please enter your pincode");
      return false;
    }
    return true;
  };

  const createBackendOrder = async (paymentId = null, paymentStatus = "pending") => {
    let res;
    try {
      res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            customizations: item.customizations || {},
          })),
          total: parseFloat(total.toFixed(2)),
          subtotal: parseFloat(subtotal.toFixed(2)),
          deliveryFee,
          tax: parseFloat(tax.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          couponCode: couponApplied?.code || null,
          deliveryAddress: `${form.address}, ${form.city} - ${form.pincode}`,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          notes: form.notes,
          userId: user?.id || null,
          paymentMethod: payMethod,
          paymentId,
          paymentStatus,
        }),
      });
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error(
          `Cannot connect to backend at ${API_BASE}. Start the backend server and try again.`,
        );
      }
      throw err;
    }

    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }

    if (!res.ok || !data?.success) {
      throw new Error(data?.message || `Order request failed (${res.status})`);
    }

    return data;
  };

  const handleRazorpay = async () => {
    setPlacing(true);
    try {
      const createOrderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      });
      const createOrderData = await createOrderRes.json();

      if (!createOrderData.success) {
        throw new Error(createOrderData.message || "Unable to start payment");
      }

      if (!window.Razorpay) {
        throw new Error("Payment SDK not loaded. Please retry.");
      }

      const options = {
        key: createOrderData.keyId,
        amount: createOrderData.order.amount,
        currency: "INR",
        name: "Fork.Fleet",
        description: `Order of ${cart.length} item(s)`,
        order_id: createOrderData.order.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#F4A435" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error("Payment verification failed");

            const orderData = await createBackendOrder(response.razorpay_payment_id, "paid");
            setSuccess(orderData.order);
            setCart([]);
            showToast("Payment successful! 🎉");
          } catch (err) {
            setPlacing(false);
            showToast(`Payment verified but order failed: ${err.message}`);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            showToast("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setPlacing(false);
      showToast(`Payment failed: ${err.message}`);
    }
  };

  const handleCODOrUPI = async () => {
    setPlacing(true);
    try {
      const data = await createBackendOrder(null, payMethod === "cod" ? "cash_on_delivery" : "upi_pending");
      setSuccess(data.order);
      setCart([]);
      showToast("Order placed! 🎉");
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;
    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }

    if (payMethod === "razorpay") {
      handleRazorpay();
      return;
    }

    handleCODOrUPI();
  };

  if (success) {
    return (
      <FoodBill
        order={success}
        onTrack={() => setActivePage("orders")}
        onHome={() => setActivePage("menu")}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="co-page">
        <div className="co-empty">
          <span className="co-empty-icon">🧺</span>
          <h1 className="co-empty-title">Your cart is empty</h1>
          <p className="co-empty-sub">Add a few dishes first, then return here to complete checkout.</p>
          <button className="co-back-btn" onClick={() => setActivePage("menu")}>
            Browse menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <div className="co-header">
        <div className="co-header-inner">
          <button className="co-back-btn" onClick={() => setActivePage("menu")}>
            ← Continue ordering
          </button>

          <div className="co-kicker">Secure Checkout</div>
          <h1 className="co-page-title">Finish your order</h1>
          <p className="co-page-sub">
            {itemCount} item{itemCount !== 1 ? "s" : ""} · Estimated delivery 30-45 min · Total ₹{Math.round(total)}
          </p>

          <div className="co-badges">
            <span className="co-badge">🔒 SSL Secured</span>
            <span className="co-badge">⚡ Fast checkout</span>
            <span className="co-badge">🛵 Live tracking</span>
          </div>
        </div>
      </div>

      <div className="co-inner">
        <div className="co-left">
          <div className="co-section">
            <div className="co-section-title">📍 Delivery Address</div>

            <div className="co-row-2">
              <div className="co-field">
                <label>Full Name *</label>
                <input
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="co-field">
                <label>Phone Number *</label>
                <input
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="co-field">
              <label>Email</label>
              <input
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="co-field" style={{ position: "relative" }}>
              <label>Street Address *</label>
              <input
                placeholder="House No., Street, Area"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                autoComplete="street-address"
                list="address-suggestions"
              />

              <datalist id="address-suggestions">
                <option value="1, MG Road" />
                <option value="2, Station Road" />
                <option value="3, Park Street" />
                <option value="Near Bus Stand" />
                <option value="Opposite Railway Station" />
                <option value="Behind City Mall" />
                <option value="Main Market Road" />
                <option value="Residency Road" />
              </datalist>
            </div>

            <div className="co-row-2">
              <div className="co-field" style={{ position: "relative" }}>
                <label>City *</label>
                <input
                  placeholder="Rajkot"
                  value={form.city}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({ ...prev, city: val }));
                    setCitySuggestions(
                      CITIES.filter((city) =>
                        city.toLowerCase().startsWith(val.toLowerCase()) && val.length > 0,
                      ),
                    );
                  }}
                  onBlur={() => setTimeout(() => setCitySuggestions([]), 200)}
                  autoComplete="off"
                />

                {citySuggestions.length > 0 && (
                  <div className="co-suggest-list">
                    {citySuggestions.map((city) => (
                      <div
                        key={city}
                        className="co-suggest-item"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, city }));
                          setCitySuggestions([]);
                        }}
                      >
                        <span>📍 {city}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="co-field" style={{ position: "relative" }}>
                <label>Pincode *</label>
                <input
                  placeholder="360001"
                  value={form.pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setForm((prev) => ({ ...prev, pincode: val }));
                    setPinSuggestions(PINCODES.filter((p) => p.code.startsWith(val) && val.length > 2));
                  }}
                  onBlur={() => setTimeout(() => setPinSuggestions([]), 200)}
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="off"
                />

                {pinSuggestions.length > 0 && (
                  <div className="co-suggest-list">
                    {pinSuggestions.map((p) => (
                      <div
                        key={p.code}
                        className="co-suggest-item"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, pincode: p.code, city: p.city }));
                          setPinSuggestions([]);
                          setCitySuggestions([]);
                        }}
                      >
                        <span>📮 {p.code}</span>
                        <span className="co-suggest-secondary">{p.city}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="co-field" style={{ marginBottom: 0 }}>
              <label>Delivery Instructions (Optional)</label>
              <textarea
                placeholder="Ring bell twice, leave at door, etc."
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                rows={2}
                style={{ resize: "vertical" }}
              />
            </div>
          </div>

          <div className="co-section">
            <div className="co-section-title">🎟️ Coupon Code</div>
            {couponApplied ? (
              <div className="co-coupon-success">
                ✅ <strong>{couponApplied.code}</strong> applied - {couponApplied.label}
                <button
                  onClick={() => {
                    setCouponApplied(null);
                    setCouponCode("");
                  }}
                  style={{ marginLeft: "auto", border: "none", background: "transparent", color: "#E63946", cursor: "pointer", fontWeight: 800 }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="co-coupon-row">
                  <div className="co-field" style={{ flex: 1, marginBottom: 0 }}>
                    <input
                      placeholder="Enter coupon code (e.g. SAVE10)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    />
                  </div>
                  <button className="co-apply-btn" onClick={applyCoupon}>Apply</button>
                </div>

                {couponError && <div className="co-coupon-error">❌ {couponError}</div>}

                <div className="co-coupon-chips">
                  {Object.keys(COUPONS).map((code) => (
                    <span
                      key={code}
                      className="co-coupon-chip"
                      onClick={() => {
                        setCouponCode(code);
                        setCouponError("");
                      }}
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="co-section">
            <div className="co-section-title">💳 Payment Method</div>
            <div className="co-pay-methods">
              {[
                { key: "razorpay", icon: "💳", label: "Pay Online", sub: "Cards, UPI, NetBanking" },
                { key: "upi", icon: "📱", label: "UPI Direct", sub: "GPay, PhonePe, Paytm" },
                { key: "cod", icon: "💵", label: "Cash on Delivery", sub: "Pay when delivered" },
              ].map((method) => (
                <div
                  key={method.key}
                  className={`co-pay-method${payMethod === method.key ? " selected" : ""}`}
                  onClick={() => setPayMethod(method.key)}
                >
                  <div className="co-pay-method-icon">{method.icon}</div>
                  <div className="co-pay-method-label">{method.label}</div>
                  <div className="co-pay-method-sub">{method.sub}</div>
                </div>
              ))}
            </div>

            {payMethod === "upi" && (
              <div className="co-field" style={{ marginTop: 14, marginBottom: 0 }}>
                <label>UPI ID</label>
                <input placeholder="yourname@upi" />
              </div>
            )}
          </div>
        </div>

        <div className="co-summary">
          <div className="co-summary-title">Order Summary</div>

          {cart.map((item, index) => {
            const image = item.image || FOOD_IMAGES[item.id] || FOOD_IMAGES[1];

            const custom = [];
            if (item.customizations?.portion) custom.push(item.customizations.portion);
            if (item.customizations?.spice) custom.push(`Spice: ${item.customizations.spice}`);
            if (item.customizations?.extras?.length) custom.push(item.customizations.extras.join(", "));

            return (
              <div className="co-item-row" key={item.customId || `${item.id}-${index}`}>
                <img className="co-item-img" src={image} alt={item.name} />

                <div className="co-item-info">
                  <div className="co-item-name">{item.name}</div>
                  {custom.length > 0 && <div className="co-item-custom">{custom.join(" • ")}</div>}
                  <div className="co-item-qty">x{item.qty}</div>
                </div>

                <div className="co-item-price">₹{Math.round(item.price * item.qty)}</div>
              </div>
            );
          })}

          <div className="co-divider" />
          <div className="co-row"><span>Subtotal</span><span>₹{Math.round(subtotal)}</span></div>
          <div className="co-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span style={{ color: "#2DC653" }}>FREE</span> : `₹${Math.round(deliveryFee * 10)}`}</span></div>
          <div className="co-row"><span>Tax (8%)</span><span>₹{Math.round(tax)}</span></div>
          {discount > 0 && (
            <div className="co-row discount">
              <span>Discount ({couponApplied?.code})</span>
              <span>-₹{Math.round(discount)}</span>
            </div>
          )}

          <div className="co-total">
            <span>Total</span>
            <span>₹{Math.round(total)}</span>
          </div>

          <div className="co-desktop-only">
            <button className="co-place-btn" onClick={handlePlaceOrder} disabled={placing || cart.length === 0}>
              {placing
                ? <><div className="co-spinner" /> Processing...</>
                : payMethod === "razorpay"
                  ? `💳 Pay ₹${Math.round(total)}`
                  : payMethod === "upi"
                    ? `📱 Pay via UPI ₹${Math.round(total)}`
                    : `✅ Place Order · ₹${Math.round(total)} COD`
              }
            </button>

            <div className="co-secure">🔒 100% Secure & Encrypted Payment</div>

            {payMethod === "razorpay" && (
              <div className="co-payment-chips">
                {[
                  "VISA",
                  "Mastercard",
                  "UPI",
                  "GPay",
                  "Paytm",
                ].map((brand) => (
                  <span key={brand} className="co-payment-chip">{brand}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="co-mobile-cta">
        <div>
          <div className="co-mobile-amount">₹{Math.round(total)}</div>
          <div className="co-mobile-note">{itemCount} item{itemCount !== 1 ? "s" : ""} · secure payment</div>
        </div>
        <button className="co-place-btn" style={{ marginTop: 0, width: "auto", minWidth: 170 }} onClick={handlePlaceOrder} disabled={placing || cart.length === 0}>
          {placing ? "Processing..." : "Place order"}
        </button>
      </div>
    </div>
  );
}
