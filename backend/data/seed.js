require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/forkfleet";

const menuItems = [
  {
    name: "Smash Burger Deluxe",
    description: "Double smash patty, aged cheddar, secret sauce, pickles, caramelized onions",
    category: "burger",
    price: 14.99,
    emoji: "🍔",
    color: "#FF6B35",
    badge: "🔥 Bestseller",
    calories: 720,
    prepTime: 18,
    rating: 4.9,
    reviewCount: 312,
    ingredients: ["Beef patty", "Aged cheddar", "Secret sauce", "Pickles", "Caramelized onions", "Brioche bun"],
    tags: ["bestseller", "comfort food"],
    isFeatured: true,
  },
  {
    name: "BBQ Bacon Melt",
    description: "Wagyu beef, smoked bacon, chipotle BBQ, pepper jack, crispy shallots",
    category: "burger",
    price: 16.50,
    emoji: "🍔",
    color: "#FF6B35",
    badge: "🔥 Hot",
    calories: 850,
    prepTime: 20,
    rating: 4.8,
    reviewCount: 274,
    ingredients: ["Wagyu beef", "Smoked bacon", "Chipotle BBQ", "Pepper jack", "Crispy shallots"],
    tags: ["spicy", "meat lovers"],
    isFeatured: true,
  },
  {
    name: "Truffle Margherita",
    description: "San Marzano tomato, buffalo mozzarella, fresh basil, black truffle oil",
    category: "pizza",
    price: 18.50,
    emoji: "🍕",
    color: "#E63946",
    badge: "⭐ Chef's Pick",
    calories: 890,
    prepTime: 22,
    rating: 4.8,
    reviewCount: 214,
    ingredients: ["San Marzano tomatoes", "Buffalo mozzarella", "Fresh basil", "Black truffle oil", "Neapolitan dough"],
    tags: ["vegetarian", "premium"],
    isFeatured: true,
  },
  {
    name: "Pepperoni Supreme",
    description: "Thick crust, triple pepperoni, roasted garlic, smoked provolone",
    category: "pizza",
    price: 20.00,
    emoji: "🍕",
    color: "#E63946",
    calories: 960,
    prepTime: 24,
    rating: 4.7,
    reviewCount: 301,
    ingredients: ["Triple pepperoni", "Roasted garlic", "Smoked provolone", "Tomato sauce", "Thick crust"],
    tags: ["meat lovers", "classic"],
  },
  {
    name: "Dragon Roll",
    description: "Shrimp tempura, avocado, spicy tobiko, eel sauce",
    category: "sushi",
    price: 22.00,
    emoji: "🍱",
    color: "#2DC653",
    badge: "🌿 Fresh",
    calories: 420,
    prepTime: 25,
    rating: 4.9,
    reviewCount: 189,
    ingredients: ["Shrimp tempura", "Avocado", "Spicy tobiko", "Eel sauce", "Nori", "Sushi rice"],
    tags: ["fresh", "seafood"],
    isFeatured: true,
  },
  {
    name: "Rainbow Roll",
    description: "Tuna, salmon, yellowtail, seasonal fish, cucumber inside",
    category: "sushi",
    price: 24.50,
    emoji: "🍣",
    color: "#2DC653",
    badge: "⭐ Popular",
    calories: 460,
    prepTime: 28,
    rating: 4.9,
    reviewCount: 143,
    ingredients: ["Tuna", "Salmon", "Yellowtail", "Seasonal fish", "Cucumber", "Sushi rice"],
    tags: ["fresh", "premium", "seafood"],
  },
  {
    name: "Harvest Bowl",
    description: "Kale, quinoa, roasted sweet potato, chickpeas, lemon tahini dressing",
    category: "salad",
    price: 13.50,
    emoji: "🥗",
    color: "#70E000",
    badge: "💚 Healthy",
    calories: 380,
    prepTime: 12,
    rating: 4.7,
    reviewCount: 156,
    ingredients: ["Kale", "Quinoa", "Roasted sweet potato", "Chickpeas", "Lemon tahini"],
    tags: ["vegan", "healthy", "gluten-free"],
    isFeatured: true,
  },
  {
    name: "Caesar Supreme",
    description: "Romaine, house-made Caesar dressing, parmesan crisps, sourdough croutons, anchovies",
    category: "salad",
    price: 12.00,
    emoji: "🥗",
    color: "#70E000",
    calories: 340,
    prepTime: 10,
    rating: 4.6,
    reviewCount: 98,
    ingredients: ["Romaine lettuce", "Caesar dressing", "Parmesan crisps", "Sourdough croutons", "Anchovies"],
    tags: ["classic"],
  },
  {
    name: "Crème Brûlée",
    description: "Classic French vanilla custard with perfectly caramelized sugar crust",
    category: "dessert",
    price: 9.99,
    emoji: "🍮",
    color: "#FFB703",
    badge: "✨ New",
    calories: 310,
    prepTime: 10,
    rating: 5.0,
    reviewCount: 98,
    ingredients: ["Vanilla bean", "Heavy cream", "Egg yolks", "Sugar"],
    tags: ["classic", "french"],
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm dark chocolate cake with molten center, served with vanilla gelato",
    category: "dessert",
    price: 11.50,
    emoji: "🎂",
    color: "#7B2D8B",
    badge: "🍫 Indulgent",
    calories: 490,
    prepTime: 15,
    rating: 4.9,
    reviewCount: 267,
    ingredients: ["Dark chocolate", "Butter", "Eggs", "Flour", "Vanilla gelato"],
    tags: ["indulgent", "chocolate"],
    isFeatured: true,
  },
];

const adminUser = {
  name: "Admin User",
  email: "admin@forkfleet.com",
  password: "admin123",
  role: "admin",
};

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing
    await MenuItem.deleteMany({});
    await User.deleteMany({ role: "admin" });
    console.log("🗑️  Cleared existing data");

    // Seed menu
    await MenuItem.insertMany(menuItems);
    console.log(`🍔 Seeded ${menuItems.length} menu items`);

    // Seed admin
    await User.create(adminUser);
    console.log("👤 Admin user created: admin@forkfleet.com / admin123");

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
