// ─────────────────────────────────────────────────────────────────────────────
// FoodBill.jsx  —  Beautiful invoice shown after order is placed
// Place in: frontend/src/FoodBill.jsx
//
// HOW TO USE — in CheckoutPage.jsx:
//   1. import FoodBill from './FoodBill';
//   2. Replace the success screen JSX with:
//      <FoodBill order={success} onTrack={() => setActivePage("orders")} onHome={() => setActivePage("menu")} />
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');

.bill-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px 80px;
  padding-top: 90px;
}

/* ── Confetti burst ── */
.bill-confetti {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}
.conf-piece {
  position: absolute;
  top: -10px;
  width: 8px; height: 12px;
  border-radius: 2px;
  animation: confFall linear both;
}
@keyframes confFall {
  0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
  80%  { opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
}

/* ── Success header ── */
.bill-success-header {
  text-align: center;
  margin-bottom: 32px;
  animation: billFadeUp .6s cubic-bezier(.34,1.3,.64,1) both;
}
.bill-success-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 12px;
  animation: billIconPop .7s .1s cubic-bezier(.34,1.6,.64,1) both;
}
@keyframes billIconPop {
  from { transform: scale(0) rotate(-30deg); }
  to   { transform: scale(1) rotate(0deg); }
}
.bill-success-title {
  font-family: 'Instrument Serif', serif;
  font-size: 2.4rem; font-weight: 400;
  color: var(--text); letter-spacing: -1px;
  margin-bottom: 6px;
}
.bill-success-sub {
  color: var(--muted); font-size: .92rem;
  font-family: 'Syne', sans-serif;
}

/* ── Bill card ── */
.bill-card {
  width: 100%; max-width: 560px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 80px var(--shadow);
  animation: billFadeUp .7s .15s cubic-bezier(.34,1.2,.64,1) both;
  position: relative;
}

/* ── Bill top banner ── */
.bill-top {
  background: #0A0A0A;
  padding: 28px 32px 24px;
  position: relative;
  overflow: hidden;
}
[data-theme="light"] .bill-top {
  background: linear-gradient(135deg, #1A1200, #261800);
}
.bill-top-glow {
  position: absolute;
  right: -60px; top: -60px;
  width: 220px; height: 220px;
  background: radial-gradient(circle, rgba(244,164,53,.25) 0%, transparent 70%);
  pointer-events: none;
}
.bill-brand {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 20px;
}
.bill-brand-logo {
  font-family: 'Instrument Serif', serif;
  font-size: 1.5rem; font-weight: 400; color: #fff;
  letter-spacing: -.5px;
}
.bill-brand-logo span { color: #F4A435; font-style: italic; }
.bill-brand-tag {
  background: rgba(244,164,53,.15);
  border: 1px solid rgba(244,164,53,.25);
  color: #F4A435; font-size: .65rem; font-weight: 700;
  padding: 3px 10px; border-radius: 50px;
  font-family: 'Syne', sans-serif;
  text-transform: uppercase; letter-spacing: 1px;
}
.bill-meta-row {
  display: flex; justify-content: space-between; align-items: flex-end;
}
.bill-order-id {
  font-family: 'Instrument Serif', serif;
  font-size: 2.2rem; font-weight: 400;
  color: #fff; letter-spacing: -1px; line-height: 1;
}
.bill-order-id span { color: #F4A435; font-style: italic; }
.bill-meta-right { text-align: right; }
.bill-date {
  font-size: .78rem; color: rgba(255,255,255,.5);
  font-family: 'Syne', sans-serif; margin-bottom: 4px;
}
.bill-status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(45,198,83,.15);
  border: 1px solid rgba(45,198,83,.25);
  color: #2DC653; padding: 5px 12px; border-radius: 50px;
  font-size: .72rem; font-weight: 700;
  font-family: 'Syne', sans-serif;
}

/* ── Zigzag border ── */
.bill-zigzag {
  width: 100%;
  height: 16px;
  background: var(--surface);
  position: relative;
  margin-top: -1px;
}
.bill-zigzag::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 16px;
  background: #0A0A0A;
  clip-path: polygon(
    0% 0%, 2.5% 100%, 5% 0%, 7.5% 100%, 10% 0%,
    12.5% 100%, 15% 0%, 17.5% 100%, 20% 0%,
    22.5% 100%, 25% 0%, 27.5% 100%, 30% 0%,
    32.5% 100%, 35% 0%, 37.5% 100%, 40% 0%,
    42.5% 100%, 45% 0%, 47.5% 100%, 50% 0%,
    52.5% 100%, 55% 0%, 57.5% 100%, 60% 0%,
    62.5% 100%, 65% 0%, 67.5% 100%, 70% 0%,
    72.5% 100%, 75% 0%, 77.5% 100%, 80% 0%,
    82.5% 100%, 85% 0%, 87.5% 100%, 90% 0%,
    92.5% 100%, 95% 0%, 97.5% 100%, 100% 0%
  );
}
[data-theme="light"] .bill-zigzag::before {
  background: linear-gradient(135deg, #1A1200, #261800);
}

/* ── Bill body ── */
.bill-body { padding: 24px 32px; }

/* ── Customer info ── */
.bill-customer {
  display: flex; align-items: flex-start; gap: 16px;
  padding: 16px; border-radius: 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  margin-bottom: 24px;
}
.bill-customer-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(244,164,53,.15);
  border: 1px solid rgba(244,164,53,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; flex-shrink: 0;
}
.bill-customer-name {
  font-weight: 700; font-size: .95rem;
  color: var(--text); font-family: 'Syne', sans-serif;
}
.bill-customer-detail {
  font-size: .78rem; color: var(--muted);
  font-family: 'Syne', sans-serif; margin-top: 3px;
  line-height: 1.5;
}

/* ── Section label ── */
.bill-section-label {
  font-size: .68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--muted); font-family: 'Syne', sans-serif;
  margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}
.bill-section-label::after {
  content: '';
  flex: 1; height: 1px;
  background: var(--border);
}

/* ── Items ── */
.bill-items { margin-bottom: 20px; }
.bill-item {
  display: flex; align-items: center; gap: 14px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--border);
  animation: billItemSlide .4s ease both;
}
.bill-item:last-child { border-bottom: none; }
@keyframes billItemSlide {
  from { opacity: 0; transform: translateX(-10px); }
  to   { opacity: 1; transform: translateX(0); }
}
.bill-item-qty {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(244,164,53,.1);
  border: 1px solid rgba(244,164,53,.2);
  color: var(--accent); font-size: .78rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-family: 'Syne', sans-serif;
}
.bill-item-info { flex: 1; min-width: 0; }
.bill-item-name {
  font-size: .9rem; font-weight: 600;
  color: var(--text); font-family: 'Syne', sans-serif;
}
.bill-item-custom {
  font-size: .72rem; color: var(--muted);
  font-family: 'Syne', sans-serif; margin-top: 2px;
}
.bill-item-unit {
  font-size: .75rem; color: var(--muted);
  font-family: 'Syne', sans-serif;
}
.bill-item-price {
  font-family: 'Instrument Serif', serif;
  font-size: 1.05rem; font-weight: 400;
  color: var(--text); flex-shrink: 0;
}

/* ── Totals ── */
.bill-totals {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 20px;
}
.bill-total-row {
  display: flex; justify-content: space-between;
  font-size: .84rem; color: var(--muted);
  font-family: 'Syne', sans-serif;
  padding: 5px 0;
}
.bill-total-row.discount { color: #2DC653; }
.bill-total-divider {
  height: 1px; background: var(--border);
  margin: 10px 0;
}
.bill-grand-total {
  display: flex; justify-content: space-between;
  align-items: center; padding-top: 4px;
}
.bill-grand-label {
  font-family: 'Syne', sans-serif;
  font-size: .9rem; font-weight: 700; color: var(--text);
}
.bill-grand-amount {
  font-family: 'Instrument Serif', serif;
  font-size: 1.8rem; font-weight: 400;
  color: var(--accent);
}

/* ── Payment method ── */
.bill-payment {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 12px;
  background: var(--surface2); border: 1px solid var(--border);
  margin-bottom: 20px;
}
.bill-payment-icon { font-size: 1.5rem; }
.bill-payment-label {
  font-size: .78rem; color: var(--muted);
  font-family: 'Syne', sans-serif;
}
.bill-payment-method {
  font-size: .9rem; font-weight: 700;
  color: var(--text); font-family: 'Syne', sans-serif;
}
.bill-payment-status {
  margin-left: auto;
  background: rgba(45,198,83,.12);
  border: 1px solid rgba(45,198,83,.2);
  color: #2DC653; font-size: .72rem; font-weight: 700;
  padding: 4px 12px; border-radius: 50px;
  font-family: 'Syne', sans-serif;
}
.bill-payment-status.cod {
  background: rgba(244,164,53,.12);
  border-color: rgba(244,164,53,.2);
  color: #F4A435;
}

/* ── Estimated delivery ── */
.bill-eta {
  display: flex; align-items: center; gap: 14px;
  padding: 16px; border-radius: 14px;
  background: rgba(244,164,53,.06);
  border: 1px solid rgba(244,164,53,.15);
  margin-bottom: 20px;
}
.bill-eta-icon { font-size: 2rem; animation: etaScoot 1.5s ease-in-out infinite; }
@keyframes etaScoot {
  0%,100% { transform: translateX(0); }
  50%     { transform: translateX(6px); }
}
.bill-eta-label {
  font-size: .72rem; color: var(--muted);
  font-family: 'Syne', sans-serif;
  text-transform: uppercase; letter-spacing: 1px;
  font-weight: 700;
}
.bill-eta-time {
  font-family: 'Instrument Serif', serif;
  font-size: 1.6rem; color: var(--accent); line-height: 1.1;
}
.bill-eta-address {
  font-size: .78rem; color: var(--muted);
  font-family: 'Syne', sans-serif; margin-top: 2px;
}

/* ── Dashed separator ── */
.bill-dash-sep {
  display: flex; align-items: center; gap: 0;
  margin: 4px 0 20px;
  position: relative;
}
.bill-dash-sep::before {
  content: '';
  position: absolute; left: -32px; right: -32px;
  top: 50%; height: 1px;
  border-top: 2px dashed var(--border);
}
.bill-dash-circle {
  width: 20px; height: 20px; border-radius: 50%;
  background: var(--bg);
  border: 1px solid var(--border);
  flex-shrink: 0; position: relative; z-index: 1;
}
.bill-dash-circle:last-child { margin-left: auto; }

/* ── QR / barcode area ── */
.bill-barcode {
  display: flex; align-items: center; justify-content: center;
  gap: 20px; padding: 16px 0 8px;
}
.bill-barcode-lines {
  display: flex; align-items: flex-end; gap: 2px; height: 40px;
}
.bill-barcode-line {
  background: var(--text2);
  border-radius: 1px;
  width: 2px;
}
.bill-barcode-num {
  font-size: .7rem; color: var(--muted);
  font-family: monospace; letter-spacing: 2px;
}

/* ── Footer ── */
.bill-footer {
  padding: 16px 32px 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}
.bill-footer-msg {
  font-family: 'Instrument Serif', serif;
  font-size: 1rem; font-style: italic;
  color: var(--muted); margin-bottom: 4px;
}
.bill-footer-sub {
  font-size: .72rem; color: var(--muted);
  font-family: 'Syne', sans-serif;
}

/* ── Action buttons ── */
.bill-actions {
  display: flex; gap: 12px; margin-top: 28px;
  flex-wrap: wrap;
  animation: billFadeUp .7s .4s cubic-bezier(.34,1.3,.64,1) both;
  width: 100%; max-width: 560px;
}
.bill-btn-primary {
  flex: 1; padding: 14px;
  background: var(--accent); color: #0A0A0A;
  border: none; border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: .9rem; font-weight: 700;
  cursor: pointer; transition: all .22s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  min-width: 140px;
}
.bill-btn-primary:hover { background: #ffb84d; transform: scale(1.02); }
.bill-btn-ghost {
  flex: 1; padding: 14px;
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--text); border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-size: .9rem; font-weight: 600;
  cursor: pointer; transition: all .22s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  min-width: 140px;
}
.bill-btn-ghost:hover { background: var(--surface3); }
.bill-print-btn {
  width: 48px; height: 48px; border-radius: 12px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-size: 1.1rem;
  cursor: pointer; transition: all .22s;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.bill-print-btn:hover { background: var(--surface3); border-color: var(--border2); }

/* ── Reference style overrides ── */
.bill-page {
  position: relative;
  isolation: isolate;
  background: transparent;
}

.bill-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1800&q=80');
  background-size: cover;
  background-position: center;
  filter: brightness(.32) contrast(1.08);
}

.bill-page::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(98deg, rgba(3,12,21,.92) 0%, rgba(3,12,21,.72) 48%, rgba(3,12,21,.58) 100%),
    radial-gradient(820px 420px at 0% 0%, rgba(244,164,53,.22), transparent 70%);
}

.bill-confetti { display: none; }

.bill-success-title,
.bill-order-id,
.bill-grand-amount,
.bill-footer-msg,
.bill-brand-logo {
  font-family: 'Cormorant Garamond', serif;
}

.bill-success-title,
.bill-customer-name,
.bill-item-name,
.bill-grand-label,
.bill-payment-method,
.bill-brand-logo,
.bill-order-id,
.bill-footer-sub,
.bill-success-sub {
  color: #fff;
}

.bill-success-sub,
.bill-customer-detail,
.bill-item-custom,
.bill-item-unit,
.bill-total-row,
.bill-payment-label,
.bill-eta-label,
.bill-eta-address,
.bill-footer-msg,
.bill-footer-sub,
.bill-barcode-num {
  color: rgba(255,255,255,.64);
  font-family: 'DM Sans', sans-serif;
}

.bill-card,
.bill-totals,
.bill-payment,
.bill-eta,
.bill-customer,
.bill-btn-ghost,
.bill-print-btn {
  background: linear-gradient(165deg, rgba(2,13,24,.95) 0%, rgba(7,21,38,.84) 100%);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 8px;
}

.bill-top {
  background: rgba(2,13,24,.95);
}

.bill-zigzag,
.bill-zigzag::before,
.bill-dash-sep,
.bill-dash-circle { display: none; }

.bill-status-pill,
.bill-payment-status,
.bill-brand-tag,
.bill-btn-primary,
.bill-btn-ghost {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: .9px;
}

.bill-btn-primary,
.bill-btn-ghost {
  font-family: 'DM Sans', sans-serif;
  font-size: .78rem;
  font-weight: 800;
}

.bill-btn-primary { box-shadow: 0 12px 24px rgba(244,164,53,.24); }

.bill-footer {
  border-top-color: rgba(255,255,255,.14);
}

.bill-top,
.bill-body,
.bill-footer { backdrop-filter: blur(8px); }

@keyframes billFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Print styles ── */
@media print {
  @page { size: A4; margin: 12mm; }

  .bill-page {
    padding: 0 !important;
    background: #fff !important;
    color: #111 !important;
  }

  .bill-page::before,
  .bill-page::after {
    content: none !important;
    display: none !important;
  }

  .bill-actions,
  .bill-success-header,
  .bill-confetti {
    display: none !important;
  }

  .bill-card {
    box-shadow: none !important;
    border: 1px solid #d9d9d9 !important;
    border-radius: 0 !important;
    max-width: 100% !important;
    animation: none !important;
    background: #fff !important;
    color: #111 !important;
  }

  .bill-top,
  .bill-body,
  .bill-footer,
  .bill-customer,
  .bill-totals,
  .bill-payment,
  .bill-eta {
    background: #fff !important;
    color: #111 !important;
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
  }

  .bill-top {
    border-bottom: 1px solid #d9d9d9 !important;
  }

  .bill-brand-logo,
  .bill-order-id,
  .bill-customer-name,
  .bill-item-name,
  .bill-item-price,
  .bill-grand-label,
  .bill-payment-method,
  .bill-grand-amount {
    color: #111 !important;
  }

  .bill-customer-detail,
  .bill-item-custom,
  .bill-item-unit,
  .bill-total-row,
  .bill-payment-label,
  .bill-eta-label,
  .bill-eta-address,
  .bill-footer-msg,
  .bill-footer-sub,
  .bill-barcode-num,
  .bill-date {
    color: #555 !important;
  }

  .bill-total-row.discount {
    color: #0f7a3b !important;
  }

  .bill-status-pill,
  .bill-payment-status,
  .bill-brand-tag {
    background: #fff !important;
    border: 1px solid #bcbcbc !important;
    color: #111 !important;
  }

  .bill-barcode-line {
    background: #111 !important;
  }
}

@media(max-width: 600px) {
  .bill-body { padding: 20px; }
  .bill-top { padding: 22px 20px 20px; }
  .bill-footer { padding: 14px 20px 20px; }
  .bill-actions { flex-direction: column; }
  .bill-print-btn { width: 100%; height: 48px; }
}

/* Unified promo bill polish */
.bill-card,
.bill-top,
.bill-body,
.bill-footer,
.bill-customer,
.bill-totals,
.bill-payment,
.bill-eta {
  border-radius: 8px;
  border-color: rgba(255, 255, 255, 0.16);
}

.bill-top {
  background: linear-gradient(140deg, #070c14 0%, #15263c 100%);
}

.bill-brand-tag,
.bill-status-pill,
.bill-payment-status,
.bill-payment-status.cod {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 800;
}

.bill-success-title {
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bill-order-id {
  font-size: clamp(1.9rem, 5vw, 2.8rem);
}

.bill-item {
  gap: 12px;
}

.bill-btn-primary,
.bill-btn-ghost,
.bill-print-btn {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bill-btn-primary {
  box-shadow: 0 14px 26px rgba(246, 181, 21, 0.25);
}

@media (max-width: 720px) {
  .bill-page {
    padding-top: 84px;
    padding-left: 14px;
    padding-right: 14px;
  }

  .bill-success-title {
    font-size: 1.8rem;
  }

  .bill-order-id {
    font-size: 1.7rem;
  }

  .bill-actions {
    gap: 10px;
  }

  .bill-btn-primary,
  .bill-btn-ghost {
    min-width: unset;
    width: 100%;
  }
}

@media (max-width: 420px) {
  .bill-barcode {
    flex-direction: column;
    gap: 10px;
  }

  .bill-barcode-num {
    letter-spacing: 1.2px;
    font-size: 0.62rem;
  }
}
`;

// ── Confetti component ────────────────────────────────────────────────────────
function Confetti() {
  const colors = ["#F4A435", "#FF6B35", "#2DC653", "#3B82F6", "#F4A435", "#fff"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: `${Math.random() * 1.5}s`,
    dur: `${2 + Math.random() * 2}s`,
    rot: Math.random() > .5 ? "8px" : "4px",
    w: `${6 + Math.random() * 6}px`,
    h: `${10 + Math.random() * 8}px`,
  }));

  return (
    <div className="bill-confetti">
      {pieces.map(p => (
        <div
          key={p.id}
          className="conf-piece"
          style={{
            left: p.left,
            background: p.color,
            animationDuration: p.dur,
            animationDelay: p.delay,
            width: p.w,
            height: p.h,
            borderRadius: p.rot,
          }}
        />
      ))}
    </div>
  );
}

// ── Barcode visual ────────────────────────────────────────────────────────────
function Barcode({ orderId }) {
  const heights = [30, 20, 35, 15, 40, 25, 18, 38, 22, 32, 16, 36, 28, 14, 34, 20, 38, 24, 30, 16, 36, 22, 28, 18, 40, 20, 32, 26, 14, 38];
  return (
    <div className="bill-barcode">
      <div className="bill-barcode-lines">
        {heights.map((h, i) => (
          <div key={i} className="bill-barcode-line" style={{ height: h, width: i % 3 === 0 ? 3 : 2 }} />
        ))}
      </div>
      <div className="bill-barcode-num">{orderId}</div>
    </div>
  );
}

// ── Main FoodBill component ───────────────────────────────────────────────────
export default function FoodBill({ order, onTrack, onHome }) {
  const billRef = useRef(null);

  // Inject CSS
  const cssInjected = useRef(false);
  if (!cssInjected.current) {
    cssInjected.current = true;
    if (typeof document !== "undefined") {
      if (!document.getElementById("bill-css")) {
        const s = document.createElement("style");
        s.id = "bill-css"; s.textContent = CSS;
        document.head.appendChild(s);
      }
    }
  }

  const handlePrint = () => window.print();

  const orderId = order?.orderId || order?.id || "ORD-0000";
  const items = order?.items || [];
  const total = parseFloat(order?.total) || 0;
  const subtotal = parseFloat(order?.subtotal) || items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = parseFloat(order?.deliveryFee) ?? 2.99;
  const tax = parseFloat(order?.tax) || subtotal * 0.08;
  const discount = parseFloat(order?.discount) || 0;
  const coupon = order?.couponCode || null;
  const address = order?.deliveryAddress || "Your delivery address";
  const customerName = order?.customerName || order?.name || "Customer";
  const customerPhone = order?.customerPhone || "";
  const payMethod = order?.paymentMethod || "cod";
  const payStatus = order?.paymentStatus || "pending";
  const createdAt = order?.createdAt ? new Date(order.createdAt) : new Date();

  const fmtDate = (d) => d.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const payLabel = {
    razorpay: "Online Payment",
    upi: "UPI Payment",
    cod: "Cash on Delivery",
    cash_on_delivery: "Cash on Delivery",
    upi_pending: "UPI Payment",
  }[payMethod] || "Payment";

  const isPaid = ["paid", "razorpay"].includes(payStatus) || payMethod === "razorpay";

  // INR conversion (approx)
  const inr = (usd) => `₹${Math.round(usd)}`;

  return (
    <div className="bill-page">
      <Confetti />

      {/* Success header */}
      <div className="bill-success-header">
        <span className="bill-success-icon">🎉</span>
        <div className="bill-success-title">Order Confirmed!</div>
        <div className="bill-success-sub">Your bill is ready. Food is being prepared.</div>
      </div>

      {/* ── THE BILL CARD ── */}
      <div className="bill-card" ref={billRef}>

        {/* Top banner */}
        <div className="bill-top">
          <div className="bill-top-glow" />
          <div className="bill-brand">
            <div className="bill-brand-logo">Fork<span>.</span>Fleet</div>
            <div className="bill-brand-tag">Official Receipt</div>
          </div>
          <div className="bill-meta-row">
            <div>
              <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.4)", fontFamily: "'Syne',sans-serif", marginBottom: 4, textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</div>
              <div className="bill-order-id">
                ORD-<span>{orderId.replace("ORD-", "")}</span>
              </div>
            </div>
            <div className="bill-meta-right">
              <div className="bill-date">{fmtDate(createdAt)}</div>
              <div className="bill-status-pill">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#2DC653", display: "inline-block" }} />
                Confirmed
              </div>
            </div>
          </div>
        </div>

        {/* Zigzag tear */}
        <div className="bill-zigzag" />

        {/* Body */}
        <div className="bill-body">

          {/* Customer info */}
          <div className="bill-customer">
            <div className="bill-customer-avatar">👤</div>
            <div>
              <div className="bill-customer-name">{customerName}</div>
              <div className="bill-customer-detail">
                {customerPhone && <>{customerPhone}<br /></>}
                📍 {address}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bill-section-label">🍽️ Items Ordered</div>
          <div className="bill-items">
            {items.map((item, i) => (
              <div
                className="bill-item"
                key={i}
                style={{ animationDelay: `${i * 80 + 200}ms` }}
              >
                <div className="bill-item-qty">×{item.qty}</div>
                <div className="bill-item-info">
                  <div className="bill-item-name">{item.name}</div>
                  {item.customizations?.extras?.length > 0 && (
                    <div className="bill-item-custom">
                      + {item.customizations.extras.join(", ")}
                    </div>
                  )}
                  {item.customizations?.spice && (
                    <div className="bill-item-custom">🌶️ {item.customizations.spice}</div>
                  )}
                  <div className="bill-item-unit">{inr(item.price)} each</div>
                </div>
                <div className="bill-item-price">{inr(item.price * item.qty)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="bill-totals">
            <div className="bill-total-row">
              <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
              <span>{inr(subtotal)}</span>
            </div>
            <div className="bill-total-row">
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? <span style={{ color: "#2DC653" }}>FREE</span> : inr(deliveryFee * 10 )}</span>
            </div>
            <div className="bill-total-row">
              <span>GST & Taxes (8%)</span>
              <span>{inr(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="bill-total-row discount">
                <span>🎟️ Discount {coupon && `(${coupon})`}</span>
                <span>− {inr(discount)}</span>
              </div>
            )}
            <div className="bill-total-divider" />
            <div className="bill-grand-total">
              <div className="bill-grand-label">Total Amount Paid</div>
              <div className="bill-grand-amount">{inr(total)}</div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bill-payment">
            <div className="bill-payment-icon">
              {payMethod === "razorpay" ? "💳" : payMethod === "upi" || payMethod === "upi_pending" ? "📱" : "💵"}
            </div>
            <div>
              <div className="bill-payment-label">Payment Method</div>
              <div className="bill-payment-method">{payLabel}</div>
            </div>
            <div className={`bill-payment-status${isPaid ? "" : " cod"}`}>
              {isPaid ? "✅ Paid" : payMethod === "cod" || payMethod === "cash_on_delivery" ? "🤝 Pay on Delivery" : "⏳ Pending"}
            </div>
          </div>

          {/* ETA */}
          <div className="bill-eta">
            <div className="bill-eta-icon">🛵</div>
            <div>
              <div className="bill-eta-label">Estimated Delivery</div>
              <div className="bill-eta-time">30 – 45 minutes</div>
              <div className="bill-eta-address">📍 {address}</div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="bill-dash-sep">
            <div className="bill-dash-circle" />
            <div className="bill-dash-circle" />
          </div>

          {/* Thank you message */}
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)", marginBottom: 4 }}>
              Thank you for ordering with Fork.Fleet!
            </div>
            <div style={{ fontSize: ".72rem", color: "var(--muted)", fontFamily: "'Syne',sans-serif" }}>
              Questions? Contact us · support@forkfleet.com
            </div>
          </div>

          {/* Barcode */}
          <Barcode orderId={orderId} />
        </div>

        {/* Footer */}
        <div className="bill-footer">
          <div className="bill-footer-msg">"Crafted with care, delivered with love."</div>
          <div className="bill-footer-sub">Fork.Fleet · forkfleet.com · This is your official order receipt</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="bill-actions">
        <button className="bill-btn-primary" onClick={onTrack}>
          🛵 Track My Order
        </button>
        <button className="bill-btn-ghost" onClick={onHome}>
          🍔 Order More
        </button>
        <button className="bill-print-btn" onClick={handlePrint} title="Print / Save as PDF">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
