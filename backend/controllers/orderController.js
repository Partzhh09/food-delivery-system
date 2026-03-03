const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const { asyncHandler } = require("../middleware/errorHandler");

// ── Promo code validator ───────────────────────────────────────────────────────
const PROMO_CODES = {
  FIRSTBITE: { type: "free_delivery", value: 100 },
  SAVE20: { type: "percent", value: 20 },
  FLAT5: { type: "flat", value: 5 },
};

const applyPromo = (code, subtotal, deliveryFee) => {
  const promo = PROMO_CODES[code?.toUpperCase()];
  if (!promo) return { valid: false, discount: 0, deliveryFee };

  let discount = 0;
  let newDeliveryFee = deliveryFee;

  if (promo.type === "free_delivery") {
    discount = deliveryFee;
    newDeliveryFee = 0;
  } else if (promo.type === "percent") {
    discount = parseFloat(((subtotal * promo.value) / 100).toFixed(2));
  } else if (promo.type === "flat") {
    discount = Math.min(promo.value, subtotal);
  }

  return { valid: true, discount, deliveryFee: newDeliveryFee };
};

// ── POST /api/orders ───────────────────────────────────────────────────────────
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,              // [{ menuItemId, quantity }]
    deliveryAddress,
    paymentMethod = "card",
    promoCode,
    specialInstructions,
  } = req.body;

  if (!items?.length) {
    return res.status(400).json({ success: false, message: "Order must have at least one item" });
  }

  if (!deliveryAddress?.line1 || !deliveryAddress?.city || !deliveryAddress?.zip) {
    return res.status(400).json({ success: false, message: "Valid delivery address is required" });
  }

  // Validate & price each item from DB (never trust client prices!)
  const orderItems = [];
  let subtotal = 0;

  for (const { menuItemId, quantity } of items) {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: `Menu item ${menuItemId} not found` });
    }
    if (!menuItem.isAvailable) {
      return res.status(400).json({ success: false, message: `${menuItem.name} is currently unavailable` });
    }

    const itemSubtotal = parseFloat((menuItem.finalPrice * quantity).toFixed(2));
    subtotal += itemSubtotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      emoji: menuItem.emoji,
      price: menuItem.finalPrice,
      quantity,
      subtotal: itemSubtotal,
    });
  }

  subtotal = parseFloat(subtotal.toFixed(2));
  const baseDeliveryFee = 2.99;
  const taxRate = 0.08;

  // Apply promo code
  const promoResult = applyPromo(promoCode, subtotal, baseDeliveryFee);
  const { discount, deliveryFee } = promoResult;

  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + deliveryFee + tax - discount).toFixed(2));

  // Estimate delivery time (now + 25-35 mins)
  const estimatedDelivery = new Date(Date.now() + (25 + Math.floor(Math.random() * 10)) * 60000);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    promoCode: promoResult.valid ? promoCode.toUpperCase() : null,
    deliveryAddress,
    paymentMethod,
    specialInstructions,
    estimatedDelivery,
    status: "confirmed",
    statusHistory: [{ status: "confirmed", timestamp: new Date(), note: "Order received and confirmed" }],
  });

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
  });
});

// ── GET /api/orders  (my orders) ──────────────────────────────────────────────
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("items.menuItem", "name emoji image")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders });
});

// ── GET /api/orders/:id ────────────────────────────────────────────────────────
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.menuItem", "name emoji image category");

  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  // Users can only see their own orders (admins can see all)
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to view this order" });
  }

  res.json({ success: true, order });
});

// ── PUT /api/orders/:id/cancel ─────────────────────────────────────────────────
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (["out_for_delivery", "delivered"].includes(order.status)) {
    return res.status(400).json({ success: false, message: "Cannot cancel an order that is already out for delivery or delivered" });
  }

  order.status = "cancelled";
  await order.save();

  res.json({ success: true, message: "Order cancelled successfully", order });
});

// ── PUT /api/orders/:id/rate ───────────────────────────────────────────────────
const rateOrder = asyncHandler(async (req, res) => {
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  if (order.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (order.status !== "delivered") {
    return res.status(400).json({ success: false, message: "Can only rate delivered orders" });
  }

  order.rating = rating;
  order.review = review;
  await order.save();

  // Update menu item ratings
  for (const item of order.items) {
    const menuItem = await MenuItem.findById(item.menuItem);
    if (menuItem) {
      const newCount = menuItem.reviewCount + 1;
      const newRating = ((menuItem.rating * menuItem.reviewCount) + rating) / newCount;
      menuItem.rating = parseFloat(newRating.toFixed(1));
      menuItem.reviewCount = newCount;
      await menuItem.save();
    }
  }

  res.json({ success: true, message: "Thank you for your review!", order });
});

// ── GET /api/orders  [Admin: all orders] ──────────────────────────────────────
const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.menuItem", "name emoji")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders });
});

// ── PUT /api/orders/:id/status  [Admin only] ──────────────────────────────────
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = status;
  if (status === "delivered") {
    order.actualDelivery = new Date();
    order.paymentStatus = "paid";
  }

  if (note) order.statusHistory[order.statusHistory.length - 1].note = note;
  await order.save();

  res.json({ success: true, message: `Order status updated to ${status}`, order });
});

// ── POST /api/orders/validate-promo ───────────────────────────────────────────
const validatePromo = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) return res.status(400).json({ success: false, message: "Promo code is required" });

  const result = applyPromo(code, subtotal || 0, 2.99);

  if (!result.valid) {
    return res.status(400).json({ success: false, message: "Invalid or expired promo code" });
  }

  res.json({
    success: true,
    message: "Promo code applied!",
    code: code.toUpperCase(),
    discount: result.discount,
    deliveryFee: result.deliveryFee,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  rateOrder,
  getAllOrders,
  updateOrderStatus,
  validatePromo,
};
