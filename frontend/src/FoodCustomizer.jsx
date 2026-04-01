// ─────────────────────────────────────────────────────────────────────────────
// FoodCustomizer.jsx
// Place in: frontend/src/FoodCustomizer.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ── Overlay ── */
.fc-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.65);
  backdrop-filter: blur(6px); z-index: 300;
  opacity: 0; pointer-events: none; transition: opacity .3s;
}
.fc-overlay.open { opacity: 1; pointer-events: all; }

/* ── Modal ── */
.fc-modal {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%) translateY(100%);
  width: 100%; max-width: 560px; background: var(--surface);
  border-radius: 28px 28px 0 0; z-index: 301; padding: 0;
  transition: transform .4s cubic-bezier(.34,1.2,.64,1);
  max-height: 92vh; overflow-y: auto;
}
.fc-modal.open { transform: translateX(-50%) translateY(0); }

/* ── Header ── */
.fc-header { position: sticky; top: 0; background: var(--surface); z-index: 1; padding: 20px 24px 0; border-radius: 28px 28px 0 0; }
.fc-handle { width: 40px; height: 4px; background: var(--border2); border-radius: 2px; margin: 0 auto 16px; }
.fc-img-wrap { position: relative; height: 200px; border-radius: 16px; overflow: hidden; margin-bottom: 16px; }
.fc-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
.fc-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 50%); }
.fc-img-name { position: absolute; bottom: 14px; left: 16px; font-family: var(--font-display); font-size: 1.5rem; font-weight: 900; color: #fff; }
.fc-img-price { position: absolute; bottom: 14px; right: 16px; font-family: var(--font-display); font-size: 1.3rem; font-weight: 900; color: var(--accent); }
.fc-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(0,0,0,.4); border: none; color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

/* ── Body ── */
.fc-body { padding: 0 24px 24px; }

/* ── Section ── */
.fc-section { margin-bottom: 24px; }
.fc-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.fc-section-title { font-weight: 700; font-size: .95rem; color: var(--text); display: flex; align-items: center; gap: 8px; }
.fc-section-badge { background: rgba(244,164,53,.12); border: 1px solid rgba(244,164,53,.25); color: var(--accent); font-size: .68rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; }

/* ── Spice level ── */
.fc-spice-row { display: flex; gap: 8px; }
.fc-spice-btn {
  flex: 1; padding: 11px 8px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--surface2); color: var(--muted); font-family: var(--font-body);
  font-size: .82rem; font-weight: 600; cursor: pointer; transition: all .2s;
  text-align: center;
}
.fc-spice-btn:hover { border-color: var(--accent); color: var(--text); }
.fc-spice-btn.selected { border-color: var(--accent); background: rgba(244,164,53,.1); color: var(--text); }

/* ── Extras / Toppings ── */
.fc-extras-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.fc-extra-btn {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--surface2); cursor: pointer; transition: all .2s;
}
.fc-extra-btn:hover { border-color: var(--accent); }
.fc-extra-btn.selected { border-color: var(--accent); background: rgba(244,164,53,.08); }
.fc-extra-check {
  width: 20px; height: 20px; border-radius: 6px; border: 2px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; flex-shrink: 0; transition: all .2s;
}
.fc-extra-btn.selected .fc-extra-check { background: var(--accent); border-color: var(--accent); color: #0A0A0A; }
.fc-extra-info { flex: 1; }
.fc-extra-name { font-size: .85rem; font-weight: 600; color: var(--text); }
.fc-extra-price { font-size: .75rem; color: var(--accent); font-weight: 700; margin-top: 1px; }

/* ── Portion size ── */
.fc-portion-row { display: flex; gap: 8px; }
.fc-portion-btn {
  flex: 1; padding: 12px 8px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--surface2); cursor: pointer; transition: all .2s; text-align: center;
  font-family: var(--font-body);
}
.fc-portion-btn:hover { border-color: var(--accent); }
.fc-portion-btn.selected { border-color: var(--accent); background: rgba(244,164,53,.1); }
.fc-portion-size { font-size: .88rem; font-weight: 700; color: var(--text); }
.fc-portion-price { font-size: .75rem; color: var(--accent); font-weight: 700; margin-top: 2px; }

/* ── Special instructions ── */
.fc-notes { width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); font-family: var(--font-body); font-size: .88rem; outline: none; resize: vertical; transition: border-color .2s; }
.fc-notes:focus { border-color: var(--accent); }
.fc-notes::placeholder { color: var(--muted); }

/* ── Quantity control ── */
.fc-qty-row { display: flex; align-items: center; justify-content: space-between; background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 12px 16px; }
.fc-qty-label { font-weight: 600; font-size: .9rem; color: var(--text); }
.fc-qty-controls { display: flex; align-items: center; gap: 16px; }
.fc-qty-btn { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
.fc-qty-btn:hover { background: var(--accent); border-color: var(--accent); color: #0A0A0A; }
.fc-qty-num { font-family: var(--font-display); font-size: 1.2rem; font-weight: 900; color: var(--text); min-width: 24px; text-align: center; }

/* ── Footer ── */
.fc-footer { position: sticky; bottom: 0; background: var(--surface); padding: 16px 24px 24px; border-top: 1px solid var(--border); }
.fc-add-btn {
  width: 100%; padding: 16px; border-radius: 14px; border: none;
  background: var(--accent); color: #0A0A0A; font-family: var(--font-body);
  font-size: 1rem; font-weight: 700; cursor: pointer; transition: all .22s;
  display: flex; align-items: center; justify-content: center; gap: 10px;
}
.fc-add-btn:hover { background: #ffb84d; transform: scale(1.01); }
.fc-total-preview { display: flex; justify-content: space-between; font-size: .82rem; color: var(--muted); margin-bottom: 10px; }
.fc-total-preview strong { color: var(--text); font-family: var(--font-display); font-size: 1rem; }

/* ── Reference style overrides ── */
.fc-overlay { background: rgba(2, 10, 20, .82); backdrop-filter: blur(9px); }

.fc-modal {
  background: linear-gradient(165deg, rgba(2,13,24,.96) 0%, rgba(7,21,38,.86) 100%);
  border: 1px solid rgba(255,255,255,.16);
  border-bottom: none;
  border-radius: 10px 10px 0 0;
}

.fc-header {
  background: rgba(2,13,24,.92);
  border-radius: 10px 10px 0 0;
}

.fc-handle { background: rgba(255,255,255,.26); }

.fc-img-wrap,
.fc-notes,
.fc-qty-row,
.fc-extra-btn,
.fc-portion-btn,
.fc-spice-btn,
.fc-add-btn,
.fc-close,
.fc-section-badge,
.fc-extra-check,
.fc-qty-btn,
.fc-footer {
  border-radius: 4px;
}

.fc-img-wrap { border: 1px solid rgba(255,255,255,.16); }

.fc-img-name,
.fc-img-price,
.fc-section-title,
.fc-qty-label,
.fc-qty-num,
.fc-total-preview strong {
  color: #fff;
}

.fc-img-name { font-family: 'Cormorant Garamond', serif; letter-spacing: .4px; font-size: 1.85rem; }

.fc-section-title,
.fc-extra-name,
.fc-portion-size,
.fc-qty-label,
.fc-add-btn,
.fc-section-badge,
.fc-total-preview {
  font-family: 'DM Sans', sans-serif;
}

.fc-section-badge,
.fc-add-btn,
.fc-extra-price,
.fc-portion-price,
.fc-total-preview {
  text-transform: uppercase;
  letter-spacing: .9px;
}

.fc-section-badge,
.fc-extra-btn,
.fc-portion-btn,
.fc-spice-btn,
.fc-notes,
.fc-qty-row,
.fc-footer,
.fc-close,
.fc-qty-btn {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.18);
  color: rgba(255,255,255,.82);
}

.fc-add-btn {
  font-size: .78rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 12px 24px rgba(244,164,53,.24);
}

.fc-extra-btn.selected,
.fc-portion-btn.selected,
.fc-spice-btn.selected {
  background: rgba(244,164,53,.16);
  border-color: var(--accent);
  box-shadow: 0 10px 20px rgba(244,164,53,.2);
}

.fc-notes::placeholder { color: rgba(255,255,255,.48); }

.fc-total-preview { color: rgba(255,255,255,.64); font-size: .7rem; }

/* Unified promo customizer polish */
.fc-modal {
  max-width: 600px;
  border-radius: 8px 8px 0 0;
}

.fc-header {
  border-radius: 8px 8px 0 0;
}

.fc-add-btn,
.fc-section-badge,
.fc-close,
.fc-qty-btn,
.fc-portion-btn,
.fc-spice-btn,
.fc-extra-btn {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.fc-section-title {
  letter-spacing: 0.6px;
}

.fc-add-btn {
  min-height: 50px;
  box-shadow: 0 14px 30px rgba(246, 181, 21, 0.26);
}

.fc-extras-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.fc-modal.open {
  box-shadow: 0 -22px 54px rgba(0, 0, 0, 0.5);
}

@media (max-width: 640px) {
  .fc-header {
    padding: 16px 16px 0;
  }

  .fc-body {
    padding: 0 16px 18px;
  }

  .fc-footer {
    padding: 14px 16px 18px;
  }

  .fc-extras-grid {
    grid-template-columns: 1fr;
  }

  .fc-spice-row,
  .fc-portion-row {
    flex-direction: column;
  }

  .fc-qty-row {
    padding: 10px 12px;
  }
}
`;

// ── Customization options per category ────────────────────────────────────────
const CATEGORY_OPTIONS = {
  burger: {
    extras: [
      { id: "extra_cheese",  name: "Extra Cheese",    price: 1.50, emoji: "🧀" },
      { id: "extra_patty",   name: "Extra Patty",     price: 3.00, emoji: "🥩" },
      { id: "bacon",         name: "Add Bacon",       price: 2.00, emoji: "🥓" },
      { id: "avocado",       name: "Add Avocado",     price: 1.50, emoji: "🥑" },
      { id: "no_onion",      name: "No Onion",        price: 0,    emoji: "🚫" },
      { id: "no_pickles",    name: "No Pickles",      price: 0,    emoji: "🚫" },
    ],
    portions: [
      { key: "regular", label: "Regular", multiplier: 1.0 },
      { key: "large",   label: "Large",   multiplier: 1.3 },
      { key: "xl",      label: "XL",      multiplier: 1.6 },
    ],
    hasSpice: false,
  },
  pizza: {
    extras: [
      { id: "extra_cheese",  name: "Extra Cheese",    price: 2.00, emoji: "🧀" },
      { id: "mushrooms",     name: "Mushrooms",       price: 1.50, emoji: "🍄" },
      { id: "olives",        name: "Olives",          price: 1.00, emoji: "🫒" },
      { id: "jalapenos",     name: "Jalapeños",       price: 1.00, emoji: "🌶️" },
      { id: "thin_crust",    name: "Thin Crust",      price: 0,    emoji: "🍕" },
      { id: "stuffed_crust", name: "Stuffed Crust",   price: 2.50, emoji: "🧀" },
    ],
    portions: [
      { key: "small",  label: "Small (6\")",  multiplier: 0.75 },
      { key: "medium", label: "Medium (9\")",  multiplier: 1.0  },
      { key: "large",  label: "Large (12\")", multiplier: 1.4  },
    ],
    hasSpice: false,
  },
  sushi: {
    extras: [
      { id: "extra_wasabi",  name: "Extra Wasabi",   price: 0.50, emoji: "🟢" },
      { id: "spicy_mayo",    name: "Spicy Mayo",     price: 1.00, emoji: "🌶️" },
      { id: "extra_ginger",  name: "Extra Ginger",   price: 0.50, emoji: "🌸" },
      { id: "soy_sauce",     name: "Extra Soy Sauce",price: 0,    emoji: "🍶" },
    ],
    portions: [
      { key: "6pc",  label: "6 Pieces",  multiplier: 0.6 },
      { key: "8pc",  label: "8 Pieces",  multiplier: 1.0 },
      { key: "12pc", label: "12 Pieces", multiplier: 1.4 },
    ],
    hasSpice: true,
  },
  salad: {
    extras: [
      { id: "extra_protein", name: "Extra Protein",  price: 2.50, emoji: "💪" },
      { id: "croutons",      name: "Croutons",       price: 0.75, emoji: "🍞" },
      { id: "dressing_side", name: "Dressing on Side",price: 0,   emoji: "🫙" },
      { id: "no_nuts",       name: "No Nuts",        price: 0,    emoji: "🚫" },
    ],
    portions: [
      { key: "half",  label: "Half",  multiplier: 0.6 },
      { key: "full",  label: "Full",  multiplier: 1.0 },
      { key: "large", label: "Large", multiplier: 1.4 },
    ],
    hasSpice: false,
  },
  dessert: {
    extras: [
      { id: "extra_sauce",   name: "Extra Sauce",    price: 0.75, emoji: "🍫" },
      { id: "ice_cream",     name: "Add Ice Cream",  price: 2.00, emoji: "🍨" },
      { id: "whipped_cream", name: "Whipped Cream",  price: 1.00, emoji: "🍦" },
      { id: "sprinkles",     name: "Sprinkles",      price: 0.50, emoji: "🎊" },
    ],
    portions: [
      { key: "regular", label: "Regular", multiplier: 1.0 },
      { key: "large",   label: "Large",   multiplier: 1.4 },
    ],
    hasSpice: false,
  },
};

const SPICE_LEVELS = [
  { key: "mild",   label: "🟡 Mild",   desc: "No heat" },
  { key: "medium", label: "🟠 Medium", desc: "Balanced" },
  { key: "hot",    label: "🔴 Hot",    desc: "Spicy!" },
  { key: "extra",  label: "🌶️ Extra",  desc: "Fire!" },
];

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

function FoodCustomizerInner({ item, open, onClose, onAddToCart }) {
  const defaultOptions = CATEGORY_OPTIONS[item?.category] || CATEGORY_OPTIONS.burger;
  const defaultPortion =
    defaultOptions.portions[Math.floor(defaultOptions.portions.length / 2)]?.key ||
    "regular";

  const [spice,   setSpice]   = useState("medium");
  const [extras,  setExtras]  = useState([]);
  const [portion, setPortion] = useState(defaultPortion);
  const [notes,   setNotes]   = useState("");
  const [qty,     setQty]     = useState(1);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "fc-css"; s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.getElementById("fc-css")?.remove();
  }, []);

  // Close on escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!item) return null;

  const opts     = CATEGORY_OPTIONS[item.category] || CATEGORY_OPTIONS.burger;
  const portionObj = opts.portions.find(p => p.key === portion) || opts.portions[0];

  // Calculate total price
  const basePrice    = item.price * portionObj.multiplier;
  const extrasPrice  = extras.reduce((s, id) => {
    const e = opts.extras.find(ex => ex.id === id);
    return s + (e?.price || 0);
  }, 0);
  const itemTotal    = (basePrice + extrasPrice) * qty;

  const toggleExtra = (id) => {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    const customizations = {
      spice:   opts.hasSpice ? spice : null,
      extras:  extras.map(id => opts.extras.find(e => e.id === id)?.name).filter(Boolean),
      portion: portionObj.label,
      notes:   notes.trim() || null,
    };

    onAddToCart({
      ...item,
      price:          basePrice + extrasPrice,
      qty,
      customizations,
      customId:       `${item.id}-${Date.now()}`, // unique key for cart
    });
    onClose();
  };

  const img = item.image || FOOD_IMAGES[item.id] || FOOD_IMAGES[1];

  return (
    <>
      <div className={`fc-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`fc-modal${open ? " open" : ""}`}>

        {/* Header */}
        <div className="fc-header">
          <div className="fc-handle" />
          <div className="fc-img-wrap">
            <img src={img} alt={item.name} />
            <div className="fc-img-overlay" />
            <div className="fc-img-name">{item.name}</div>
            <div className="fc-img-price">₹{Math.round(item.price)}</div>
            <button className="fc-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="fc-body">

          {/* Portion Size */}
          <div className="fc-section">
            <div className="fc-section-header">
              <div className="fc-section-title">📏 Portion Size</div>
              <div className="fc-section-badge">Choose 1</div>
            </div>
            <div className="fc-portion-row">
              {opts.portions.map(p => (
                <div
                  key={p.key}
                  className={`fc-portion-btn${portion === p.key ? " selected" : ""}`}
                  onClick={() => setPortion(p.key)}
                >
                  <div className="fc-portion-size">{p.label}</div>
                  <div className="fc-portion-price">
                    {p.multiplier === 1 ? "Base" : p.multiplier > 1 ? `+${((p.multiplier - 1) * 100).toFixed(0)}%` : `-${((1 - p.multiplier) * 100).toFixed(0)}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spice Level */}
          {opts.hasSpice && (
            <div className="fc-section">
              <div className="fc-section-header">
                <div className="fc-section-title">🌶️ Spice Level</div>
                <div className="fc-section-badge">Choose 1</div>
              </div>
              <div className="fc-spice-row">
                {SPICE_LEVELS.map(s => (
                  <div
                    key={s.key}
                    className={`fc-spice-btn${spice === s.key ? " selected" : ""}`}
                    onClick={() => setSpice(s.key)}
                  >
                    {s.label}
                    <div style={{ fontSize: ".65rem", color: "var(--muted)", marginTop: 3 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extras / Toppings */}
          <div className="fc-section">
            <div className="fc-section-header">
              <div className="fc-section-title">✨ Add-ons & Extras</div>
              <div className="fc-section-badge">Optional</div>
            </div>
            <div className="fc-extras-grid">
              {opts.extras.map(ex => (
                <div
                  key={ex.id}
                  className={`fc-extra-btn${extras.includes(ex.id) ? " selected" : ""}`}
                  onClick={() => toggleExtra(ex.id)}
                >
                  <div className="fc-extra-check">{extras.includes(ex.id) ? "✓" : ""}</div>
                  <div className="fc-extra-info">
                    <div className="fc-extra-name">{ex.emoji} {ex.name}</div>
                    <div className="fc-extra-price">
                      {ex.price === 0 ? "Free" : `+$${ex.price.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div className="fc-section">
            <div className="fc-section-header">
              <div className="fc-section-title">📝 Special Instructions</div>
              <div className="fc-section-badge">Optional</div>
            </div>
            <textarea
              className="fc-notes"
              placeholder="Any special requests? (e.g. less oil, extra crispy, no cilantro...)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Quantity */}
          <div className="fc-section">
            <div className="fc-qty-row">
              <div className="fc-qty-label">Quantity</div>
              <div className="fc-qty-controls">
                <button className="fc-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div className="fc-qty-num">{qty}</div>
                <button className="fc-qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fc-footer">
          <div className="fc-total-preview">
            <span>{qty} × {item.name} {portionObj.label !== "Regular" && portionObj.label !== "Full" && portionObj.label !== "8 Pieces" ? `(${portionObj.label})` : ""}</span>
            <strong>${itemTotal.toFixed(2)}</strong>
          </div>
          <button className="fc-add-btn" onClick={handleAdd}>
            Add to Cart · ${itemTotal.toFixed(2)}
          </button>
        </div>
      </div>
    </>
  );
}

export default function FoodCustomizer(props) {
  const resetKey = `${props.item?.id || "none"}-${props.open ? "open" : "closed"}`;
  return <FoodCustomizerInner key={resetKey} {...props} />;
}

/*
══════════════════════════════════════════════════════════
HOW TO ADD TO FoodDelivery.jsx
══════════════════════════════════════════════════════════

1. Import at top of FoodDelivery.jsx:
   import FoodCustomizer from './FoodCustomizer';

2. Add state in FoodDelivery():
   const [customizerItem, setCustomizerItem] = useState(null);
   const [customizerOpen, setCustomizerOpen] = useState(false);

3. Add openCustomizer function:
   const openCustomizer = (item) => {
     setCustomizerItem(item);
     setCustomizerOpen(true);
   };

4. Update FoodCard to open customizer instead of directly adding:
   In FoodCard component, change the add button onClick:
   onClick={() => openCustomizer(item)}
   (pass openCustomizer as prop: addToCart={openCustomizer})

5. Add FoodCustomizer at bottom of return (before closing div):
   <FoodCustomizer
     item={customizerItem}
     open={customizerOpen}
     onClose={() => setCustomizerOpen(false)}
     onAddToCart={(customizedItem) => {
       addToCart(customizedItem);
       showToast(`${customizedItem.name} added! 🎉`);
     }}
   />
*/
