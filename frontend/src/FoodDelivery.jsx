import { useState, useEffect, useRef } from "react";
import MyOrdersPage from "./MyOrdersPage";

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

const HERO_DISH =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80";
const API_BASE = "http://localhost:5000/api";

const CATEGORIES = [
  { id: "all", label: "All", emoji: "🍽️" },
  { id: "burger", label: "Burgers", emoji: "🍔" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "sushi", label: "Sushi", emoji: "🍱" },
  { id: "salad", label: "Salads", emoji: "🥗" },
  { id: "dessert", label: "Desserts", emoji: "🍰" },
];

const STATIC_MENU = [
  {
    id: 1,
    name: "Smash Burger Deluxe",
    category: "burger",
    price: 14.99,
    rating: 4.9,
    reviews: 312,
    time: "18 min",
    cal: 720,
    badge: "🔥 Bestseller",
    desc: "Double smash patty, aged cheddar, secret sauce",
  },
  {
    id: 2,
    name: "Truffle Margherita",
    category: "pizza",
    price: 18.5,
    rating: 4.8,
    reviews: 214,
    time: "22 min",
    cal: 890,
    badge: "⭐ Chef's Pick",
    desc: "San Marzano tomato, buffalo mozzarella, truffle oil",
  },
  {
    id: 3,
    name: "Dragon Roll",
    category: "sushi",
    price: 22.0,
    rating: 4.9,
    reviews: 189,
    time: "25 min",
    cal: 420,
    badge: "🌿 Fresh",
    desc: "Shrimp tempura, avocado, spicy tobiko",
  },
  {
    id: 4,
    name: "Harvest Bowl",
    category: "salad",
    price: 13.5,
    rating: 4.7,
    reviews: 156,
    time: "12 min",
    cal: 380,
    badge: "💚 Healthy",
    desc: "Kale, quinoa, roasted veggies, lemon tahini",
  },
  {
    id: 5,
    name: "Crème Brûlée",
    category: "dessert",
    price: 9.99,
    rating: 5.0,
    reviews: 98,
    time: "10 min",
    cal: 310,
    badge: "✨ New",
    desc: "Classic vanilla custard, caramelized sugar crust",
  },
  {
    id: 6,
    name: "BBQ Bacon Melt",
    category: "burger",
    price: 16.5,
    rating: 4.8,
    reviews: 274,
    time: "20 min",
    cal: 850,
    badge: "🔥 Hot",
    desc: "Wagyu beef, smoked bacon, chipotle BBQ",
  },
  {
    id: 7,
    name: "Pepperoni Supreme",
    category: "pizza",
    price: 20.0,
    rating: 4.7,
    reviews: 301,
    time: "24 min",
    cal: 960,
    badge: null,
    desc: "Thick crust, triple pepperoni, roasted garlic",
  },
  {
    id: 8,
    name: "Rainbow Roll",
    category: "sushi",
    price: 24.5,
    rating: 4.9,
    reviews: 143,
    time: "28 min",
    cal: 460,
    badge: "⭐ Popular",
    desc: "Tuna, salmon, yellowtail, seasonal fish",
  },
  {
    id: 9,
    name: "Chocolate Lava Cake",
    category: "dessert",
    price: 11.5,
    rating: 4.9,
    reviews: 267,
    time: "15 min",
    cal: 490,
    badge: "🍫 Indulgent",
    desc: "Warm dark chocolate, vanilla gelato",
  },
];

const RESTAURANT_SUGGESTIONS = [
  { name: "The Burger Lab", type: "restaurant", emoji: "🍔" },
  { name: "Sakura Sushi", type: "restaurant", emoji: "🍱" },
  { name: "Pizza Paradiso", type: "restaurant", emoji: "🍕" },
  { name: "Green Bowl Co.", type: "restaurant", emoji: "🥗" },
];

const STEPS = [
  { icon: "📍", title: "Choose Location", desc: "Set your delivery address" },
  { icon: "🍴", title: "Pick Your Meal", desc: "Browse our fresh menu" },
  { icon: "💳", title: "Quick Checkout", desc: "Secure, fast payment" },
  { icon: "🛵", title: "Fast Delivery", desc: "Track in real-time" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Food Blogger",
    rating: 5,
    text: "Absolutely incredible! The smash burger arrived hot and fresh in under 25 minutes. Best delivery app I've ever used.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    name: "Rahul Mehta",
    role: "Software Engineer",
    rating: 5,
    text: "The truffle pizza is out of this world. I order it every Friday. Packaging is perfect and food is always restaurant quality.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    name: "Anjali Patel",
    role: "Fitness Coach",
    rating: 4,
    text: "Love the healthy options! The harvest bowl is my go-to post-workout meal. Clean ingredients, great taste.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
  },
];

const POPULAR_RESTAURANTS = [
  {
    name: "The Burger Lab",
    cuisine: "American",
    rating: 4.9,
    time: "20-30 min",
    img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80",
    promo: "Free delivery",
  },
  {
    name: "Sakura Sushi",
    cuisine: "Japanese",
    rating: 4.8,
    time: "25-35 min",
    img: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&q=80",
    promo: "20% off",
  },
  {
    name: "Pizza Paradiso",
    cuisine: "Italian",
    rating: 4.7,
    time: "22-32 min",
    img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80",
    promo: null,
  },
  {
    name: "Green Bowl Co.",
    cuisine: "Healthy",
    rating: 4.8,
    time: "15-20 min",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
    promo: "New",
  },
];

const INITIAL_REVIEWS = [
  {
    id: 1,
    itemId: 1,
    user: "Arjun K.",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=60&q=80",
    rating: 5,
    text: "The smash burger is absolutely insane. Crispy edges, melty cheese — 10/10 every time.",
    date: "2 days ago",
  },
  {
    id: 2,
    itemId: 2,
    user: "Meera S.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80",
    rating: 5,
    text: "Truffle Margherita is dreamy. Arrived piping hot and the truffle oil aroma was incredible.",
    date: "3 days ago",
  },
  {
    id: 3,
    itemId: 3,
    user: "Vikram P.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80",
    rating: 4,
    text: "Dragon Roll was super fresh. Packaging kept it cold perfectly. Will order again!",
    date: "5 days ago",
  },
  {
    id: 4,
    itemId: 9,
    user: "Sneha R.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80",
    rating: 5,
    text: "The lava cake is DANGEROUS. So rich and warm, the gelato pairing is perfect.",
    date: "1 week ago",
  },
  {
    id: 5,
    itemId: 4,
    user: "Karan M.",
    avatar:
      "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&q=80",
    rating: 4,
    text: "Harvest Bowl is my weekly go-to. Healthy, filling and actually delicious.",
    date: "1 week ago",
  },
  {
    id: 6,
    itemId: 6,
    user: "Priya T.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80",
    rating: 5,
    text: "BBQ Bacon Melt hit different. The chipotle sauce is a perfect smoky kick.",
    date: "2 weeks ago",
  },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
[data-theme="dark"]{
  --bg:#0A0A0A;--bg2:#111;--surface:#141414;--surface2:#1E1E1E;--surface3:#252525;
  --border:rgba(255,255,255,.07);--border2:rgba(255,255,255,.12);
  --text:#F0EDE8;--text2:#C8C4BE;--muted:#7A7672;--shadow:rgba(0,0,0,.5);
}
[data-theme="light"]{
  --bg:#FAFAF8;--bg2:#F4F1EC;--surface:#FFF;--surface2:#F7F4EF;--surface3:#EDE9E2;
  --border:rgba(0,0,0,.08);--border2:rgba(0,0,0,.14);
  --text:#1A1714;--text2:#3D3830;--muted:#8A8278;--shadow:rgba(0,0,0,.12);
}
:root{
  --accent:#F4A435;--accent2:#FF6B35;--green:#2DC653;--red:#E63946;
  --radius:20px;--font-display:'Fraunces',serif;--font-body:'DM Sans',sans-serif;
  --transition:all .25s ease;
}
html{scroll-behavior:smooth;scroll-padding-top:88px;}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;transition:background .3s,color .3s;}
::-webkit-scrollbar{width:5px;}
::-webkit-scrollbar-track{background:var(--bg);}
::-webkit-scrollbar-thumb{background:var(--surface2);border-radius:10px;}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:72px;background:var(--surface);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);transition:var(--transition);}
.nav-logo{font-family:var(--font-display);font-size:1.7rem;font-weight:900;color:var(--text);letter-spacing:-.5px;cursor:pointer;display:flex;align-items:center;gap:8px;}
.nav-logo-dot{color:var(--accent);}
.nav-links{display:flex;gap:32px;list-style:none;}
.nav-links a{color:var(--muted);text-decoration:none;font-size:.9rem;font-weight:500;transition:color .2s;cursor:pointer;}
.nav-links a:hover,.nav-links a.active{color:var(--text);}
.nav-actions{display:flex;align-items:center;gap:12px;}
.theme-toggle{width:44px;height:44px;border-radius:12px;background:var(--surface2);border:1px solid var(--border);color:var(--text);font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--transition);}
.theme-toggle:hover{background:var(--accent);border-color:var(--accent);color:#0A0A0A;}
.btn-ghost{background:none;border:1px solid var(--border);color:var(--text);padding:10px 20px;border-radius:50px;font-size:.85rem;font-weight:500;cursor:pointer;transition:var(--transition);font-family:var(--font-body);}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent);}
.btn-primary{background:var(--accent);border:none;color:#0A0A0A;padding:10px 22px;border-radius:50px;font-size:.85rem;font-weight:700;cursor:pointer;transition:var(--transition);font-family:var(--font-body);}
.btn-primary:hover{background:#ffb84d;transform:scale(1.03);}
.cart-btn{position:relative;background:var(--surface2);border:1px solid var(--border);color:var(--text);width:44px;height:44px;border-radius:12px;font-size:1.1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--transition);}
.cart-btn:hover{background:var(--accent);border-color:var(--accent);color:#0A0A0A;}
.cart-count{position:absolute;top:-6px;right:-6px;background:var(--accent2);color:#fff;font-size:.65rem;font-weight:700;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.home-hero{min-height:100vh;position:relative;display:flex;align-items:center;overflow:hidden;padding-top:72px;}
.hero-bg{position:absolute;inset:0;z-index:0;background-image:url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80');background-size:cover;background-position:center;filter:brightness(.28);transition:filter .3s;}
[data-theme="light"] .hero-bg{filter:brightness(.42);}
.hero-overlay{position:absolute;inset:0;z-index:1;background:linear-gradient(115deg,rgba(5,4,2,.82) 0%,rgba(5,4,2,.52) 50%,rgba(5,4,2,.18) 100%),linear-gradient(to bottom,rgba(5,4,2,.2) 0%,transparent 30%,transparent 70%,rgba(5,4,2,.55) 100%);}
.home-hero-content{position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:80px 48px;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
.home-tag{display:inline-flex;align-items:center;gap:8px;background:rgba(244,164,53,.15);border:1px solid rgba(244,164,53,.35);color:var(--accent);padding:8px 16px;border-radius:50px;font-size:.82rem;font-weight:600;margin-bottom:28px;animation:fadeSlideUp .6s ease both;}
.home-title{font-family:var(--font-display);font-size:clamp(3.2rem,5vw,6rem);font-weight:900;line-height:1.0;letter-spacing:-2px;color:#fff;margin-bottom:24px;animation:fadeSlideUp .6s .1s ease both;text-shadow:0 4px 40px rgba(0,0,0,.5);}
.home-title em{font-style:italic;color:var(--accent);}
.home-desc{color:rgba(255,255,255,.76);font-size:1.1rem;line-height:1.7;max-width:440px;margin-bottom:40px;animation:fadeSlideUp .6s .2s ease both;text-shadow:0 2px 16px rgba(0,0,0,.4);}
.home-cta{display:flex;align-items:center;gap:16px;animation:fadeSlideUp .6s .3s ease both;}
.btn-large{background:var(--accent);color:#0A0A0A;border:none;padding:16px 36px;border-radius:50px;font-size:1rem;font-weight:700;cursor:pointer;font-family:var(--font-body);transition:all .25s;display:flex;align-items:center;gap:10px;}
.btn-large:hover{background:#ffb84d;transform:translateY(-2px);box-shadow:0 12px 40px rgba(244,164,53,.45);}
.btn-outline-large{background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.35);padding:16px 36px;border-radius:50px;font-size:1rem;font-weight:500;cursor:pointer;font-family:var(--font-body);transition:all .25s;backdrop-filter:blur(10px);}
.btn-outline-large:hover{background:rgba(255,255,255,.2);border-color:rgba(255,255,255,.55);}
.home-stats{display:flex;gap:40px;margin-top:56px;animation:fadeSlideUp .6s .4s ease both;}
.stat-num{font-family:var(--font-display);font-size:2.2rem;font-weight:900;color:#fff;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.3);}
.stat-label{color:rgba(255,255,255,.5);font-size:.82rem;margin-top:4px;}
.home-hero-img-wrap{position:relative;animation:fadeSlideUp .7s .2s ease both;}
.home-hero-img{width:100%;max-width:500px;aspect-ratio:1;border-radius:50%;object-fit:cover;border:4px solid rgba(244,164,53,.4);box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 0 12px rgba(244,164,53,.1);animation:float 6s ease-in-out infinite;}
.floating-tag{position:absolute;background:rgba(20,20,20,.9);border:1px solid rgba(255,255,255,.12);padding:12px 16px;border-radius:16px;font-size:.8rem;font-weight:600;color:#fff;display:flex;align-items:center;gap:10px;backdrop-filter:blur(10px);}
[data-theme="light"] .floating-tag{background:rgba(255,255,255,.95);border-color:var(--border2);color:var(--text);box-shadow:0 8px 32px var(--shadow);}
.ftag-1{top:40px;right:-20px;animation:float 5s ease-in-out infinite;}
.ftag-2{bottom:60px;left:-30px;animation:float 5s 1.5s ease-in-out infinite;}
.ftag-icon{font-size:1.5rem;}
.home-search-wrap{position:relative;z-index:10;padding:0 48px;margin-top:-36px;}
.home-search{max-width:900px;margin:0 auto;background:var(--surface);border:1px solid var(--border2);border-radius:20px;padding:20px 28px;display:flex;align-items:center;gap:20px;box-shadow:0 20px 60px var(--shadow);transition:border-color .2s,box-shadow .2s;}
.home-search.focused{border-color:var(--accent);box-shadow:0 20px 60px var(--shadow),0 0 0 3px rgba(244,164,53,.12);}
.search-divider{width:1px;height:32px;background:var(--border2);flex-shrink:0;}
.search-field{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.search-field input{background:none;border:none;color:var(--text);font-family:var(--font-body);font-size:.95rem;outline:none;width:100%;}
.search-field input::placeholder{color:var(--muted);}
.search-field label{color:var(--muted);font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;}
.search-submit{background:var(--accent);border:none;color:#0A0A0A;padding:12px 28px;border-radius:12px;font-size:.9rem;font-weight:700;cursor:pointer;font-family:var(--font-body);transition:var(--transition);white-space:nowrap;flex-shrink:0;}
.search-submit:hover{background:#ffb84d;}
.search-suggestions-wrap{max-width:900px;margin:6px auto 0;position:relative;}
.search-suggestions{background:var(--surface);border:1px solid var(--border2);border-radius:16px;overflow:hidden;box-shadow:0 16px 48px var(--shadow);animation:suggestIn .22s cubic-bezier(.34,1.4,.64,1) both;}
@keyframes suggestIn{from{opacity:0;transform:translateY(-8px) scaleY(.96);}to{opacity:1;transform:translateY(0) scaleY(1);}}
.suggest-section-label{padding:10px 18px 6px;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);}
.suggest-item{display:flex;align-items:center;gap:14px;padding:11px 18px;cursor:pointer;transition:background .15s;border-bottom:1px solid var(--border);}
.suggest-item:last-child{border-bottom:none;}
.suggest-item:hover{background:var(--surface2);}
.suggest-item-icon{width:38px;height:38px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;overflow:hidden;}
.suggest-item-icon img{width:100%;height:100%;object-fit:cover;}
.suggest-item-info{flex:1;min-width:0;}
.suggest-item-name{font-weight:600;font-size:.9rem;color:var(--text);}
.suggest-item-name mark{background:none;color:var(--accent);font-weight:700;}
.suggest-item-meta{font-size:.76rem;color:var(--muted);margin-top:2px;}
.suggest-item-price{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--text);flex-shrink:0;}
.suggest-empty{padding:20px 18px;text-align:center;color:var(--muted);font-size:.9rem;}
.suggest-footer{padding:10px 18px;background:var(--surface2);border-top:1px solid var(--border);font-size:.82rem;color:var(--muted);display:flex;align-items:center;gap:8px;cursor:pointer;transition:color .15s;}
.suggest-footer:hover{color:var(--accent);}
.section{padding:90px 48px;}
.section-inner{max-width:1200px;margin:0 auto;}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:48px;}
.section-tag{display:inline-flex;align-items:center;gap:8px;color:var(--accent);font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}
.section-title{font-family:var(--font-display);font-size:clamp(2rem,3vw,3rem);font-weight:900;letter-spacing:-1px;line-height:1.1;color:var(--text);}
.link-all{color:var(--accent);font-size:.9rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;text-decoration:none;transition:gap .2s;white-space:nowrap;}
.link-all:hover{gap:10px;}
.restaurants-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.restaurant-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .3s cubic-bezier(.34,1.3,.64,1);}
.restaurant-card:hover{transform:translateY(-6px);box-shadow:0 20px 50px var(--shadow);border-color:var(--border2);}
.restaurant-img{width:100%;height:160px;object-fit:cover;transition:transform .4s ease;}
.restaurant-card:hover .restaurant-img{transform:scale(1.06);}
.restaurant-img-wrap{overflow:hidden;position:relative;}
.restaurant-promo{position:absolute;top:12px;left:12px;background:var(--accent);color:#0A0A0A;font-size:.72rem;font-weight:700;padding:5px 12px;border-radius:50px;}
.restaurant-body{padding:16px 18px;}
.restaurant-name{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:6px;color:var(--text);}
.restaurant-meta{display:flex;align-items:center;gap:12px;font-size:.8rem;color:var(--muted);}
.restaurant-rating{color:var(--accent);font-weight:700;}
.popular-scroll{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
.menu-page{padding-top:72px;}
.menu-header{background:var(--surface);border-bottom:1px solid var(--border);padding:40px 48px 0;position:sticky;top:72px;z-index:50;}
.menu-header-inner{max-width:1200px;margin:0 auto;}
.menu-page-title{font-family:var(--font-display);font-size:2.5rem;font-weight:900;letter-spacing:-1px;margin-bottom:24px;color:var(--text);}
.menu-controls{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-bottom:20px;}
.categories{display:flex;gap:10px;flex-wrap:wrap;}
.cat-btn{background:var(--surface2);border:1px solid var(--border);color:var(--muted);padding:9px 18px;border-radius:50px;font-size:.85rem;font-weight:500;cursor:pointer;transition:var(--transition);font-family:var(--font-body);display:flex;align-items:center;gap:7px;white-space:nowrap;}
.cat-btn:hover{border-color:var(--accent);color:var(--text);}
.cat-btn.active{background:var(--accent);border-color:var(--accent);color:#0A0A0A;font-weight:700;}
.menu-search-wrap{position:relative;}
.search-bar{display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border);border-radius:50px;padding:10px 18px;min-width:260px;transition:border-color .2s,box-shadow .2s;}
.search-bar:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px rgba(244,164,53,.12);}
.search-bar input{background:none;border:none;color:var(--text);font-family:var(--font-body);font-size:.9rem;outline:none;flex:1;}
.search-bar input::placeholder{color:var(--muted);}
.menu-suggestions{position:absolute;top:calc(100% + 8px);left:0;right:0;background:var(--surface);border:1px solid var(--border2);border-radius:14px;overflow:hidden;z-index:100;box-shadow:0 12px 40px var(--shadow);animation:suggestIn .2s cubic-bezier(.34,1.4,.64,1) both;}
.menu-sug-item{display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;transition:background .12s;border-bottom:1px solid var(--border);}
.menu-sug-item:last-child{border-bottom:none;}
.menu-sug-item:hover{background:var(--surface2);}
.menu-sug-img{width:36px;height:36px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.menu-sug-name{font-weight:600;font-size:.87rem;color:var(--text);}
.menu-sug-name mark{background:none;color:var(--accent);font-weight:700;}
.menu-sug-price{font-size:.8rem;color:var(--muted);margin-top:1px;}
.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;padding:40px 48px;max-width:1200px;margin:0 auto;}
.food-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;cursor:pointer;transition:all .3s cubic-bezier(.34,1.3,.64,1);}
.food-card:hover{transform:translateY(-6px);border-color:var(--border2);box-shadow:0 20px 60px var(--shadow);}
.food-card-img{height:200px;overflow:hidden;position:relative;}
.food-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;}
.food-card:hover .food-card-img img{transform:scale(1.08);}
.food-card-badge{position:absolute;top:14px;left:14px;background:rgba(10,10,10,.82);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);padding:5px 12px;border-radius:50px;font-size:.7rem;font-weight:700;color:#fff;}
.food-card-body{padding:20px;}
.food-card-name{font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin-bottom:6px;color:var(--text);letter-spacing:-.3px;}
.food-card-desc{color:var(--muted);font-size:.83rem;line-height:1.5;margin-bottom:14px;}
.food-card-meta{display:flex;align-items:center;gap:14px;font-size:.78rem;color:var(--muted);margin-bottom:16px;}
.food-card-meta span{display:flex;align-items:center;gap:4px;}
.rating-val{color:var(--accent);font-weight:700;}
.food-card-footer{display:flex;align-items:center;justify-content:space-between;}
.food-price{font-family:var(--font-display);font-size:1.5rem;font-weight:900;color:var(--text);}
.add-btn{background:var(--accent);border:none;color:#0A0A0A;width:38px;height:38px;border-radius:50%;font-size:1.2rem;font-weight:700;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;}
.add-btn:hover{background:#ffb84d;transform:scale(1.12) rotate(90deg);}
.add-btn.added{background:var(--green);color:#fff;}
.how-section{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.steps-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
.step-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:32px 24px;text-align:center;transition:all .3s;}
.step-card:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 12px 40px var(--shadow);}
.step-icon{width:72px;height:72px;background:var(--surface2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin:0 auto 20px;border:1px solid var(--border);}
.step-num{font-family:var(--font-display);font-size:.75rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:2px;margin-bottom:10px;}
.step-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--text);}
.step-desc{color:var(--muted);font-size:.85rem;line-height:1.6;}
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
.testimonial-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px;transition:var(--transition);}
.testimonial-card:hover{border-color:var(--border2);box-shadow:0 12px 40px var(--shadow);}
.stars{color:var(--accent);font-size:.9rem;margin-bottom:14px;}
.testimonial-text{color:var(--text2);font-size:.93rem;line-height:1.7;margin-bottom:20px;font-style:italic;}
.testimonial-author{display:flex;align-items:center;gap:12px;}
.author-avatar{width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);}
.author-name{font-weight:700;font-size:.9rem;color:var(--text);}
.author-role{color:var(--muted);font-size:.78rem;}
.reviews-section{padding:80px 48px;background:var(--surface);border-top:1px solid var(--border);}
.reviews-inner{max-width:1200px;margin:0 auto;}
.reviews-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;flex-wrap:wrap;gap:20px;}
.reviews-summary{display:flex;align-items:center;gap:24px;background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:20px 28px;}
.reviews-big-rating{font-family:var(--font-display);font-size:3.5rem;font-weight:900;color:var(--text);line-height:1;}
.reviews-big-stars{color:var(--accent);font-size:1.2rem;margin-bottom:4px;}
.reviews-big-count{color:var(--muted);font-size:.85rem;}
.reviews-bars{display:flex;flex-direction:column;gap:6px;}
.reviews-bar-row{display:flex;align-items:center;gap:10px;font-size:.8rem;color:var(--muted);}
.reviews-bar-track{width:100px;height:6px;background:var(--surface2);border-radius:3px;overflow:hidden;}
.reviews-bar-fill{height:100%;background:var(--accent);border-radius:3px;transition:width .6s ease;}
.reviews-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;margin-bottom:40px;}
.review-card{background:var(--bg);border:1px solid var(--border);border-radius:18px;padding:22px;transition:all .25s;animation:reviewIn .4s cubic-bezier(.34,1.3,.64,1) both;}
.review-card:hover{border-color:var(--border2);box-shadow:0 8px 32px var(--shadow);transform:translateY(-3px);}
@keyframes reviewIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.review-card-header{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.review-avatar{width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid var(--border2);}
.review-user-name{font-weight:700;font-size:.9rem;color:var(--text);}
.review-date{color:var(--muted);font-size:.75rem;margin-top:2px;}
.review-rating{margin-left:auto;color:var(--accent);font-size:.85rem;font-weight:700;}
.review-item-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(244,164,53,.1);border:1px solid rgba(244,164,53,.2);color:var(--accent);padding:4px 12px;border-radius:50px;font-size:.72rem;font-weight:600;margin-bottom:10px;}
.review-text{color:var(--text2);font-size:.88rem;line-height:1.65;}
.write-review{background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:32px;margin-top:8px;}
.write-review-title{font-family:var(--font-display);font-size:1.4rem;font-weight:700;color:var(--text);margin-bottom:24px;}
.wr-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;}
.wr-field{display:flex;flex-direction:column;gap:8px;}
.wr-field label{font-size:.8rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;}
.wr-field input,.wr-field select,.wr-field textarea{padding:12px 16px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:var(--font-body);font-size:.92rem;outline:none;transition:border-color .2s,box-shadow .2s;}
.wr-field input:focus,.wr-field select:focus,.wr-field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(244,164,53,.12);}
.wr-field input::placeholder,.wr-field textarea::placeholder{color:var(--muted);}
.wr-field textarea{resize:vertical;min-height:90px;}
.wr-field select{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237A7672' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;}
.star-picker{display:flex;gap:6px;align-items:center;}
.star-pick-btn{font-size:1.5rem;background:none;border:none;cursor:pointer;transition:transform .15s;padding:0;line-height:1;}
.star-pick-btn:hover{transform:scale(1.2);}
.wr-submit{background:var(--accent);color:#0A0A0A;border:none;padding:13px 32px;border-radius:12px;font-size:.95rem;font-weight:700;cursor:pointer;font-family:var(--font-body);transition:var(--transition);margin-top:4px;}
.wr-submit:hover{background:#ffb84d;transform:scale(1.02);}
.wr-success{display:flex;align-items:center;gap:10px;background:rgba(45,198,83,.1);border:1px solid rgba(45,198,83,.25);color:var(--green);padding:14px 18px;border-radius:12px;font-weight:600;font-size:.9rem;animation:reviewIn .3s ease both;}
.promo{background:linear-gradient(135deg,#1A1200 0%,#261A00 50%,#1A1200 100%);border:1px solid rgba(244,164,53,.2);border-radius:28px;padding:60px 64px;display:flex;align-items:center;justify-content:space-between;overflow:hidden;position:relative;}
[data-theme="light"] .promo{background:linear-gradient(135deg,#FFF8E7 0%,#FFF3D0 50%,#FFF8E7 100%);border-color:rgba(244,164,53,.35);}
.promo::before{content:'';position:absolute;right:-100px;top:-100px;width:400px;height:400px;background:radial-gradient(circle,rgba(244,164,53,.15) 0%,transparent 70%);}
.promo-label{color:var(--accent);font-size:.82rem;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px;}
.promo-title{font-family:var(--font-display);font-size:clamp(2rem,3vw,3rem);font-weight:900;letter-spacing:-1px;margin-bottom:12px;color:var(--text);}
.promo-sub{color:var(--muted);font-size:.95rem;margin-bottom:32px;}
.promo-code{display:inline-flex;align-items:center;gap:12px;background:rgba(244,164,53,.12);border:1px dashed rgba(244,164,53,.4);padding:12px 20px;border-radius:12px;margin-bottom:28px;}
.promo-code span{color:var(--accent);font-weight:700;font-size:1.2rem;letter-spacing:3px;}
.promo-img{width:240px;height:240px;border-radius:50%;object-fit:cover;border:4px solid rgba(244,164,53,.4);animation:float 5s ease-in-out infinite;position:relative;z-index:1;}
.cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);z-index:200;opacity:0;pointer-events:none;transition:opacity .3s;}
.cart-overlay.open{opacity:1;pointer-events:all;}
.cart-sidebar{position:fixed;top:0;right:0;bottom:0;width:420px;background:var(--surface);border-left:1px solid var(--border);z-index:201;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .38s cubic-bezier(.34,1.2,.64,1);padding:32px 28px;}
.cart-sidebar.open{transform:translateX(0);}
.cart-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;}
.cart-title{font-family:var(--font-display);font-size:1.6rem;font-weight:900;color:var(--text);}
.close-btn{background:var(--surface2);border:1px solid var(--border);color:var(--muted);width:36px;height:36px;border-radius:10px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;transition:var(--transition);}
.close-btn:hover{color:var(--text);background:var(--surface3);}
.cart-items{flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;gap:10px;padding-right:2px;}
.cart-item{display:flex;align-items:center;gap:14px;background:var(--surface2);padding:12px 14px;border-radius:14px;border:1px solid var(--border);animation:cartIn .4s cubic-bezier(.34,1.45,.64,1) both;transition:transform .28s cubic-bezier(.34,1.3,.64,1),opacity .28s ease,max-height .35s ease,padding .3s ease,margin .3s ease,background .2s ease,border-color .2s ease;max-height:120px;overflow:hidden;}
.cart-item:hover{background:var(--surface3);border-color:var(--border2);transform:translateX(-4px) scale(1.01);}
.cart-item.removing{opacity:0;transform:translateX(50px) scaleY(.7);max-height:0!important;padding-top:0!important;padding-bottom:0!important;margin-top:-4px;border-width:0;pointer-events:none;}
@keyframes cartIn{0%{opacity:0;transform:translateX(36px) scaleY(.85);}55%{transform:translateX(-5px) scaleY(1.02);}100%{opacity:1;transform:translateX(0) scaleY(1);}}
.cart-item-img{width:56px;height:56px;border-radius:10px;object-fit:cover;flex-shrink:0;transition:transform .25s;}
.cart-item:hover .cart-item-img{transform:scale(1.08);}
.cart-item-info{flex:1;min-width:0;}
.cart-item-name{font-weight:600;font-size:.88rem;margin-bottom:4px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cart-item-price{color:var(--accent);font-weight:700;font-size:.85rem;}
.qty-controls{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.qty-btn{background:var(--surface);border:1px solid var(--border);color:var(--text);width:28px;height:28px;border-radius:8px;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:all .22s cubic-bezier(.34,1.4,.64,1);}
.qty-btn:hover{background:var(--accent);border-color:var(--accent);color:#0A0A0A;transform:scale(1.18);}
.qty-btn:active{transform:scale(.9);}
.qty-num{font-weight:700;font-size:.95rem;min-width:24px;text-align:center;color:var(--text);display:inline-block;transition:transform .18s cubic-bezier(.34,1.6,.64,1);}
.qty-num.bump{transform:scale(1.45);}
.cart-footer{margin-top:16px;padding-top:16px;border-top:1px solid var(--border);}
.cart-row{display:flex;justify-content:space-between;color:var(--muted);font-size:.88rem;margin-bottom:10px;}
.cart-total{display:flex;justify-content:space-between;font-family:var(--font-display);font-size:1.4rem;font-weight:900;margin-bottom:18px;margin-top:8px;color:var(--text);}
.cart-total-amount{color:var(--accent);display:inline-block;}
.cart-total-amount.pop{animation:totalPop .32s cubic-bezier(.34,1.6,.64,1) both;}
@keyframes totalPop{0%{transform:scale(1);}40%{transform:scale(1.22);}100%{transform:scale(1);}}
.checkout-btn{width:100%;background:var(--accent);color:#0A0A0A;border:none;padding:16px;border-radius:14px;font-size:1rem;font-weight:700;cursor:pointer;font-family:var(--font-body);transition:var(--transition);display:flex;align-items:center;justify-content:center;gap:10px;}
.checkout-btn:hover{background:#ffb84d;transform:scale(1.01);}
.cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;}
.cart-empty-img{width:110px;height:110px;border-radius:50%;object-fit:cover;opacity:.3;filter:grayscale(.4);}
.auth-page{min-height:100vh;padding-top:72px;display:flex;align-items:center;justify-content:center;background:var(--bg);}
.auth-container{width:100%;max-width:440px;background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:48px 40px;box-shadow:0 24px 80px var(--shadow);}
.auth-tabs{display:flex;gap:8px;margin-bottom:36px;background:var(--surface2);padding:6px;border-radius:14px;border:1px solid var(--border);}
.auth-tab{flex:1;padding:12px 20px;border:none;background:transparent;color:var(--muted);font-family:var(--font-body);font-size:.95rem;font-weight:600;border-radius:10px;cursor:pointer;transition:all .35s cubic-bezier(.34,1.4,.64,1);}
.auth-tab:hover{color:var(--text);}
.auth-tab.active{background:var(--accent);color:#0A0A0A;transform:scale(1.04);box-shadow:0 4px 16px rgba(244,164,53,.35);}
.auth-form{display:flex;flex-direction:column;gap:20px;}
.auth-fields-wrap{display:flex;flex-direction:column;gap:16px;overflow:hidden;}
@keyframes fieldSlideIn{0%{opacity:0;transform:translateY(-10px) scaleY(.9);}100%{opacity:1;transform:translateY(0) scaleY(1);}}
.auth-field-item{animation:fieldSlideIn .38s cubic-bezier(.34,1.4,.64,1) both;transform-origin:top center;}
.auth-field-item:nth-child(1){animation-delay:0ms;}.auth-field-item:nth-child(2){animation-delay:55ms;}.auth-field-item:nth-child(3){animation-delay:110ms;}.auth-field-item:nth-child(4){animation-delay:165ms;}
.auth-field{display:flex;flex-direction:column;gap:8px;}
.auth-field label{font-size:.82rem;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.5px;}
.auth-field input{padding:14px 18px;border-radius:12px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-family:var(--font-body);font-size:.95rem;outline:none;transition:border-color .2s,box-shadow .2s;}
.auth-field input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(244,164,53,.15);}
.auth-field input::placeholder{color:var(--muted);}
.auth-error{background:rgba(230,57,70,.1);border:1px solid rgba(230,57,70,.3);color:var(--red);padding:12px 16px;border-radius:12px;font-size:.88rem;font-weight:500;}
.auth-submit{width:100%;padding:16px;border:none;background:var(--accent);color:#0A0A0A;font-family:var(--font-body);font-size:1rem;font-weight:700;border-radius:14px;cursor:pointer;transition:var(--transition);margin-top:8px;}
.auth-submit:hover{background:#ffb84d;transform:scale(1.01);}
.auth-submit:disabled{opacity:.7;cursor:not-allowed;transform:none;}
.auth-switch{text-align:center;margin-top:24px;color:var(--muted);font-size:.9rem;}
.auth-switch button{background:none;border:none;color:var(--accent);font-weight:700;cursor:pointer;font-family:var(--font-body);margin-left:6px;padding:0;}
.auth-switch button:hover{text-decoration:underline;}
.auth-success{background:rgba(45,198,83,.1);border:1px solid rgba(45,198,83,.3);color:var(--green);padding:12px 16px;border-radius:12px;font-size:.88rem;font-weight:500;}
.auth-subtitle{color:var(--muted);font-size:.9rem;margin-top:8px;animation:fieldSlideIn .38s cubic-bezier(.34,1.4,.64,1) both;}
.footer{background:var(--surface);border-top:1px solid var(--border);padding:60px 48px 32px;}
.footer-inner{max-width:1200px;margin:0 auto;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;}
.footer-brand p{color:var(--muted);font-size:.9rem;line-height:1.7;margin-top:12px;max-width:280px;}
.footer-col h4{font-weight:700;font-size:.88rem;margin-bottom:16px;color:var(--text);letter-spacing:.5px;}
.footer-col a{display:block;color:var(--muted);text-decoration:none;font-size:.87rem;margin-bottom:10px;transition:color .2s;cursor:pointer;}
.footer-col a:hover{color:var(--accent);}
.footer-bottom{border-top:1px solid var(--border);padding-top:28px;display:flex;align-items:center;justify-content:space-between;color:var(--muted);font-size:.82rem;}
.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(80px);background:var(--surface2);border:1px solid var(--border2);color:var(--text);padding:13px 22px;border-radius:50px;font-size:.88rem;font-weight:600;z-index:999;transition:transform .4s cubic-bezier(.34,1.56,.64,1);display:flex;align-items:center;gap:10px;backdrop-filter:blur(20px);pointer-events:none;box-shadow:0 8px 30px var(--shadow);}
.toast.show{transform:translateX(-50%) translateY(0);}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}
@media(max-width:1024px){.restaurants-grid,.popular-scroll{grid-template-columns:repeat(2,1fr);}.testimonials-grid{grid-template-columns:repeat(2,1fr);}.steps-grid{grid-template-columns:repeat(2,1fr);}.footer-grid{grid-template-columns:1fr 1fr;}.reviews-grid{grid-template-columns:1fr;}.wr-row{grid-template-columns:1fr;}}
@media(max-width:768px){.nav{padding:0 20px;}.nav-links{display:none;}.home-hero-content{grid-template-columns:1fr;padding:60px 24px;gap:40px;}.home-hero-img-wrap{display:none;}.home-search-wrap{padding:0 20px;}.home-search{flex-direction:column;gap:14px;}.search-divider{display:none;}.section{padding:60px 24px;}.menu-header{padding:24px 24px 0;}.menu-grid{padding:24px;grid-template-columns:1fr;}.restaurants-grid,.popular-scroll,.testimonials-grid,.steps-grid{grid-template-columns:1fr;}.promo{flex-direction:column;padding:40px 28px;}.promo-img{width:160px;height:160px;}.footer-grid{grid-template-columns:1fr;}.cart-sidebar{width:100%;}.home-stats{gap:24px;}.auth-page{padding:24px 20px 48px;}.auth-container{padding:32px 24px;}.reviews-section{padding:60px 24px;}.reviews-summary{flex-direction:column;gap:16px;}.menu-controls{flex-direction:column;align-items:flex-start;}}
`;

// ─── HighlightMatch ───────────────────────────────────────────────────────────
function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ─── FoodCard — OUTSIDE FoodDelivery ─────────────────────────────────────────
function FoodCard({ item, addToCart, addedItems }) {
  const img = item.image || FOOD_IMAGES[item.id];
  return (
    <div className="food-card">
      <div className="food-card-img">
        <img
          src={img}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        {item.badge && <div className="food-card-badge">{item.badge}</div>}
      </div>
      <div className="food-card-body">
        <div className="food-card-name">{item.name}</div>
        <div className="food-card-desc">{item.desc}</div>
        <div className="food-card-meta">
          <span>
            <span className="rating-val">★ {item.rating}</span>
          </span>
          <span>({item.reviews})</span>
          <span>🕐 {item.time}</span>
          <span>🔥 {item.cal} kcal</span>
        </div>
        <div className="food-card-footer">
          <div className="food-price">${Number(item.price).toFixed(2)}</div>
          <button
            className={`add-btn${addedItems[item.id] ? " added" : ""}`}
            onClick={() => addToCart(item)}
          >
            {addedItems[item.id] ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CartItemRow — OUTSIDE FoodDelivery ──────────────────────────────────────
function CartItemRow({ item, onQtyChange, onRemove }) {
  const [removing, setRemoving] = useState(false);
  const [bumpQty, setBumpQty] = useState(false);
  const [bumpKey, setBumpKey] = useState(0);

  const handleDelta = (delta) => {
    if (item.qty + delta <= 0) {
      setRemoving(true);
      setTimeout(() => onRemove(item.id), 340);
    } else {
      onQtyChange(item.id, delta);
      setBumpQty(true);
      setBumpKey((k) => k + 1);
      setTimeout(() => setBumpQty(false), 300);
    }
  };

  const img = item.image || FOOD_IMAGES[item.id];

  return (
    <div className={`cart-item${removing ? " removing" : ""}`}>
      <img className="cart-item-img" src={img} alt={item.name} />
      <div className="cart-item-info">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">
          ${(item.price * item.qty).toFixed(2)}
        </div>
      </div>
      <div className="qty-controls">
        <button className="qty-btn" onClick={() => handleDelta(-1)}>
          −
        </button>
        <span key={bumpKey} className={`qty-num${bumpQty ? " bump" : ""}`}>
          {item.qty}
        </span>
        <button className="qty-btn" onClick={() => handleDelta(1)}>
          +
        </button>
      </div>
    </div>
  );
}

// ─── HowSection — OUTSIDE FoodDelivery ───────────────────────────────────────
function HowSection() {
  return (
    <section id="how-it-works" className="section how-section">
      <div className="section-inner">
        <div className="section-header">
          <div>
            <div className="section-tag">⚡ Simple Process</div>
            <h2 className="section-title">Order in 4 Easy Steps</h2>
          </div>
        </div>
        <div className="steps-grid">
          {STEPS.map((step, i) => (
            <div className="step-card" key={i}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-num">
                Step {String(i + 1).padStart(2, "0")}
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer — OUTSIDE FoodDelivery ───────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo">
              Fork<span className="nav-logo-dot">.</span>Fleet
            </div>
            <p>
              Delivering happiness one meal at a time. Fast, fresh, and always
              on time.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            {["About Us", "Careers", "Press", "Blog"].map((l) => (
              <a key={l}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            {["FAQ", "Contact", "Track Order", "Refunds"].map((l) => (
              <a key={l}>{l}</a>
            ))}
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (l) => (
                <a key={l}>{l}</a>
              ),
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Fork.Fleet. All rights reserved.</span>
          <span>Made with 🧡 for food lovers</span>
        </div>
      </div>
    </footer>
  );
}

// ─── PromoBanner — OUTSIDE FoodDelivery ──────────────────────────────────────
function PromoBanner({ onOrderNow }) {
  return (
    <div className="promo">
      <div>
        <div className="promo-label">🎉 Limited Time Offer</div>
        <h2 className="promo-title">
          Free Delivery
          <br />
          on First Order!
        </h2>
        <p className="promo-sub">
          Use code at checkout and enjoy your first delivery on us.
        </p>
        <div className="promo-code">
          <span style={{ color: "var(--muted)", fontSize: ".8rem" }}>
            Promo Code
          </span>
          <span>FIRSTBITE</span>
        </div>
        <br />
        <button className="btn-large" onClick={onOrderNow}>
          Claim Offer →
        </button>
      </div>
      <img
        className="promo-img"
        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
        alt="food"
        loading="lazy"
      />
    </div>
  );
}

// ─── ReviewsSection — OUTSIDE FoodDelivery ───────────────────────────────────
function ReviewsSection({ reviews, onAddReview, menuItems }) {
  const [form, setForm] = useState({ name: "", dish: 1, rating: 5, text: "" });
  const [submitted, setSubmitted] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    pct: reviews.length
      ? Math.round(
          (reviews.filter((r) => r.rating === s).length / reviews.length) * 100,
        )
      : 0,
  }));
  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: Number(form.dish),
        user: form.name.trim(),
        rating: form.rating,
        text: form.text.trim(),
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) onAddReview(data.review);
      })
      .catch(() => {
        // fallback if backend offline
        onAddReview({
          id: Date.now(),
          itemId: Number(form.dish),
          user: form.name.trim(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name.trim())}&background=F4A435&color=0A0A0A&size=60`,
          rating: form.rating,
          text: form.text.trim(),
          date: "Just now",
        });
      });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", dish: 1, rating: 5, text: "" });
    }, 3000);
  };

  const allItems = menuItems && menuItems.length > 0 ? menuItems : STATIC_MENU;

  return (
    <section className="reviews-section">
      <div className="reviews-inner">
        <div className="reviews-header">
          <div>
            <div className="section-tag">⭐ Reviews</div>
            <h2 className="section-title">What People Are Saying</h2>
          </div>
          <div className="reviews-summary">
            <div>
              <div className="reviews-big-rating">{avg}</div>
              <div className="reviews-big-stars">
                {"★".repeat(Math.round(Number(avg)))}
              </div>
              <div className="reviews-big-count">{reviews.length} reviews</div>
            </div>
            <div className="reviews-bars">
              {dist.map((d) => (
                <div key={d.star} className="reviews-bar-row">
                  <span style={{ minWidth: 8 }}>{d.star}</span>
                  <span>★</span>
                  <div className="reviews-bar-track">
                    <div
                      className="reviews-bar-fill"
                      style={{ width: `${d.pct}%` }}
                    />
                  </div>
                  <span style={{ minWidth: 28 }}>{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews
            .slice()
            .reverse()
            .map((r, i) => {
              const item = allItems.find((m) => m.id === r.itemId);
              return (
                <div
                  className="review-card"
                  key={r.id}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="review-card-header">
                    <img
                      className="review-avatar"
                      src={r.avatar}
                      alt={r.user}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user)}&background=F4A435&color=0A0A0A&size=60`;
                      }}
                    />
                    <div>
                      <div className="review-user-name">{r.user}</div>
                      <div className="review-date">{r.date}</div>
                    </div>
                    <div className="review-rating">
                      {"★".repeat(r.rating)} {r.rating}.0
                    </div>
                  </div>
                  {item && (
                    <div className="review-item-tag">🍽️ {item.name}</div>
                  )}
                  <p className="review-text">{r.text}</p>
                </div>
              );
            })}
        </div>

        <div className="write-review">
          <div className="write-review-title">✍️ Leave a Review</div>
          {submitted ? (
            <div className="wr-success">
              ✅ Thank you! Your review has been posted.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="wr-row">
                <div className="wr-field">
                  <label>Your Name</label>
                  <input
                    placeholder="e.g. Riya Sharma"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="wr-field">
                  <label>Dish</label>
                  <select
                    value={form.dish}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, dish: e.target.value }))
                    }
                  >
                    {allItems.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="wr-field" style={{ marginBottom: 16 }}>
                <label>Rating</label>
                <div className="star-picker">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="star-pick-btn"
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setForm((f) => ({ ...f, rating: s }))}
                    >
                      <span
                        style={{
                          color:
                            s <= (hoverStar || form.rating)
                              ? "var(--accent)"
                              : "var(--border2)",
                          transition: "color .15s",
                        }}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                  <span
                    style={{
                      color: "var(--muted)",
                      fontSize: ".85rem",
                      marginLeft: 4,
                    }}
                  >
                    {form.rating}/5
                  </span>
                </div>
              </div>
              <div className="wr-field" style={{ marginBottom: 20 }}>
                <label>Your Review</label>
                <textarea
                  placeholder="Tell others what you loved about this dish…"
                  value={form.text}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, text: e.target.value }))
                  }
                  required
                />
              </div>
              <button type="submit" className="wr-submit">
                Post Review →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── HomePage — OUTSIDE FoodDelivery ─────────────────────────────────────────
function HomePage({
  liveMenu,
  addToCart,
  addedItems,
  reviews,
  setReviews,
  homeSearchRef,
  homeSearchVal,
  setHomeSearchVal,
  homeSearchFocused,
  setHomeSearchFocused,
  homeSuggs,
  showHomeSugg,
  setSearchQuery,
  setActivePage,
  showToast,
}) {
  const smoothScroll = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ paddingTop: "72px" }}>
      {/* Hero */}
      <section className="home-hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="home-hero-content">
          <div>
            <div className="home-tag">🛵 30 Min Delivery Guaranteed</div>
            <h1 className="home-title">
              Crave It.
              <br />
              <em>Order It.</em>
              <br />
              Love It.
            </h1>
            <p className="home-desc">
              Restaurant-quality meals delivered to your door in minutes. Fresh
              ingredients, bold flavors, zero compromise.
            </p>
            <div className="home-cta">
              <button
                className="btn-large"
                onClick={() => setActivePage("menu")}
              >
                Explore Menu <span>→</span>
              </button>
              <button
                className="btn-outline-large"
                onClick={() => smoothScroll("how-it-works")}
              >
                How it Works
              </button>
            </div>
            <div className="home-stats">
              <div>
                <div className="stat-num">50+</div>
                <div className="stat-label">Restaurants</div>
              </div>
              <div>
                <div className="stat-num">4.9★</div>
                <div className="stat-label">Avg Rating</div>
              </div>
              <div>
                <div className="stat-num">28min</div>
                <div className="stat-label">Avg Delivery</div>
              </div>
              <div>
                <div className="stat-num">10k+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
          </div>
          <div className="home-hero-img-wrap">
            <img
              className="home-hero-img"
              src={HERO_DISH}
              alt="Delicious food"
              loading="eager"
            />
            <div className="floating-tag ftag-1">
              <span className="ftag-icon">⭐</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem" }}>
                  4.9 Rating
                </div>
                <div style={{ color: "var(--muted)", fontSize: ".75rem" }}>
                  12k+ reviews
                </div>
              </div>
            </div>
            <div className="floating-tag ftag-2">
              <span className="ftag-icon">🚀</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: ".9rem" }}>
                  Fast Delivery
                </div>
                <div style={{ color: "var(--muted)", fontSize: ".75rem" }}>
                  Under 30 min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Search */}
      <div className="home-search-wrap" ref={homeSearchRef}>
        <div className={`home-search${homeSearchFocused ? " focused" : ""}`}>
          <div className="search-field">
            <label>📍</label>
            <input
              placeholder="Enter delivery address…"
              style={{ minWidth: 0 }}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label>🔍</label>
            <input
              placeholder="Search food, restaurant…"
              value={homeSearchVal}
              onChange={(e) => setHomeSearchVal(e.target.value)}
              onFocus={() => setHomeSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(homeSearchVal);
                  setActivePage("menu");
                  setHomeSearchFocused(false);
                }
              }}
            />
          </div>
          <button
            className="search-submit"
            onClick={() => {
              setSearchQuery(homeSearchVal);
              setActivePage("menu");
              setHomeSearchFocused(false);
            }}
          >
            Find Food →
          </button>
        </div>

        {showHomeSugg && (
          <div className="search-suggestions-wrap">
            <div className="search-suggestions">
              {homeSuggs.dishes.length === 0 &&
              homeSuggs.restaurants.length === 0 ? (
                <div className="suggest-empty">
                  No results for "<strong>{homeSearchVal}</strong>"
                </div>
              ) : (
                <>
                  {homeSuggs.dishes.length > 0 && (
                    <>
                      <div className="suggest-section-label">🍽️ Dishes</div>
                      {homeSuggs.dishes.map((item) => (
                        <div
                          key={item.id}
                          className="suggest-item"
                          onClick={() => {
                            setSearchQuery(item.name);
                            setActivePage("menu");
                            setHomeSearchFocused(false);
                            setHomeSearchVal(item.name);
                          }}
                        >
                          <div className="suggest-item-icon">
                            <img
                              src={item.image || FOOD_IMAGES[item.id]}
                              alt={item.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="suggest-item-info">
                            <div className="suggest-item-name">
                              <HighlightMatch
                                text={item.name}
                                query={homeSearchVal}
                              />
                            </div>
                            <div className="suggest-item-meta">
                              ★ {item.rating} · {item.time} · {item.category}
                            </div>
                          </div>
                          <div className="suggest-item-price">
                            ${Number(item.price).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {homeSuggs.restaurants.length > 0 && (
                    <>
                      <div className="suggest-section-label">
                        🏪 Restaurants
                      </div>
                      {homeSuggs.restaurants.map((r, i) => (
                        <div
                          key={i}
                          className="suggest-item"
                          onClick={() => {
                            setSearchQuery(r.name);
                            setActivePage("menu");
                            setHomeSearchFocused(false);
                            setHomeSearchVal(r.name);
                          }}
                        >
                          <div
                            className="suggest-item-icon"
                            style={{ fontSize: "1.2rem" }}
                          >
                            {r.emoji}
                          </div>
                          <div className="suggest-item-info">
                            <div className="suggest-item-name">
                              <HighlightMatch
                                text={r.name}
                                query={homeSearchVal}
                              />
                            </div>
                            <div className="suggest-item-meta">Restaurant</div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
              <div
                className="suggest-footer"
                onClick={() => {
                  setSearchQuery(homeSearchVal);
                  setActivePage("menu");
                  setHomeSearchFocused(false);
                }}
              >
                🔍 See all results for "<strong>{homeSearchVal}</strong>"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popular Restaurants */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-tag">🏪 Top Rated</div>
              <h2 className="section-title">Popular Restaurants</h2>
            </div>
            <a className="link-all" onClick={() => setActivePage("menu")}>
              View all →
            </a>
          </div>
          <div className="restaurants-grid">
            {POPULAR_RESTAURANTS.map((r, i) => (
              <div
                className="restaurant-card"
                key={i}
                onClick={() => setActivePage("menu")}
              >
                <div className="restaurant-img-wrap">
                  <img
                    className="restaurant-img"
                    src={r.img}
                    alt={r.name}
                    loading="lazy"
                  />
                  {r.promo && <div className="restaurant-promo">{r.promo}</div>}
                </div>
                <div className="restaurant-body">
                  <div className="restaurant-name">{r.name}</div>
                  <div className="restaurant-meta">
                    <span className="restaurant-rating">★ {r.rating}</span>
                    <span>• {r.cuisine}</span>
                    <span>• 🕐 {r.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Ordered */}
      <section
        className="section"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-tag">🍽️ Must Try</div>
              <h2 className="section-title">Most Ordered Dishes</h2>
            </div>
            <a className="link-all" onClick={() => setActivePage("menu")}>
              View full menu →
            </a>
          </div>
          <div className="popular-scroll">
            {liveMenu.slice(0, 6).map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                addToCart={addToCart}
                addedItems={addedItems}
              />
            ))}
          </div>
        </div>
      </section>

      <HowSection />

      {/* Testimonials */}
      <section className="section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <div className="section-tag">💬 Testimonials</div>
              <h2 className="section-title">What Customers Say</h2>
            </div>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="stars">{"★".repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <img
                    className="author-avatar"
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                  />
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="section">
        <div className="section-inner">
          <PromoBanner
            onOrderNow={() => {
              setActivePage("menu");
              showToast("Promo FIRSTBITE applied! 🎉");
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── MenuPage — OUTSIDE FoodDelivery ─────────────────────────────────────────
function MenuPage({
  filteredMenu,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  addToCart,
  addedItems,
  reviews,
  setReviews,
  menuSearchRef,
  menuSuggs,
  showMenuSugg,
  setMenuSearchFocused,
  setActivePage,
  showToast,
  liveMenu,
}) {
  return (
    <div className="menu-page">
      <div className="menu-header">
        <div className="menu-header-inner">
          <h1 className="menu-page-title">Our Menu</h1>
          <div className="menu-controls">
            <div className="categories">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-btn${activeCategory === cat.id ? " active" : ""}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* ✅ Search with suggestions — stable, no focus loss */}
            <div className="menu-search-wrap" ref={menuSearchRef}>
              <div className="search-bar">
                <span style={{ color: "var(--muted)" }}>🔍</span>
                <input
                  placeholder="Search dishes…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setMenuSearchFocused(true)}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setMenuSearchFocused(false);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--muted)",
                      cursor: "pointer",
                      fontSize: ".85rem",
                      padding: "0 2px",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {showMenuSugg && (
                <div className="menu-suggestions">
                  {menuSuggs.map((item) => (
                    <div
                      key={item.id}
                      className="menu-sug-item"
                      onClick={() => {
                        setSearchQuery(item.name);
                        setMenuSearchFocused(false);
                      }}
                    >
                      <img
                        className="menu-sug-img"
                        src={item.image || FOOD_IMAGES[item.id]}
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                      <div>
                        <div className="menu-sug-name">
                          <HighlightMatch
                            text={item.name}
                            query={searchQuery}
                          />
                        </div>
                        <div className="menu-sug-price">
                          ★ {item.rating} · ${Number(item.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {filteredMenu.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 48px",
            color: "var(--muted)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            No dishes found
          </p>
          <p style={{ marginTop: "8px" }}>Try a different search or category</p>
          <button
            className="btn-primary"
            style={{ marginTop: "24px" }}
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredMenu.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              addToCart={addToCart}
              addedItems={addedItems}
            />
          ))}
        </div>
      )}

      <ReviewsSection
        reviews={reviews}
        menuItems={liveMenu}
        onAddReview={(r) => setReviews((prev) => [...prev, r])}
      />

      <section className="section">
        <div className="section-inner">
          <PromoBanner
            onOrderNow={() => {
              setActivePage("menu");
              showToast("Promo FIRSTBITE applied! 🎉");
            }}
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}

// ─── AuthPage — OUTSIDE FoodDelivery ─────────────────────────────────────────
function AuthPage({
  authMode,
  setAuthMode,
  authLoading,
  authError,
  authSuccess,
  authForm,
  setAuthForm,
  handleAuthSubmit,
  setActivePage,
  animKey,
}) {
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            className="nav-logo"
            style={{ justifyContent: "center", cursor: "default" }}
          >
            Fork<span className="nav-logo-dot">.</span>Fleet
          </div>
          <p key={authMode} className="auth-subtitle">
            {authMode === "signin"
              ? "Welcome back! Sign in to continue."
              : "Create an account to get started."}
          </p>
        </div>
        <div className="auth-tabs">
          <button
            className={`auth-tab${authMode === "signin" ? " active" : ""}`}
            onClick={() => switchAuthMode("signin")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${authMode === "signup" ? " active" : ""}`}
            onClick={() => switchAuthMode("signup")}
          >
            Sign Up
          </button>
        </div>
        <form className="auth-form" onSubmit={handleAuthSubmit}>
          {authError && <div className="auth-error">{authError}</div>}
          {authSuccess && <div className="auth-success">{authSuccess}</div>}
          <div key={animKey} className="auth-fields-wrap">
            {authMode === "signup" && (
              <div className="auth-field-item">
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={authForm.name}
                    onChange={(e) =>
                      setAuthForm((f) => ({ ...f, name: e.target.value }))
                    }
                    autoComplete="name"
                  />
                </div>
              </div>
            )}
            <div className="auth-field-item">
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm((f) => ({ ...f, email: e.target.value }))
                  }
                  autoComplete="email"
                />
              </div>
            </div>
            {authMode === "signup" && (
              <div className="auth-field-item">
                <div className="auth-field">
                  <label>Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={authForm.phone}
                    onChange={(e) =>
                      setAuthForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    autoComplete="tel"
                  />
                </div>
              </div>
            )}
            <div className="auth-field-item">
              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder={
                    authMode === "signup" ? "Min 6 characters" : "Your password"
                  }
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm((f) => ({ ...f, password: e.target.value }))
                  }
                  autoComplete={
                    authMode === "signup" ? "new-password" : "current-password"
                  }
                />
              </div>
            </div>
          </div>
          <button type="submit" className="auth-submit" disabled={authLoading}>
            {authLoading
              ? "Please wait…"
              : authMode === "signin"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
        <div className="auth-switch">
          {authMode === "signin" ? (
            <>
              {" "}
              Don&apos;t have an account?{" "}
              <button type="button" onClick={() => switchAuthMode("signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              {" "}
              Already have an account?{" "}
              <button type="button" onClick={() => switchAuthMode("signin")}>
                Sign In
              </button>
            </>
          )}
        </div>
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            type="button"
            className="btn-ghost"
            style={{ fontSize: ".85rem" }}
            onClick={() => setActivePage("home")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CartSidebar — OUTSIDE FoodDelivery ──────────────────────────────────────
function CartSidebar({
  cart,
  cartOpen,
  setCartOpen,
  updateQty,
  removeItem,
  subtotal,
  deliveryFee,
  tax,
  total,
  totalPopKey,
  setActivePage,
  showToast,
  setCart,
  user,
}) {
  return (
    <>
      <div
        className={`cart-overlay${cartOpen ? " open" : ""}`}
        onClick={() => setCartOpen(false)}
      />
      <div className={`cart-sidebar${cartOpen ? " open" : ""}`}>
        <div className="cart-header">
          <div className="cart-title">Your Order 🛒</div>
          <button className="close-btn" onClick={() => setCartOpen(false)}>
            ✕
          </button>
        </div>
        {cart.length === 0 ? (
          <div className="cart-empty">
            <img
              className="cart-empty-img"
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60"
              alt=""
            />
            <p
              style={{
                fontWeight: 700,
                color: "var(--text)",
                fontSize: "1.05rem",
              }}
            >
              Your cart is empty
            </p>
            <p style={{ color: "var(--muted)", fontSize: ".85rem" }}>
              Add some delicious items!
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setCartOpen(false);
                setActivePage("menu");
              }}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onQtyChange={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-row">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="cart-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span key={totalPopKey} className="cart-total-amount pop">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                className="checkout-btn"
                onClick={async () => {
                  try {
                    await fetch(`${API_BASE}/orders`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        items: cart.map((c) => ({
                          id: c.id,
                          name: c.name,
                          price: c.price,
                          qty: c.qty,
                        })),
                        total: total,
                        deliveryAddress: "Customer Address",
                        userId: user?.id || null, // ← this must not be null
                      }),
                    });
                  } catch {}
                  showToast("🎉 Order placed successfully!");
                  setCart([]);
                  setCartOpen(false);
                }}
              >
                Checkout → ${total.toFixed(2)}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Nav — OUTSIDE FoodDelivery ──────────────────────────────────────────────
function Nav({
  theme,
  toggleTheme,
  activePage,
  handleNavClick,
  user,
  logout,
  setActivePage,
  setCartOpen,
  cartCount,
  setAuthError,
  setAuthSuccess,
  setAuthForm,
  switchAuthMode,
}) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => handleNavClick("home")}>
        Fork<span className="nav-logo-dot">.</span>Fleet
      </div>
      <ul className="nav-links">
        {[
          ["home", "Home"],
          ["menu", "Menu"],
          ["orders", "My Orders"],
          ["how", "How it Works"],
          ["offers", "Offers"],
        ].map(([p, l]) => (
          <li key={p}>
            <a
              className={activePage === p ? "active" : ""}
              onClick={() => handleNavClick(p)}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: ".88rem",
                color: "var(--muted)",
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </span>
            <button className="btn-ghost" onClick={logout}>
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="btn-ghost"
            onClick={() => {
              setActivePage("auth");
              setAuthError("");
              setAuthSuccess("");
              setAuthForm({ name: "", email: "", password: "", phone: "" });
              switchAuthMode("signin");
            }}
          >
            Sign In
          </button>
        )}
        <button className="btn-primary" onClick={() => setActivePage("menu")}>
          Order Now
        </button>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN FoodDelivery Component ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export default function FoodDelivery() {
  const [theme, setTheme] = useState("dark");
  const [activePage, setActivePage] = useState("home");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [addedItems, setAddedItems] = useState({});
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [liveMenu, setLiveMenu] = useState(STATIC_MENU);

  // Home search
  const [homeSearchVal, setHomeSearchVal] = useState("");
  const [homeSearchFocused, setHomeSearchFocused] = useState(false);
  const homeSearchRef = useRef(null);

  // Menu search
  const [menuSearchFocused, setMenuSearchFocused] = useState(false);
  const menuSearchRef = useRef(null);

  // Auth
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("signin");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [animKey, setAnimKey] = useState(0);
  const [totalPopKey, setTotalPopKey] = useState(0);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.id = "ff-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => document.getElementById("ff-styles")?.remove();
  }, []);

  // Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Cart total pop animation
  useEffect(() => {
    setTotalPopKey((k) => k + 1);
  }, [cart]);

  // Fetch live menu from backend
  useEffect(() => {
    fetch(`${API_BASE}/menu`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.items.length > 0) setLiveMenu(data.items);
      })
      .catch(() => {}); // silently fallback to STATIC_MENU
  }, []);

  // Fetch reviews from backend
  useEffect(() => {
    fetch(`${API_BASE}/reviews`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.reviews.length > 0) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (homeSearchRef.current && !homeSearchRef.current.contains(e.target))
        setHomeSearchFocused(false);
      if (menuSearchRef.current && !menuSearchRef.current.contains(e.target))
        setMenuSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleNavClick = (page) => {
    const smoothScroll = (id) =>
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (activePage === "home" && (page === "how" || page === "offers")) {
      smoothScroll(page === "how" ? "how-it-works" : "offers");
      return;
    }
    if (activePage !== "home" && (page === "how" || page === "offers")) {
      setActivePage("home");
      setTimeout(
        () => smoothScroll(page === "how" ? "how-it-works" : "offers"),
        120,
      );
      return;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Suggestions logic
  const getHomeSuggestions = (val) => {
    if (!val.trim()) return { dishes: [], restaurants: [] };
    const q = val.toLowerCase();
    const dishes = liveMenu
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      )
      .slice(0, 5);
    const restaurants = RESTAURANT_SUGGESTIONS.filter((r) =>
      r.name.toLowerCase().includes(q),
    ).slice(0, 3);
    return { dishes, restaurants };
  };

  const getMenuSuggestions = (val) => {
    if (!val.trim()) return [];
    const q = val.toLowerCase();
    return liveMenu
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q),
      )
      .slice(0, 6);
  };

  const homeSuggs = getHomeSuggestions(homeSearchVal);
  const showHomeSugg = homeSearchFocused && homeSearchVal.trim().length > 0;
  const menuSuggs = getMenuSuggestions(searchQuery);
  const showMenuSugg =
    menuSearchFocused && searchQuery.trim().length > 0 && menuSuggs.length > 0;

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setAuthError("");
    setAuthSuccess("");
    setAnimKey((k) => k + 1);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");
    setAuthLoading(true);
    try {
      if (authMode === "signup") {
        const { name, email, password, phone } = authForm;
        if (!name?.trim() || !email?.trim() || !password) {
          setAuthError("Name, email, and password are required");
          setAuthLoading(false);
          return;
        }
        if (password.length < 6) {
          setAuthError("Password must be at least 6 characters");
          setAuthLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: phone?.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Registration failed");
        setUser(data.user);
        setAuthSuccess("Account created!");
        showToast("Welcome, " + data.user.name + "!");
        setTimeout(() => setActivePage("home"), 800);
      } else {
        const { email, password } = authForm;
        if (!email?.trim() || !password) {
          setAuthError("Email and password are required");
          setAuthLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Login failed");
        setUser(data.user);
        setAuthSuccess("Logged in!");
        showToast("Welcome back, " + data.user.name + "!");
        setTimeout(() => setActivePage("home"), 800);
      }
    } catch (err) {
      setAuthError(err.message || "Something went wrong");
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setActivePage("home");
    showToast("Logged out");
  };
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2500);
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === item.id);
      if (ex)
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(
      () => setAddedItems((prev) => ({ ...prev, [item.id]: false })),
      600,
    );
    showToast(`${item.name} added! 🎉`);
  };

  const updateQty = (id, delta) =>
    setCart((prev) =>
      prev
        .map((c) =>
          c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c,
        )
        .filter((c) => c.qty > 0),
    );
  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const subtotal = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const deliveryFee = cartCount > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const filteredMenu = liveMenu.filter((item) => {
    const matchCat =
      activeCategory === "all" || item.category === activeCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Shared props for Nav
  const navProps = {
    theme,
    toggleTheme,
    activePage,
    handleNavClick,
    user,
    logout,
    setActivePage,
    setCartOpen,
    cartCount,
    setAuthError,
    setAuthSuccess,
    setAuthForm,
    switchAuthMode,
  };

  return (
    <div>
      <Nav {...navProps} />

      {activePage === "home" && (
        <HomePage
          liveMenu={liveMenu}
          addToCart={addToCart}
          addedItems={addedItems}
          reviews={reviews}
          setReviews={setReviews}
          homeSearchRef={homeSearchRef}
          homeSearchVal={homeSearchVal}
          setHomeSearchVal={setHomeSearchVal}
          homeSearchFocused={homeSearchFocused}
          setHomeSearchFocused={setHomeSearchFocused}
          homeSuggs={homeSuggs}
          showHomeSugg={showHomeSugg}
          setSearchQuery={setSearchQuery}
          setActivePage={setActivePage}
          showToast={showToast}
        />
      )}

      {activePage === "menu" && (
        <MenuPage
          filteredMenu={filteredMenu}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          addToCart={addToCart}
          addedItems={addedItems}
          reviews={reviews}
          setReviews={setReviews}
          menuSearchRef={menuSearchRef}
          menuSuggs={menuSuggs}
          showMenuSugg={showMenuSugg}
          setMenuSearchFocused={setMenuSearchFocused}
          setActivePage={setActivePage}
          showToast={showToast}
          liveMenu={liveMenu}
        />
      )}

      {activePage === "auth" && (
        <AuthPage
          authMode={authMode}
          setAuthMode={setAuthMode}
          authLoading={authLoading}
          authError={authError}
          authSuccess={authSuccess}
          authForm={authForm}
          setAuthForm={setAuthForm}
          handleAuthSubmit={handleAuthSubmit}
          setActivePage={setActivePage}
          animKey={animKey}
        />
      )}

      {activePage === "orders" && (
        <MyOrdersPage
          user={user}
          setActivePage={setActivePage}
          addToCart={addToCart}
          showToast={showToast}
        />
      )}

      <CartSidebar
        cart={cart}
        setCart={setCart}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateQty={updateQty}
        removeItem={removeItem}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        tax={tax}
        total={total}
        totalPopKey={totalPopKey}
        setActivePage={setActivePage}
        showToast={showToast}
        user={user}
      />

      <div className={`toast${toast.show ? " show" : ""}`}>{toast.msg}</div>
    </div>
  );
}
