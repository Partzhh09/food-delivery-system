// ─────────────────────────────────────────────────────────────────────────────
// HeroSection.jsx  — Animated hero for Fork.Fleet
// Place in: frontend/src/HeroSection.jsx
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

const WORDS = ["Delivered.", "Fresh.", "Fast.", "Tonight.", "Now."];

const FALLBACK_CARDS = [
  { name: "Smash Burger",  img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80", tag: "@burger lover",  rot: -18, x: -320, y: 40 },
  { name: "Truffle Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80", tag: "@pizza fanatic", rot: -8,  x: -170, y: 60 },
  { name: "Dragon Roll",   img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&q=80", tag: "@sushi time",    rot:  0,  x: -20,  y: 70 },
  { name: "Harvest Bowl",  img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80", tag: "@eat healthy",   rot:  9,  x: 130,  y: 55 },
  { name: "Lava Cake",     img: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=300&q=80", tag: "@dessert first", rot: 20,  x: 280,  y: 35 },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600;700;900&display=swap');

.ffh-root {
  position: relative;
  min-height: 100vh;
  background: #F7F5F0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 72px;
}

/* noise grain */
.ffh-root::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* ambient light blobs */
.ffh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
}

/* ── Content wrapper ── */
.ffh-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 72px 24px 0;
}

/* ── Pill ── */
.ffh-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 100px;
  padding: 7px 16px 7px 10px;
  font-family: 'Outfit', sans-serif;
  font-size: .77rem;
  font-weight: 600;
  color: #555;
  letter-spacing: .2px;
  box-shadow: 0 2px 14px rgba(0,0,0,.06);
  margin-bottom: 30px;
  opacity: 0;
  animation: ffhUp .6s .1s cubic-bezier(.34,1.4,.64,1) forwards;
}
.ffh-pill-dot {
  width: 8px; height: 8px;
  background: #F4A435;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(244,164,53,.2);
  animation: ffhPulse 2s ease-in-out infinite;
}
@keyframes ffhPulse { 0%,100%{box-shadow:0 0 0 3px rgba(244,164,53,.2);}50%{box-shadow:0 0 0 7px rgba(244,164,53,0);} }

/* ── Headline ── */
.ffh-h1 {
  font-family: 'Instrument Serif', serif;
  font-size: clamp(3rem, 6.5vw, 6rem);
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -2.5px;
  color: #0f0f0f;
  max-width: 860px;
  margin: 0 0 6px;
  opacity: 0;
  animation: ffhUp .7s .25s cubic-bezier(.34,1.15,.64,1) forwards;
}

/* ── Animated word slot ── */
.ffh-word-slot {
  display: inline-block;
  position: relative;
  vertical-align: bottom;
  min-width: 240px;
  height: 1.1em;
  overflow: hidden;
}
.ffh-word {
  position: absolute;
  left: 0; bottom: 0;
  font-style: italic;
  color: #F4A435;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity .35s ease, transform .4s cubic-bezier(.34,1.3,.64,1);
  will-change: transform, opacity;
}
.ffh-word.in  { opacity: 1; transform: translateY(0); }
.ffh-word.out { opacity: 0; transform: translateY(-50px); transition: opacity .25s ease, transform .3s ease; }

/* ── Sub ── */
.ffh-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 1.05rem;
  color: #888;
  font-weight: 400;
  line-height: 1.65;
  max-width: 420px;
  margin: 48px 0 34px;
  opacity: 0;
  animation: ffhUp .6s .5s ease forwards;
}

/* ── Buttons ── */
.ffh-btns {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  animation: ffhUp .6s .65s ease forwards;
}
.ffh-btn-dark {
  display: inline-flex; align-items: center; gap: 8px;
  background: #0f0f0f; color: #fff;
  padding: 15px 30px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-size: .9rem; font-weight: 600;
  border: none; cursor: pointer;
  transition: all .25s cubic-bezier(.34,1.3,.64,1);
  letter-spacing: .1px;
}
.ffh-btn-dark:hover {
  background: #F4A435; color: #0f0f0f;
  transform: scale(1.04);
  box-shadow: 0 8px 32px rgba(244,164,53,.3);
}
.ffh-btn-light {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: #666;
  padding: 14px 24px; border-radius: 100px;
  font-family: 'Outfit', sans-serif; font-size: .9rem; font-weight: 500;
  border: 1.5px solid rgba(0,0,0,.12); cursor: pointer;
  transition: all .22s ease;
}
.ffh-btn-light:hover {
  background: #fff; border-color: rgba(0,0,0,.2); color: #111;
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0,0,0,.06);
}

/* ── Cards stage ── */
.ffh-stage {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 320px;
  margin-top: 56px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Food card ── */
.ffh-card {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 20px;
  overflow: visible;
  cursor: pointer;
  will-change: transform;
  transition: transform .35s cubic-bezier(.34,1.3,.64,1), box-shadow .3s ease;
}
.ffh-card-inner {
  width: 100%; height: 100%;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 50px rgba(0,0,0,.18), 0 3px 12px rgba(0,0,0,.1);
  transition: box-shadow .3s ease;
}
.ffh-card:hover .ffh-card-inner {
  box-shadow: 0 28px 70px rgba(0,0,0,.25);
}
.ffh-card img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .4s ease;
}
.ffh-card:hover img { transform: scale(1.07); }

/* name label */
.ffh-card-name {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(0,0,0,.72) 0%, transparent 100%);
  padding: 18px 10px 9px;
  font-family: 'Outfit', sans-serif;
  font-size: .7rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  border-radius: 0 0 20px 20px;
}

/* floating tag */
.ffh-card-tag {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(6px);
  background: #fff;
  border: 1px solid rgba(0,0,0,.09);
  border-radius: 100px;
  padding: 5px 13px;
  font-family: 'Outfit', sans-serif;
  font-size: .71rem;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
  box-shadow: 0 4px 18px rgba(0,0,0,.1);
  opacity: 0;
  transition: opacity .25s ease, transform .25s ease;
  pointer-events: none;
}
.ffh-card:hover .ffh-card-tag {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Stats bar ── */
.ffh-stats {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 32px 24px 60px;
  opacity: 0;
  animation: ffhUp .5s 1.3s ease forwards;
}
.ffh-stat {
  text-align: center;
  padding: 0 36px;
}
.ffh-stat + .ffh-stat {
  border-left: 1px solid rgba(0,0,0,.1);
}
.ffh-stat-n {
  font-family: 'Instrument Serif', serif;
  font-size: 1.9rem;
  font-weight: 400;
  color: #111;
  letter-spacing: -.5px;
  line-height: 1;
}
.ffh-stat-l {
  font-family: 'Outfit', sans-serif;
  font-size: .73rem;
  color: #aaa;
  font-weight: 500;
  margin-top: 4px;
  letter-spacing: .2px;
}

/* ── Scroll cue ── */
.ffh-scroll {
  position: absolute;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  z-index: 2;
  opacity: 0;
  animation: ffhUp .5s 1.5s ease forwards;
}
.ffh-scroll-bar {
  width: 1.5px;
  height: 36px;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,.22));
  animation: ffhScroll 2.2s ease-in-out infinite;
}
@keyframes ffhScroll {
  0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
  50%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
  51%  { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
}
.ffh-scroll-lbl {
  font-family: 'Outfit', sans-serif;
  font-size: .6rem;
  color: #bbb;
  text-transform: uppercase;
  letter-spacing: 2.5px;
}

@keyframes ffhUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0);    }
}

@media (max-width: 768px) {
  .ffh-h1       { font-size: clamp(2.2rem, 9vw, 3.2rem); letter-spacing: -1.2px; }
  .ffh-stage    { height: 250px; }
  .ffh-card     { width: 120px; height: 120px; }
  .ffh-stat     { padding: 0 18px; }
  .ffh-stat-n   { font-size: 1.4rem; }
  .ffh-word-slot{ min-width: 160px; }
}

/* Unified promo hero refresh */
.ffh-root {
  background: radial-gradient(900px 420px at 8% 0%, rgba(246, 181, 21, 0.18), transparent 70%), #050a11;
}

.ffh-root::after {
  opacity: 0.05;
}

.ffh-content {
  align-items: flex-start;
  text-align: left;
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 64px clamp(16px, 4vw, 46px) 0;
}

.ffh-pill {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.82);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  font-size: 0.66rem;
}

.ffh-pill-dot {
  background: #f6b515;
}

.ffh-h1 {
  color: #fff;
  font-family: 'Outfit', sans-serif;
  text-transform: uppercase;
  font-size: clamp(3.8rem, 14vw, 10rem);
  letter-spacing: 1.8px;
  line-height: 0.82;
  max-width: 720px;
}

.ffh-word {
  color: #f6b515;
  font-style: normal;
}

.ffh-sub {
  color: rgba(255, 255, 255, 0.66);
  max-width: 420px;
  margin: 24px 0 28px;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.8px;
}

.ffh-btn-dark,
.ffh-btn-light {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.ffh-btn-dark {
  background: #f6b515;
  color: #0a0a0a;
}

.ffh-btn-dark:hover {
  background: #ffcd2e;
  box-shadow: 0 12px 30px rgba(246, 181, 21, 0.3);
}

.ffh-btn-light {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.ffh-stage {
  height: 360px;
  margin-top: 36px;
}

.ffh-card {
  border-radius: 8px;
}

.ffh-card-inner {
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.ffh-card-name {
  font-size: 0.66rem;
  letter-spacing: 0.9px;
  text-transform: uppercase;
}

.ffh-card-tag {
  border-radius: 4px;
  font-size: 0.62rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.ffh-stats {
  justify-content: flex-start;
  width: min(1200px, 100%);
  margin: 0 auto;
  padding: 26px clamp(16px, 4vw, 46px) 64px;
}

.ffh-stat + .ffh-stat {
  border-left-color: rgba(255, 255, 255, 0.2);
}

.ffh-stat-n {
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  letter-spacing: 1px;
}

.ffh-stat-l {
  color: rgba(255, 255, 255, 0.62);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.63rem;
}

.ffh-scroll-lbl {
  color: rgba(255, 255, 255, 0.55);
}

@media (max-width: 900px) {
  .ffh-content {
    padding-top: 48px;
  }

  .ffh-stage {
    height: 280px;
  }

  .ffh-card {
    width: 116px;
    height: 116px;
  }

  .ffh-stats {
    flex-wrap: wrap;
    row-gap: 14px;
  }
}

@media (max-width: 640px) {
  .ffh-content {
    align-items: center;
    text-align: center;
  }

  .ffh-word-slot {
    min-width: 140px;
  }

  .ffh-btns {
    width: 100%;
    flex-direction: column;
  }

  .ffh-btn-dark,
  .ffh-btn-light {
    width: 100%;
    justify-content: center;
  }

  .ffh-stage {
    display: none;
  }

  .ffh-stats {
    justify-content: center;
    padding-bottom: 80px;
  }

  .ffh-stat {
    padding: 0 14px;
  }

  .ffh-stat + .ffh-stat {
    border-left: 0;
  }

  .ffh-scroll {
    display: none;
  }
}
`;

export default function HeroSection({ setActivePage, liveMenu = [] }) {
  const [wordIdx,   setWordIdx]   = useState(0);
  const [wordPhase, setWordPhase] = useState("in");  // in | out
  const [cardsIn,   setCardsIn]   = useState(false);

  // Inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "ffh-css";
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.getElementById("ffh-css")?.remove();
  }, []);

  // Fan cards in after mount
  useEffect(() => {
    const t = setTimeout(() => setCardsIn(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Cycle headline words
  useEffect(() => {
    const id = setInterval(() => {
      setWordPhase("out");
      setTimeout(() => {
        setWordIdx(i => (i + 1) % WORDS.length);
        setWordPhase("in");
      }, 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Build card data
  const cards = FALLBACK_CARDS.map((fc, i) => ({
    ...fc,
    name: liveMenu[i]?.name || fc.name,
    img:  liveMenu[i]?.image || fc.img,
  }));

  return (
    <section className="ffh-root">

      {/* Ambient blobs */}
      <div className="ffh-blob" style={{ width: 560, height: 560, background: "rgba(244,164,53,.07)", top: -140, right: -120 }} />
      <div className="ffh-blob" style={{ width: 400, height: 400, background: "rgba(255,107,53,.05)", bottom: -60,  left: -80  }} />
      <div className="ffh-blob" style={{ width: 300, height: 300, background: "rgba(45,198,83,.04)",  top: "40%",   left: "10%" }} />

      {/* ── Hero content ── */}
      <div className="ffh-content">

        {/* Live pill */}
        <div className="ffh-pill">
          <span className="ffh-pill-dot" />
          Delivering in 30 mins · Rajkot &amp; beyond
        </div>

        {/* Headline */}
        <h1 className="ffh-h1">
          Food you love,
          <br />
          <span className="ffh-word-slot" aria-live="polite">
            {WORDS.map((w, i) => (
              <span
                key={w}
                className={`ffh-word${i === wordIdx ? ` ${wordPhase}` : ""}`}
              >
                {w}
              </span>
            ))}
          </span>
        </h1>

        {/* Subtext */}
        <p className="ffh-sub">
          Order from our finest dishes. Fresh ingredients,
          bold flavours — right at your doorstep, fast.
        </p>

        {/* CTAs */}
        <div className="ffh-btns">
          <button className="ffh-btn-dark" onClick={() => setActivePage("menu")}>
            Order Now &nbsp;→
          </button>
          <button className="ffh-btn-light" onClick={() => setActivePage("how")}>
            How it works
          </button>
        </div>
      </div>

      {/* ── Food cards fan ── */}
      <div className="ffh-stage">
        {cards.map((card, i) => {
          const delay  = 0.55 + i * 0.07;
          const zIndex = i === 2 ? 5 : i < 2 ? i + 1 : 5 - (i - 2);

          const finalTransform  = `translateX(${card.x}px) rotate(${card.rot}deg) translateY(${card.y - 150}px)`;
          const initialTransform = `translateX(${card.x * 0.2}px) rotate(0deg) translateY(100px)`;

          return (
            <div
              key={i}
              className="ffh-card"
              style={{
                transform:  cardsIn ? finalTransform : initialTransform,
                opacity:    cardsIn ? 1 : 0,
                zIndex,
                transition: `transform .85s ${delay}s cubic-bezier(.34,1.15,.64,1), opacity .5s ${delay}s ease`,
              }}
              onClick={() => setActivePage("menu")}
            >
              <div className="ffh-card-tag">{card.tag}</div>
              <div className="ffh-card-inner">
                <img src={card.img} alt={card.name} loading="lazy" />
                <div className="ffh-card-name">{card.name}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Stats ── */}
      <div className="ffh-stats">
        {[
          { n: "4.9★",  l: "Average Rating"    },
          { n: "2,400+",l: "Happy Customers"    },
          { n: "30 min",l: "Avg Delivery Time"  },
          { n: "9+",    l: "Signature Dishes"   },
        ].map((s, i) => (
          <div key={i} className="ffh-stat">
            <div className="ffh-stat-n">{s.n}</div>
            <div className="ffh-stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Scroll cue */}
      <div className="ffh-scroll">
        <div className="ffh-scroll-bar" />
        <div className="ffh-scroll-lbl">Scroll</div>
      </div>

    </section>
  );
}

/*
══════════════════════════════════════════════════════════════
HOW TO ADD IN FoodDelivery.jsx — 3 steps
══════════════════════════════════════════════════════════════

STEP 1 — Import at top of FoodDelivery.jsx:
  import HeroSection from './HeroSection';

STEP 2 — In your HomePage component, find the existing hero
  section. It will look like:
    <section className="hero"> ... big heading ... </section>
  Replace THAT entire <section>...</section> block with:
    <HeroSection setActivePage={setActivePage} liveMenu={liveMenu} />

STEP 3 — Make sure HomePage receives setActivePage + liveMenu
  as props and passes them down. Already done if you're using
  the current FoodDelivery.jsx structure.

Done! The rest of the page (menu, how-it-works, etc.)
stays exactly as it was — only the hero is replaced.
*/
