const MenuItem = require("../models/MenuItem");
const { asyncHandler } = require("../middleware/errorHandler");

// ── GET /api/menu ──────────────────────────────────────────────────────────────
// Query params: category, search, minPrice, maxPrice, sort, page, limit, featured
const getMenu = asyncHandler(async (req, res) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    sort = "-rating",
    page = 1,
    limit = 20,
    featured,
  } = req.query;

  const filter = { isAvailable: true };

  if (category && category !== "all") filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Full-text search
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    MenuItem.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    MenuItem.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    items,
  });
});

// ── GET /api/menu/categories ───────────────────────────────────────────────────
const getCategories = asyncHandler(async (req, res) => {
  const categories = await MenuItem.aggregate([
    { $match: { isAvailable: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  res.json({ success: true, categories });
});

// ── GET /api/menu/featured ─────────────────────────────────────────────────────
const getFeatured = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ isFeatured: true, isAvailable: true }).limit(6).sort("-rating");
  res.json({ success: true, items });
});

// ── GET /api/menu/:id ──────────────────────────────────────────────────────────
const getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, item });
});

// ── POST /api/menu  [Admin only] ───────────────────────────────────────────────
const createMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.create(req.body);
  res.status(201).json({ success: true, message: "Menu item created", item });
});

// ── PUT /api/menu/:id  [Admin only] ───────────────────────────────────────────
const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, message: "Item updated", item });
});

// ── DELETE /api/menu/:id  [Admin only] ────────────────────────────────────────
const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: "Item not found" });
  res.json({ success: true, message: "Item deleted" });
});

module.exports = {
  getMenu,
  getCategories,
  getFeatured,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
