const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["burger", "pizza", "sushi", "salad", "dessert", "drinks", "sides"],
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },       // URL to image
    emoji: { type: String, default: "🍽️" },    // Fallback emoji
    badge: { type: String, default: null },      // "🔥 Bestseller" etc.
    color: { type: String, default: "#FF6B35" }, // Accent color for card
    calories: { type: Number, default: 0 },
    prepTime: { type: Number, default: 20 },     // Minutes
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    ingredients: [String],
    tags: [String],                              // ["spicy","vegan","gluten-free"]
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },      // Percentage discount 0-100
  },
  { timestamps: true }
);

// Virtual: discounted price
menuItemSchema.virtual("finalPrice").get(function () {
  if (!this.discount) return this.price;
  return parseFloat((this.price * (1 - this.discount / 100)).toFixed(2));
});

menuItemSchema.set("toJSON", { virtuals: true });

// Text search index
menuItemSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
