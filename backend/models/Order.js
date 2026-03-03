const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  name: String,       // Snapshot at time of order
  price: Number,
  emoji: String,
  quantity: { type: Number, required: true, min: 1 },
  subtotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [orderItemSchema],

    // Pricing
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 2.99 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promoCode: { type: String, default: null },

    // Delivery
    deliveryAddress: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      lat: Number,
      lng: Number,
    },

    // Status flow: pending → confirmed → preparing → out_for_delivery → delivered | cancelled
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },

    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        note: String,
      },
    ],

    estimatedDelivery: { type: Date },
    actualDelivery: { type: Date },

    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    paymentMethod: {
      type: String,
      enum: ["card", "cash", "wallet"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    specialInstructions: { type: String, default: "" },

    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: null },
  },
  { timestamps: true }
);

// Auto-generate order number before saving
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `FF-${ts}-${rand}`;
  }
  // Push status into history on change
  if (this.isModified("status")) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
