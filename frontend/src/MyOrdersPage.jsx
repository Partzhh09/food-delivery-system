import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE } from "./apiBase";

const DELIVERY_ESTIMATE = {
  pending: 45,
  confirmed: 38,
  preparing: 25,
  out_for_delivery: 12,
  delivered: 0,
  cancelled: 0,
};

const STATUS_STEPS = [
  {
    key: "pending",
    label: "Order Placed",
    icon: "📋",
    color: "#F4A435",
    desc: "We received your order!",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: "✅",
    color: "#3B82F6",
    desc: "Restaurant accepted",
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: "👨‍🍳",
    color: "#F4A435",
    desc: "Chef is cooking",
  },
  {
    key: "out_for_delivery",
    label: "On the Way",
    icon: "🛵",
    color: "#8B5CF6",
    desc: "Rider heading to you",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: "🎉",
    color: "#2DC653",
    desc: "Enjoy your meal!",
  },
];

const STATUS_IDX = {
  pending: 0,
  confirmed: 1,
  preparing: 2,
  out_for_delivery: 3,
  delivered: 4,
  cancelled: -1,
};

const STATUS_COLOR = {
  pending: {
    bg: "rgba(244,164,53,.13)",
    border: "rgba(244,164,53,.3)",
    text: "#F4A435",
  },
  confirmed: {
    bg: "rgba(59,130,246,.13)",
    border: "rgba(59,130,246,.3)",
    text: "#3B82F6",
  },
  preparing: {
    bg: "rgba(244,164,53,.13)",
    border: "rgba(244,164,53,.3)",
    text: "#F4A435",
  },
  out_for_delivery: {
    bg: "rgba(139,92,246,.13)",
    border: "rgba(139,92,246,.3)",
    text: "#8B5CF6",
  },
  delivered: {
    bg: "rgba(45,198,83,.13)",
    border: "rgba(45,198,83,.3)",
    text: "#2DC653",
  },
  cancelled: {
    bg: "rgba(230,57,70,.13)",
    border: "rgba(230,57,70,.3)",
    text: "#E63946",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');

.op-page { padding-top: 72px; min-height: 100vh; background: var(--bg); font-family: var(--font-body); }

/* ── Hero banner ── */
.op-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 44px 48px 36px;
}
.op-hero-inner { max-width: 1100px; margin: 0 auto; }
.op-tag {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(244,164,53,.12); border: 1px solid rgba(244,164,53,.28);
  color: var(--accent); padding: 6px 14px; border-radius: 50px;
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; margin-bottom: 14px;
}
.op-title {
  font-family: var(--font-display); font-size: clamp(2rem,4vw,3rem);
  font-weight: 900; letter-spacing: -1.5px; color: var(--text); margin-bottom: 6px;
}
.op-sub { color: var(--muted); font-size: .95rem; margin-bottom: 28px; }

/* ── Quick track bar ── */
.op-track-bar {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 14px; padding: 12px 16px; max-width: 500px;
  transition: border-color .2s, box-shadow .2s;
}
.op-track-bar:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(244,164,53,.12);
}
.op-track-bar input {
  flex: 1; background: none; border: none; color: var(--text);
  font-family: var(--font-body); font-size: .92rem; outline: none;
}
.op-track-bar input::placeholder { color: var(--muted); }
.op-track-btn {
  background: var(--accent); border: none; color: #0A0A0A;
  padding: 9px 18px; border-radius: 10px; font-size: .83rem;
  font-weight: 700; cursor: pointer; font-family: var(--font-body);
  transition: all .2s; white-space: nowrap;
}
.op-track-btn:hover { background: #ffb84d; }
.op-track-btn:disabled { opacity: .6; cursor: not-allowed; }

/* ── Body ── */
.op-body { max-width: 1100px; margin: 0 auto; padding: 36px 48px; }

/* ── Filter tabs ── */
.op-filters { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; align-items: center; }
.op-filter-btn {
  padding: 8px 18px; border-radius: 50px; border: 1px solid var(--border);
  font-family: var(--font-body); font-size: .82rem; font-weight: 600;
  cursor: pointer; transition: all .22s; background: var(--surface2); color: var(--muted);
}
.op-filter-btn.active { background: var(--accent); border-color: var(--accent); color: #0A0A0A; }
.op-refresh-btn {
  margin-left: auto; padding: 8px 16px; border-radius: 50px;
  border: 1px solid var(--border); background: var(--surface2); color: var(--muted);
  font-family: var(--font-body); font-size: .82rem; font-weight: 600;
  cursor: pointer; transition: all .2s; display: flex; align-items: center; gap: 6px;
}
.op-refresh-btn:hover { color: var(--accent); border-color: var(--accent); }
.op-refresh-btn.spinning svg { animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Active order hero card ── */
.active-order-hero {
  background:
    radial-gradient(1200px 320px at 105% -10%, rgba(255, 202, 112, 0.22), transparent 52%),
    radial-gradient(600px 240px at -5% 115%, rgba(255, 142, 43, 0.16), transparent 60%),
    linear-gradient(130deg, #1b1202 0%, #241607 48%, #120d04 100%);
  border: 1px solid rgba(255, 199, 114, 0.28);
  border-radius: 28px;
  padding: 34px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 24px 54px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 246, 224, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
  animation: opFadeUp .5s cubic-bezier(.34,1.3,.64,1) both;
}
[data-theme="light"] .active-order-hero {
  background:
    radial-gradient(960px 280px at 98% -14%, rgba(244, 164, 53, 0.2), transparent 58%),
    linear-gradient(132deg, #fffaf0 0%, #fff4dd 48%, #ffedc5 100%);
  border-color: rgba(244,164,53,.32);
  box-shadow:
    0 16px 34px rgba(225, 171, 84, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.78);
}
.active-order-hero::before {
  content: '';
  position: absolute;
  right: -56px;
  top: -56px;
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(255, 211, 134, 0.24) 0%, transparent 70%);
  filter: blur(1px);
  pointer-events: none;
}
.active-order-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle at 55% 50%, rgba(0, 0, 0, 0.35), transparent 78%);
  pointer-events: none;
  opacity: .22;
}
.aoh-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; position: relative; z-index: 1; }
.aoh-id {
  font-family: var(--font-display);
  font-size: clamp(1.45rem, 2.2vw, 1.95rem);
  font-weight: 900;
  letter-spacing: .3px;
  color: #fff;
  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.32);
}
[data-theme="light"] .aoh-id { color: var(--text); }
.aoh-date { color: rgba(255,255,255,.67); font-size: .8rem; margin-top: 5px; letter-spacing: .2px; }
[data-theme="light"] .aoh-date { color: var(--muted); }
.aoh-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 50px; font-size: .8rem; font-weight: 700;
  border: 1px solid; flex-shrink: 0; position: relative; z-index: 1;
}

/* ── Delivery countdown ── */
.delivery-countdown {
  background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
  border: 1px solid rgba(255,214,146,.24);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 28px;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  backdrop-filter: blur(6px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
  position: relative;
  z-index: 1;
}
[data-theme="light"] .delivery-countdown {
  background: linear-gradient(160deg, rgba(255,255,255,.84), rgba(255,255,255,.62));
  border-color: rgba(244,164,53,.28);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
}
.dc-icon { font-size: 2.5rem; flex-shrink: 0; animation: scooterBounce 2s ease-in-out infinite; }
@keyframes scooterBounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
.dc-label { font-size: .75rem; color: rgba(255,255,255,.5); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
[data-theme="light"] .dc-label { color: var(--muted); }
.dc-time { font-family: var(--font-display); font-size: 2.8rem; font-weight: 900; color: #ffd488; line-height: 1; text-shadow: 0 6px 20px rgba(255, 166, 56, .18); }
[data-theme="light"] .dc-time { color: #cf7a16; text-shadow: none; }
.dc-unit { font-size: .85rem; color: rgba(255,255,255,.5); margin-top: 4px; }
[data-theme="light"] .dc-unit { color: var(--muted); }
.dc-divider { width: 1px; height: 60px; background: rgba(255,255,255,.1); flex-shrink: 0; }
[data-theme="light"] .dc-divider { background: var(--border); }
.dc-progress-wrap { flex: 1; min-width: 200px; }
.dc-progress-label { display: flex; justify-content: space-between; font-size: .78rem; color: rgba(255,255,255,.5); margin-bottom: 8px; }
[data-theme="light"] .dc-progress-label { color: var(--muted); }
.dc-progress-track { height: 9px; background: rgba(255,255,255,.12); border-radius: 999px; overflow: hidden; }
[data-theme="light"] .dc-progress-track { background: var(--surface3); }
.dc-progress-fill { height: 100%; background: linear-gradient(90deg, #ffc46a, #ff9f4a 45%, #ff7b47); border-radius: 999px; transition: width 1s ease; box-shadow: 0 4px 16px rgba(255, 144, 52, .34); }

/* ── Tracker stepper ── */
.tracker-wrap { margin-bottom: 24px; }
.tracker-label-top { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: rgba(255,255,255,.4); margin-bottom: 20px; }
[data-theme="light"] .tracker-label-top { color: var(--muted); }
.tracker-row { display: flex; align-items: flex-start; position: relative; }
.tracker-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.tracker-line {
  position: absolute; top: 20px; left: 50%; right: -50%; height: 3px;
  background: rgba(255,255,255,.1); z-index: 0; transition: background .6s ease;
}
[data-theme="light"] .tracker-line { background: var(--surface3); }
.tracker-line.done { background: var(--accent); }
.tracker-step:last-child .tracker-line { display: none; }
.tracker-dot {
  width: 40px; height: 40px; border-radius: 50%; z-index: 1;
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  border: 2px solid rgba(255,255,255,.1); background: rgba(255,255,255,.06);
  transition: all .4s cubic-bezier(.34,1.4,.64,1); position: relative;
}
[data-theme="light"] .tracker-dot { border-color: var(--border2); background: var(--surface2); }
.tracker-dot.done { background: var(--accent); border-color: var(--accent); color: #0A0A0A; }
.tracker-dot.active {
  background: var(--accent); border-color: var(--accent); color: #0A0A0A;
  box-shadow: 0 0 0 8px rgba(244,164,53,.2);
  animation: tdPulse 2s ease-in-out infinite;
}
@keyframes tdPulse { 0%,100%{box-shadow:0 0 0 8px rgba(244,164,53,.18);}50%{box-shadow:0 0 0 16px rgba(244,164,53,.06);} }
.tracker-step-label { font-size: .7rem; font-weight: 600; text-align: center; margin-top: 10px; color: rgba(255,255,255,.35); transition: color .3s; line-height: 1.3; }
[data-theme="light"] .tracker-step-label { color: var(--muted); }
.tracker-step-label.done, .tracker-step-label.active { color: rgba(255,255,255,.9); }
[data-theme="light"] .tracker-step-label.done,[data-theme="light"] .tracker-step-label.active { color: var(--text); }
.tracker-step-desc { font-size: .65rem; color: var(--accent); text-align: center; margin-top: 3px; }

/* ── Regular order card ── */
.op-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 20px; margin-bottom: 16px; overflow: hidden;
  transition: all .3s cubic-bezier(.34,1.2,.64,1);
  animation: opFadeUp .4s cubic-bezier(.34,1.3,.64,1) both;
}
.op-card:hover { border-color: var(--border2); box-shadow: 0 10px 36px var(--shadow); transform: translateY(-2px); }
.op-card-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 22px; cursor: pointer; transition: background .18s;
  gap: 12px;
}
.op-card-header:hover { background: var(--surface2); }
.op-card-id { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--text); }
.op-card-meta { font-size: .78rem; color: var(--muted); margin-top: 3px; }
.op-card-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.op-card-total { font-family: var(--font-display); font-size: 1.1rem; font-weight: 900; color: var(--text); text-align: right; }
.op-status-pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 12px; border-radius: 50px; font-size: .72rem; font-weight: 700; border: 1px solid;
  margin-top: 4px; white-space: nowrap;
}
.op-chevron { color: var(--muted); font-size: .8rem; transition: transform .3s; margin-left: 4px; }
.op-chevron.open { transform: rotate(180deg); }

/* ── Expandable body ── */
.op-card-body { overflow: hidden; max-height: 0; transition: max-height .4s cubic-bezier(.4,0,.2,1); }
.op-card-body.open { max-height: 800px; }
.op-card-body-inner { padding: 20px 22px; border-top: 1px solid var(--border); }

/* ── Mini tracker inside card ── */
.mini-tracker { display: flex; align-items: center; margin-bottom: 20px; position: relative; }
.mini-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; }
.mini-line { position: absolute; top: 13px; left: 50%; right: -50%; height: 2px; background: var(--surface3); z-index: 0; transition: background .5s; }
.mini-line.done { background: var(--accent); }
.mini-step:last-child .mini-line { display: none; }
.mini-dot {
  width: 26px; height: 26px; border-radius: 50%; z-index: 1;
  display: flex; align-items: center; justify-content: center; font-size: .7rem;
  border: 2px solid var(--surface3); background: var(--surface2);
  transition: all .35s cubic-bezier(.34,1.4,.64,1);
}
.mini-dot.done { background: var(--accent); border-color: var(--accent); color: #0A0A0A; font-size: .65rem; }
.mini-dot.active { background: var(--accent); border-color: var(--accent); color: #0A0A0A; box-shadow: 0 0 0 5px rgba(244,164,53,.18); animation: tdPulse 2s ease-in-out infinite; }
.mini-label { font-size: .62rem; color: var(--muted); text-align: center; margin-top: 6px; line-height: 1.2; }
.mini-label.done,.mini-label.active { color: var(--text); font-weight: 600; }

/* ── ETA in card ── */
.op-eta {
  display: flex; align-items: center; gap: 10px;
  background: rgba(244,164,53,.08); border: 1px solid rgba(244,164,53,.2);
  border-radius: 12px; padding: 12px 16px; margin-bottom: 16px;
}
.op-eta-time { font-family: var(--font-display); font-size: 1.4rem; font-weight: 900; color: var(--accent); }
.op-eta-label { font-size: .8rem; color: var(--muted); }

/* ── Items list ── */
.op-items-title { font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); margin-bottom: 12px; }
.op-item-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
.op-item-row:last-child { border-bottom: none; }
.op-item-qty { width: 26px; height: 26px; border-radius: 7px; background: rgba(244,164,53,.12); border: 1px solid rgba(244,164,53,.2); color: var(--accent); font-size: .75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.op-item-name { flex: 1; font-size: .88rem; font-weight: 600; color: var(--text); }
.op-item-price { font-family: var(--font-display); font-size: .9rem; font-weight: 700; color: var(--text); }

/* ── Summary ── */
.op-summary { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; margin-top: 14px; }
.op-summary-row { display: flex; justify-content: space-between; font-size: .83rem; color: var(--muted); margin-bottom: 7px; }
.op-summary-total { display: flex; justify-content: space-between; font-family: var(--font-display); font-size: 1.05rem; font-weight: 900; color: var(--text); border-top: 1px solid var(--border); padding-top: 10px; margin-top: 6px; }
.op-summary-total span:last-child { color: var(--accent); }

/* ── Reorder ── */
.op-reorder-btn {
  width: 100%; padding: 12px; border-radius: 12px;
  background: var(--accent); border: none; color: #0A0A0A;
  font-size: .88rem; font-weight: 700; cursor: pointer;
  font-family: var(--font-body); transition: all .22s; margin-top: 14px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.op-reorder-btn:hover { background: #ffb84d; transform: scale(1.01); }

.op-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.op-actions.single {
  grid-template-columns: 1fr;
}

.op-print-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.24);
  background: rgba(255,255,255,.06);
  color: var(--text);
  font-size: .82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all .22s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-body);
}

.op-print-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(244,164,53,.08);
}

/* ── Cancelled ── */
.op-cancelled-bar {
  display: flex; align-items: center; gap: 12px;
  background: rgba(230,57,70,.08); border: 1px solid rgba(230,57,70,.2);
  border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;
}
.op-cancelled-bar strong { color: #E63946; font-size: .9rem; display: block; }
.op-cancelled-bar span { color: var(--muted); font-size: .8rem; }

/* ── Empty / login ── */
.op-empty { text-align: center; padding: 72px 20px; animation: opFadeUp .5s ease both; }
.op-empty-icon { font-size: 4rem; display: block; margin-bottom: 16px; }
.op-empty-title { font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; color: var(--text); margin-bottom: 8px; }
.op-empty-sub { color: var(--muted); font-size: .92rem; margin-bottom: 28px; }

/* ── Skeleton ── */
.op-skel { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; margin-bottom: 16px; }
.skel-line { height: 14px; border-radius: 7px; background: linear-gradient(90deg,var(--surface2) 25%,var(--surface3) 50%,var(--surface2) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; margin-bottom: 10px; }
@keyframes shimmer { 0%{background-position:200% 0;}100%{background-position:-200% 0;} }

/* ── Track result popup ── */
.op-track-result {
  background: var(--surface); border: 1px solid var(--border2);
  border-radius: 18px; padding: 22px; margin-top: 16px; max-width: 500px;
  animation: opFadeUp .4s cubic-bezier(.34,1.3,.64,1) both;
}

/* ── Reference style overrides ── */
.op-page {
  position: relative;
  isolation: isolate;
  background: transparent;
}

.op-page::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -2;
  background-image: url('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1800&q=80');
  background-size: cover;
  background-position: center;
  filter: brightness(.3) contrast(1.07) saturate(1.04);
}

.op-page::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(96deg, rgba(2,12,23,.92) 0%, rgba(4,14,24,.7) 45%, rgba(4,14,24,.58) 100%),
    radial-gradient(920px 420px at 0% -5%, rgba(244,164,53,.22), transparent 68%);
}

.op-hero {
  background: rgba(2,13,24,.82);
  border-bottom: 1px solid rgba(255,255,255,.16);
  backdrop-filter: blur(8px);
}

.op-tag,
.op-filter-btn,
.op-track-btn,
.op-refresh-btn,
.op-status-pill,
.op-reorder-btn {
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.op-title,
.op-empty-title,
.aoh-id,
.op-card-id {
  font-family: 'Cormorant Garamond', serif;
  letter-spacing: .4px;
}

.op-sub,
.op-card-meta,
.op-empty-sub,
.op-summary-row,
.op-eta-label,
.mini-label,
.tracker-step-label,
.dc-label,
.dc-unit {
  color: rgba(255,255,255,.68);
}

.op-track-bar,
.op-track-result,
.active-order-hero,
.op-card,
.op-summary,
.op-skel,
.op-cancelled-bar,
.op-eta {
  background: linear-gradient(165deg, rgba(2,13,24,.95) 0%, rgba(7,21,38,.84) 100%);
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 8px;
}

.op-card:hover,
.active-order-hero:hover,
.op-track-result:hover {
  border-color: rgba(244,164,53,.42);
  box-shadow: 0 16px 42px rgba(0,0,0,.34);
}

.op-track-bar input,
.op-track-bar input::placeholder {
  color: rgba(255,255,255,.86);
}

.op-track-bar input::placeholder {
  color: rgba(255,255,255,.5);
}

.op-track-btn,
.op-reorder-btn {
  font-size: .76rem;
  font-weight: 800;
}

.op-filter-btn,
.op-refresh-btn {
  font-size: .74rem;
  font-weight: 700;
}

.op-filter-btn {
  background: rgba(255,255,255,.08);
  border-color: rgba(255,255,255,.2);
  color: rgba(255,255,255,.84);
}

.op-filter-btn.active {
  background: var(--accent);
  color: #0A0A0A;
  box-shadow: 0 10px 24px rgba(244,164,53,.26);
}

.op-refresh-btn,
.op-track-btn {
  border-color: rgba(255,255,255,.22);
}

.op-item-row {
  border-bottom-color: rgba(255,255,255,.1);
}

.op-summary-total {
  border-top-color: rgba(255,255,255,.14);
}

.dc-progress-track,
.mini-line,
.tracker-line {
  background: rgba(255,255,255,.18);
}

@keyframes opFadeUp { from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);} }

@media(max-width:768px){
  .op-hero{padding:28px 20px 24px;}
  .op-body{padding:24px 20px;}
  .aoh-top{flex-direction:column;}
  .delivery-countdown{flex-direction:column;gap:14px;}
  .dc-divider{display:none;}
  .tracker-step-desc{display:none;}
  .op-card-header{flex-wrap:wrap;}
}

/* Unified promo orders polish */
.op-hero,
.op-track-bar,
.active-order-hero,
.op-card,
.op-summary,
.op-track-result,
.op-skel,
.op-cancelled-bar,
.op-eta {
  border-radius: 8px;
  border-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
}

.op-tag,
.op-filter-btn,
.op-track-btn,
.op-refresh-btn,
.op-status-pill,
.op-reorder-btn {
  border-radius: 4px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.op-title {
  text-transform: uppercase;
  letter-spacing: 1.1px;
}

.aoh-id {
  font-size: clamp(1.5rem, 3vw, 2.3rem);
}

.delivery-countdown {
  border-radius: 8px;
}

.tracker-dot,
.mini-dot {
  box-shadow: none;
}

.op-track-bar input {
  font-size: 0.88rem;
  letter-spacing: 0.3px;
}

.op-filter-btn.active,
.op-reorder-btn,
.op-track-btn {
  box-shadow: 0 12px 28px rgba(246, 181, 21, 0.22);
}

/* Keep this page's premium dark palette even when global theme is light */
[data-theme="light"] .op-page {
  color-scheme: dark;
}

[data-theme="light"] .active-order-hero {
  background:
    radial-gradient(1200px 320px at 105% -10%, rgba(255, 202, 112, 0.22), transparent 52%),
    radial-gradient(600px 240px at -5% 115%, rgba(255, 142, 43, 0.16), transparent 60%),
    linear-gradient(130deg, #1b1202 0%, #241607 48%, #120d04 100%);
  border-color: rgba(255, 199, 114, 0.28);
  box-shadow:
    0 24px 54px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 246, 224, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.4);
}

[data-theme="light"] .aoh-id,
[data-theme="light"] .tracker-step-label.done,
[data-theme="light"] .tracker-step-label.active {
  color: #fff;
}

[data-theme="light"] .aoh-date,
[data-theme="light"] .dc-label,
[data-theme="light"] .dc-unit,
[data-theme="light"] .dc-progress-label,
[data-theme="light"] .tracker-label-top,
[data-theme="light"] .tracker-step-label,
[data-theme="light"] .mini-label,
[data-theme="light"] .op-card-meta,
[data-theme="light"] .op-empty-sub {
  color: rgba(255, 255, 255, 0.68);
}

[data-theme="light"] .delivery-countdown {
  background: linear-gradient(160deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
  border-color: rgba(255,214,146,.24);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
}

[data-theme="light"] .dc-time {
  color: #ffd488;
  text-shadow: 0 6px 20px rgba(255, 166, 56, .18);
}

[data-theme="light"] .dc-divider,
[data-theme="light"] .dc-progress-track,
[data-theme="light"] .tracker-line,
[data-theme="light"] .mini-line {
  background: rgba(255,255,255,.18);
}

[data-theme="light"] .tracker-dot,
[data-theme="light"] .mini-dot {
  border-color: rgba(255,255,255,.18);
  background: rgba(255,255,255,.06);
}

@media (max-width: 900px) {
  .op-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  .op-refresh-btn {
    margin-left: 0;
    justify-content: center;
  }

  .op-track-bar {
    flex-wrap: wrap;
  }

  .op-track-btn {
    width: 100%;
  }
}

@media (max-width: 560px) {
  .op-filters {
    grid-template-columns: 1fr;
  }

  .op-card-header {
    padding: 14px;
  }

  .op-card-right {
    width: 100%;
    justify-content: space-between;
  }

  .op-summary {
    padding: 12px;
  }

  .op-reorder-btn {
    padding: 11px;
  }

  .op-actions {
    grid-template-columns: 1fr;
  }

  .dc-time {
    font-size: 2.1rem;
  }
}
`;

// ── Countdown timer hook ───────────────────────────────────────────────────────
function useCountdown(minutes) {
  const [secs, setSecs] = useState(minutes * 60);

  useEffect(() => {
    setSecs(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secs > 0]);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return { minutes: m, seconds: s, totalSecs: secs };
}

// ── Delivery progress % ───────────────────────────────────────────────────────
function getProgress(status) {
  const map = {
    pending: 8,
    confirmed: 25,
    preparing: 55,
    out_for_delivery: 82,
    delivered: 100,
    cancelled: 0,
  };
  return map[status] || 0;
}

// ── Format date ───────────────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function cancellationMessage(order) {
  const parts = [];
  if (order?.cancelReason) parts.push(`Reason: ${order.cancelReason}`);
  if (order?.cancelledBy) parts.push(`By: ${order.cancelledBy}`);
  if (order?.cancelledAt) parts.push(`At: ${fmtDate(order.cancelledAt)}`);
  return (
    parts.join(" | ") ||
    "This order was cancelled. Contact support if you were charged."
  );
}

function printableStatus(status) {
  return (status || "pending").replace(/_/g, " ").toUpperCase();
}

function printOrderBill(order, statusOverride = null) {
  const status = statusOverride || order?.status || "pending";
  const items = order?.items || [];
  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
  const tax = subtotal * 0.08;
  const total = Number(order?.total || 0);
  const cancelledNote =
    status === "cancelled" ? cancellationMessage(order) : "";

  const rows = items
    .map(
      (i) =>
        `<tr><td>${i.name}</td><td style="text-align:center;">${i.qty}</td><td style="text-align:right;">$${((i.price || 0) * (i.qty || 0)).toFixed(2)}</td></tr>`,
    )
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Order Bill - ${order.id || order.orderId}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #111; }
          .wrap { max-width: 760px; margin: 0 auto; }
          h1 { margin: 0 0 6px; font-size: 24px; }
          .muted { color: #666; font-size: 12px; }
          .row { display: flex; justify-content: space-between; margin: 8px 0; }
          .status { margin-top: 10px; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border-bottom: 1px solid #ddd; padding: 9px 6px; font-size: 13px; }
          th { text-align: left; }
          .totals { margin-top: 14px; max-width: 280px; margin-left: auto; }
          .totals .row { font-size: 13px; }
          .totals .final { font-size: 16px; font-weight: 700; border-top: 1px solid #bbb; padding-top: 8px; margin-top: 8px; }
          .note { margin-top: 14px; padding: 10px; background: #f8f8f8; border: 1px solid #eee; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Fork.Fleet - Order Bill</h1>
          <div class="muted">Printed at: ${new Date().toLocaleString()}</div>

          <div class="row"><span>Order ID</span><strong>${order.id || order.orderId}</strong></div>
          <div class="row"><span>Order Date</span><strong>${fmtDate(order.createdAt)}</strong></div>
          <div class="row"><span>Customer</span><strong>${order.customerName || "Guest"}</strong></div>
          <div class="row"><span>Phone</span><strong>${order.customerPhone || "N/A"}</strong></div>
          <div class="row"><span>Address</span><strong>${order.deliveryAddress || "N/A"}</strong></div>
          <div class="status">Order Status: ${printableStatus(status)}</div>

          <table>
            <thead>
              <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Amount</th></tr>
            </thead>
            <tbody>${rows || '<tr><td colspan="3">No items</td></tr>'}</tbody>
          </table>

          <div class="totals">
            <div class="row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="row"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
            <div class="row final"><span>Total</span><span>$${total.toFixed(2)}</span></div>
          </div>

          ${cancelledNote ? `<div class="note"><strong>Cancellation Details:</strong><br/>${cancelledNote}</div>` : ""}
        </div>
        <script>window.onload = () => window.print();</script>
      </body>
    </html>
  `;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}

// ── Status label ──────────────────────────────────────────────────────────────
function StatusPill({ status, style = {} }) {
  const sc = STATUS_COLOR[status] || STATUS_COLOR.pending;
  const icons = {
    pending: "⏳",
    confirmed: "✅",
    preparing: "👨‍🍳",
    out_for_delivery: "🛵",
    delivered: "🎉",
    cancelled: "❌",
  };
  return (
    <span
      className="op-status-pill"
      style={{
        background: sc.bg,
        borderColor: sc.border,
        color: sc.text,
        ...style,
      }}
    >
      {icons[status]} {(status || "").replace(/_/g, " ")}
    </span>
  );
}

// ── Big Tracker (for active order hero) ──────────────────────────────────────
function BigTracker({ status }) {
  const curIdx = STATUS_IDX[status] ?? 0;
  if (status === "cancelled") return null;
  return (
    <div className="tracker-wrap">
      <div className="tracker-label-top">📍 Live Tracking</div>
      <div className="tracker-row">
        {STATUS_STEPS.map((step, i) => {
          const done = i < curIdx;
          const active = i === curIdx;
          return (
            <div className="tracker-step" key={step.key}>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`tracker-line${done ? " done" : ""}`} />
              )}
              <div
                className={`tracker-dot${done ? " done" : active ? " active" : ""}`}
              >
                {done ? "✓" : step.icon}
              </div>
              <div
                className={`tracker-step-label${done ? " done" : active ? " active" : ""}`}
              >
                {step.label}
              </div>
              {active && <div className="tracker-step-desc">{step.desc}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mini Tracker (inside collapsed cards) ─────────────────────────────────────
function MiniTracker({ status }) {
  const curIdx = STATUS_IDX[status] ?? 0;
  if (status === "cancelled") return null;
  return (
    <div className="mini-tracker">
      {STATUS_STEPS.map((step, i) => {
        const done = i < curIdx;
        const active = i === curIdx;
        return (
          <div className="mini-step" key={step.key}>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`mini-line${done ? " done" : ""}`} />
            )}
            <div
              className={`mini-dot${done ? " done" : active ? " active" : ""}`}
            >
              {done ? "✓" : step.icon}
            </div>
            <div
              className={`mini-label${done ? " done" : active ? " active" : ""}`}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Active Order Hero Card (top card for latest active order) ─────────────────
function ActiveOrderHero({ order, onReorder }) {
  const [status, setStatus] = useState(order.status);
  const estMins = DELIVERY_ESTIMATE[status] || 0;
  const { minutes, seconds } = useCountdown(estMins);
  const progress = getProgress(status);

  // Poll every 15s
  useEffect(() => {
    const done = ["delivered", "cancelled"].includes(status);
    if (done) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/orders/${order.id || order.orderId}`,
        );
        const data = await res.json();
        if (data.success) setStatus(data.order.status);
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [status]);

  const subtotal = (order.items || []).reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="active-order-hero">
      <div className="aoh-top">
        <div>
          <div
            style={{
              fontSize: ".72rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            🔴 Active Order
          </div>
          <div className="aoh-id">{order.id || order.orderId}</div>
          <div className="aoh-date">
            {fmtDate(order.createdAt)} · {(order.items || []).length} items · $
            {(order.total || 0).toFixed(2)}
          </div>
        </div>
        <StatusPill status={status} />
      </div>

      {/* Delivery countdown */}
      {status !== "delivered" && status !== "cancelled" && (
        <div className="delivery-countdown">
          <div className="dc-icon">
            {status === "out_for_delivery"
              ? "🛵"
              : status === "preparing"
                ? "👨‍🍳"
                : "📋"}
          </div>
          <div>
            <div className="dc-label">Estimated Delivery In</div>
            <div className="dc-time">
              {minutes > 0 ? `${minutes}` : "0"}
              <span style={{ fontSize: "1.2rem" }}>m</span>{" "}
              {String(seconds).padStart(2, "0")}
              <span style={{ fontSize: "1.2rem" }}>s</span>
            </div>
            <div className="dc-unit">
              {status === "out_for_delivery"
                ? "🛵 Rider is on the way!"
                : status === "preparing"
                  ? "👨‍🍳 Almost ready..."
                  : "Waiting for restaurant"}
            </div>
          </div>
          <div className="dc-divider" />
          <div className="dc-progress-wrap">
            <div className="dc-progress-label">
              <span>Order progress</span>
              <span>{progress}%</span>
            </div>
            <div className="dc-progress-track">
              <div
                className="dc-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              style={{
                fontSize: ".72rem",
                color: "rgba(255,255,255,.4)",
                marginTop: 8,
              }}
            >
              Auto-refreshes every 15 seconds
            </div>
          </div>
        </div>
      )}

      {status === "delivered" && (
        <div
          style={{
            background: "rgba(45,198,83,.12)",
            border: "1px solid rgba(45,198,83,.25)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ fontSize: "2rem" }}>🎉</span>
          <div>
            <div
              style={{ color: "#2DC653", fontWeight: 700, fontSize: ".95rem" }}
            >
              Order Delivered!
            </div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".82rem" }}>
              We hope you enjoyed your meal.
            </div>
          </div>
        </div>
      )}

      {/* Tracker */}
      <BigTracker status={status} />

      {/* Items summary */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            fontSize: ".72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            color: "rgba(255,255,255,.35)",
            marginBottom: 10,
          }}
        >
          Items Ordered
        </div>
        {(order.items || []).map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: ".88rem",
              color: "rgba(255,255,255,.7)",
              padding: "5px 0",
              borderBottom: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <span>
              ×{item.qty} {item.name}
            </span>
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>
              ${(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "1rem",
            fontWeight: 900,
            color: "#fff",
            marginTop: 10,
            fontFamily: "var(--font-display)",
          }}
        >
          <span>Total Paid</span>
          <span style={{ color: "var(--accent)" }}>
            ${(order.total || 0).toFixed(2)}
          </span>
        </div>
      </div>

      <div className={`op-actions${status === "cancelled" ? " single" : ""}`}>
        <button
          className="op-print-btn"
          style={{ marginTop: 20 }}
          onClick={() => printOrderBill(order, status)}
        >
          🧾 Print Bill
        </button>
        {status !== "cancelled" && (
          <button
            className="op-reorder-btn"
            style={{ marginTop: 20 }}
            onClick={() => onReorder(order.items)}
          >
            🔄 Reorder Same Items
          </button>
        )}
      </div>
    </div>
  );
}

// ── Regular Order Card ────────────────────────────────────────────────────────
function OrderCard({ order, idx, onReorder }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const estMins = DELIVERY_ESTIMATE[status] || 0;
  const isActive = !["delivered", "cancelled"].includes(status);

  // Poll only when open and active
  useEffect(() => {
    if (!open || !isActive) return;
    const t = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/orders/${order.id || order.orderId}`,
        );
        const data = await res.json();
        if (data.success) setStatus(data.order.status);
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [open, isActive]);

  const subtotal = (order.items || []).reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="op-card" style={{ animationDelay: `${idx * 60}ms` }}>
      <div className="op-card-header" onClick={() => setOpen((o) => !o)}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="op-card-id">{order.id || order.orderId}</div>
          <div className="op-card-meta">
            {fmtDate(order.createdAt)} ·{" "}
            {(order.items || [])
              .slice(0, 2)
              .map((i) => i.name)
              .join(", ")}
            {(order.items || []).length > 2
              ? ` +${order.items.length - 2}`
              : ""}
          </div>
        </div>
        <div className="op-card-right">
          <div>
            <div className="op-card-total">
              ${(order.total || 0).toFixed(2)}
            </div>
            <StatusPill status={status} />
          </div>
          <span className={`op-chevron${open ? " open" : ""}`}>▼</span>
        </div>
      </div>

      <div className={`op-card-body${open ? " open" : ""}`}>
        <div className="op-card-body-inner">
          {status === "cancelled" ? (
            <div className="op-cancelled-bar">
              <span style={{ fontSize: "1.8rem" }}>❌</span>
              <div>
                <strong>Order Cancelled</strong>
                <span>{cancellationMessage(order)}</span>
              </div>
            </div>
          ) : (
            <>
              {/* ETA */}
              {isActive && estMins > 0 && (
                <div className="op-eta">
                  <span style={{ fontSize: "1.8rem" }}>🕐</span>
                  <div>
                    <div className="op-eta-time">~{estMins} min</div>
                    <div className="op-eta-label">
                      Estimated delivery time remaining
                    </div>
                  </div>
                </div>
              )}

              {/* Mini tracker */}
              <MiniTracker status={status} />
            </>
          )}

          {/* Items */}
          <div className="op-items-title">🍽️ Items Ordered</div>
          {(order.items || []).map((item, i) => (
            <div className="op-item-row" key={i}>
              <div className="op-item-qty">×{item.qty}</div>
              <div className="op-item-name">{item.name}</div>
              <div className="op-item-price">
                ${(item.price * item.qty).toFixed(2)}
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="op-summary">
            <div className="op-summary-row">
              <span>Subtotal</span>
              <span>₹{Math.round((order.total || 0))}</span>
            </div>
            <div className="op-summary-row">
              <span>Delivery Fee</span>
              <span>₹30</span>
            </div>
            <div className="op-summary-row">
              <span>Tax (8%)</span>
              <span>${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="op-summary-total">
              <span>Total Paid</span>
              <span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>

          {order.deliveryAddress &&
            order.deliveryAddress !== "Not provided" && (
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
                  background: "var(--surface2)",
                  borderRadius: 10,
                  fontSize: ".83rem",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                📍{" "}
                <strong style={{ color: "var(--text)" }}>Delivered to:</strong>{" "}
                {order.deliveryAddress}
              </div>
            )}

          <div className={`op-actions${status === "cancelled" ? " single" : ""}`}>
            <button
              className="op-print-btn"
              onClick={() => printOrderBill(order, status)}
            >
              🧾 Print Bill
            </button>
            {status !== "cancelled" && (
              <button
                className="op-reorder-btn"
                onClick={() => onReorder(order.items)}
              >
                🔄 Reorder Same Items
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN MyOrdersPage ─────────────────────────────────────────────────────────
export default function MyOrdersPage({
  user,
  setActivePage,
  addToCart,
  showToast,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "op-css";
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.getElementById("op-css")?.remove();
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(
    async (silent = false) => {
      if (!user) {
        setLoading(false);
        return;
      }
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const res = await fetch(`${API_BASE}/orders/my?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders || []);
        }
      } catch {
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Track by ID
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackResult(null);
    try {
      const res = await fetch(
        `${API_BASE}/orders/${trackId.trim().toUpperCase()}`,
      );
      const data = await res.json();
      if (!data.success)
        throw new Error("Order not found. Double-check the Order ID.");
      setTrackResult(data.order);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTrackLoading(false);
    }
  };

  // Reorder
  const handleReorder = (items) => {
    (items || []).forEach((item) => addToCart({ ...item }));
    showToast(`${(items || []).length} items added to cart 🎉`);
  };

  // Filters
  const FILTERS = [
    { key: "all", label: "All" },
    { key: "active", label: "🔴 Active" },
    { key: "delivered", label: "✅ Delivered" },
    { key: "cancelled", label: "❌ Cancelled" },
  ];

  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status),
  );
  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active")
      return !["delivered", "cancelled"].includes(o.status);
    if (filter === "delivered") return o.status === "delivered";
    if (filter === "cancelled") return o.status === "cancelled";
    return true;
  });

  // Latest active order for hero card
  const heroOrder = activeOrders[0];

  // ── Not logged in ──
  if (!user)
    return (
      <div className="op-page">
        <div className="op-body">
          <div className="op-empty">
            <span className="op-empty-icon">🔐</span>
            <div className="op-empty-title">Sign in to track orders</div>
            <p className="op-empty-sub">
              You need to be logged in to see your orders and track delivery.
            </p>
            <button
              className="btn-large"
              style={{ margin: "0 auto", display: "inline-flex" }}
              onClick={() => setActivePage("auth")}
            >
              Sign In →
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="op-page">
      {/* Hero */}
      <div className="op-hero">
        <div className="op-hero-inner">
          <div className="op-tag">📦 Order Tracking</div>
          <h1 className="op-title">Where's My Order?</h1>
          <p className="op-sub">
            {activeOrders.length > 0
              ? `🔴 ${activeOrders.length} active order${activeOrders.length > 1 ? "s" : ""} — tracking live`
              : orders.length > 0
                ? `You have ${orders.length} past order${orders.length !== 1 ? "s" : ""}`
                : "All your orders appear here"}
          </p>

          {/* Track any order */}
          <form className="op-track-bar" onSubmit={handleTrack}>
            <span style={{ color: "var(--muted)" }}>🔍</span>
            <input
              placeholder="Enter Order ID (e.g. ORD-1000)"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
            />
            <button
              className="op-track-btn"
              type="submit"
              disabled={trackLoading}
            >
              {trackLoading ? "…" : "Track →"}
            </button>
          </form>

          {trackError && (
            <div
              style={{
                marginTop: 12,
                padding: "11px 16px",
                background: "rgba(230,57,70,.1)",
                border: "1px solid rgba(230,57,70,.25)",
                borderRadius: 10,
                color: "#E63946",
                fontSize: ".86rem",
                maxWidth: 500,
              }}
            >
              ❌ {trackError}
            </div>
          )}

          {trackResult && (
            <div className="op-track-result">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "var(--text)",
                  marginBottom: 4,
                }}
              >
                {trackResult.id || trackResult.orderId}
              </div>
              <div
                style={{
                  fontSize: ".78rem",
                  color: "var(--muted)",
                  marginBottom: 16,
                }}
              >
                {fmtDate(trackResult.createdAt)} · $
                {(trackResult.total || 0).toFixed(2)} ·{" "}
                {(trackResult.items || []).length} items
              </div>
              <StatusPill
                status={trackResult.status}
                style={{ marginBottom: 16 }}
              />
              <MiniTracker status={trackResult.status} />
              {DELIVERY_ESTIMATE[trackResult.status] > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "rgba(244,164,53,.08)",
                    borderRadius: 10,
                    fontSize: ".85rem",
                    color: "var(--muted)",
                    border: "1px solid rgba(244,164,53,.15)",
                  }}
                >
                  🕐 Estimated delivery:{" "}
                  <strong style={{ color: "var(--accent)" }}>
                    ~{DELIVERY_ESTIMATE[trackResult.status]} minutes
                  </strong>
                </div>
              )}
              {trackResult.status === "delivered" && (
                <div
                  style={{
                    marginTop: 10,
                    color: "#2DC653",
                    fontWeight: 700,
                    fontSize: ".9rem",
                  }}
                >
                  🎉 This order has been delivered!
                </div>
              )}
              {trackResult.status === "cancelled" && (
                <div
                  style={{
                    marginTop: 10,
                    color: "#E63946",
                    fontWeight: 700,
                    fontSize: ".9rem",
                  }}
                >
                  ❌ This order was cancelled.
                  <div
                    style={{
                      marginTop: 6,
                      fontWeight: 500,
                      color: "var(--muted)",
                      fontSize: ".8rem",
                    }}
                  >
                    {cancellationMessage(trackResult)}
                  </div>
                </div>
              )}
              <button
                className="op-print-btn"
                style={{ marginTop: 12 }}
                onClick={() => printOrderBill(trackResult, trackResult.status)}
              >
                🧾 Print Bill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="op-body">
        {/* Filter + refresh */}
        {!loading && orders.length > 0 && (
          <div className="op-filters">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`op-filter-btn${filter === f.key ? " active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                <span style={{ marginLeft: 5, opacity: 0.65 }}>
                  (
                  {
                    orders.filter((o) =>
                      f.key === "all"
                        ? true
                        : f.key === "active"
                          ? !["delivered", "cancelled"].includes(o.status)
                          : o.status === f.key,
                    ).length
                  }
                  )
                </span>
              </button>
            ))}
            <button
              className={`op-refresh-btn${refreshing ? " spinning" : ""}`}
              onClick={() => fetchOrders(true)}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        )}

        {/* Active hero card */}
        {!loading && heroOrder && (
          <ActiveOrderHero order={heroOrder} onReorder={handleReorder} />
        )}

        {/* Loading */}
        {loading &&
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="op-skel"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div
                  className="skel-line"
                  style={{ width: "28%", height: 16 }}
                />
                <div
                  className="skel-line"
                  style={{ width: "16%", height: 16 }}
                />
              </div>
              <div className="skel-line" style={{ width: "50%", height: 12 }} />
              <div className="skel-line" style={{ width: "38%", height: 12 }} />
            </div>
          ))}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="op-empty">
            <span className="op-empty-icon">🛵</span>
            <div className="op-empty-title">No orders yet!</div>
            <p className="op-empty-sub">
              Place your first order and track it live right here.
            </p>
            <button
              className="btn-large"
              style={{ margin: "0 auto", display: "inline-flex" }}
              onClick={() => setActivePage("menu")}
            >
              Browse Menu →
            </button>
          </div>
        )}

        {/* No filter match */}
        {!loading && orders.length > 0 && filteredOrders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              color: "var(--muted)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🔎</div>
            <p style={{ fontWeight: 600, color: "var(--text)" }}>
              No {filter} orders
            </p>
            <button
              onClick={() => setFilter("all")}
              style={{
                marginTop: 14,
                padding: "8px 20px",
                borderRadius: 50,
                border: "1px solid var(--border)",
                background: "var(--surface2)",
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: ".85rem",
              }}
            >
              Show all
            </button>
          </div>
        )}

        {/* Order cards (skip hero order in list) */}
        {!loading &&
          filteredOrders
            .filter(
              (o) =>
                o._id !== heroOrder?._id &&
                (o.id || o.orderId) !== (heroOrder?.id || heroOrder?.orderId),
            )
            .map((order, i) => (
              <OrderCard
                key={order._id || order.id || i}
                order={order}
                idx={i}
                onReorder={handleReorder}
              />
            ))}
      </div>
    </div>
  );
}