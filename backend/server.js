const express    = require("express");
const cors       = require("cors");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const mongoose   = require("mongoose");
const path       = require("path");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ─── Serve Admin Panel ────────────────────────────────────────────────────────
app.use("/admin", express.static(path.join(__dirname, "../admin")));

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/forkfleet";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    seedDatabase();
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log("💡 Make sure MongoDB is running: mongod");
    process.exit(1);
  });

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  phone:     { type: String, default: "" },
  role:      { type: String, enum: ["customer", "admin"], default: "customer" },
}, { timestamps: true });

const menuItemSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  category:  { type: String, required: true, enum: ["burger", "pizza", "sushi", "salad", "dessert"] },
  price:     { type: Number, required: true, min: 0 },
  desc:      { type: String, default: "" },
  image:     { type: String, default: "" },
  time:      { type: String, default: "20 min" },
  cal:       { type: Number, default: 0 },
  badge:     { type: String, default: null },
  rating:    { type: Number, default: 0 },
  reviews:   { type: Number, default: 0 },
  available: { type: Boolean, default: true },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  orderId:         { type: String, unique: true },
  items:           [{ id: Number, name: String, price: Number, qty: Number }],
  total:           { type: Number, default: 0 },
  deliveryAddress: { type: String, default: "Not provided" },
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  itemId:  { type: Number, required: true },
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  user:    { type: String, required: true },
  avatar:  { type: String, default: "" },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  text:    { type: String, required: true },
  date:    { type: String, default: "Just now" },
}, { timestamps: true });

const User     = mongoose.model("User",     userSchema);
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
const Order    = mongoose.model("Order",    orderSchema);
const Review   = mongoose.model("Review",   reviewSchema);

// ─── SEED DATABASE ────────────────────────────────────────────────────────────
async function seedDatabase() {
  try {
    // Admin user
    const adminExists = await User.findOne({ email: "admin@forkfleet.com" });
    if (!adminExists) {
      await User.create({
        name:     "Admin User",
        email:    "admin@forkfleet.com",
        password: await bcrypt.hash("admin123", 10),
        role:     "admin",
      });
      console.log("✅ Admin user created: admin@forkfleet.com / admin123");
    }

    // Menu items
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany([
        { name: "Smash Burger Deluxe",  category: "burger",  price: 14.99, rating: 4.9, reviews: 312, time: "18 min", cal: 720,  badge: "🔥 Bestseller", desc: "Double smash patty, aged cheddar, secret sauce",              image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        { name: "Truffle Margherita",   category: "pizza",   price: 18.50, rating: 4.8, reviews: 214, time: "22 min", cal: 890,  badge: "⭐ Chef's Pick", desc: "San Marzano tomato, buffalo mozzarella, truffle oil",            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
        { name: "Dragon Roll",          category: "sushi",   price: 22.00, rating: 4.9, reviews: 189, time: "25 min", cal: 420,  badge: "🌿 Fresh",       desc: "Shrimp tempura, avocado, spicy tobiko",                        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80" },
        { name: "Harvest Bowl",         category: "salad",   price: 13.50, rating: 4.7, reviews: 156, time: "12 min", cal: 380,  badge: "💚 Healthy",     desc: "Kale, quinoa, roasted veggies, lemon tahini",                  image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
        { name: "Crème Brûlée",         category: "dessert", price: 9.99,  rating: 5.0, reviews: 98,  time: "10 min", cal: 310,  badge: "✨ New",          desc: "Classic vanilla custard, caramelized sugar crust",             image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
        { name: "BBQ Bacon Melt",       category: "burger",  price: 16.50, rating: 4.8, reviews: 274, time: "20 min", cal: 850,  badge: "🔥 Hot",         desc: "Wagyu beef, smoked bacon, chipotle BBQ",                       image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
        { name: "Pepperoni Supreme",    category: "pizza",   price: 20.00, rating: 4.7, reviews: 301, time: "24 min", cal: 960,  badge: null,             desc: "Thick crust, triple pepperoni, roasted garlic",                image: "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&q=80" },
        { name: "Rainbow Roll",         category: "sushi",   price: 24.50, rating: 4.9, reviews: 143, time: "28 min", cal: 460,  badge: "⭐ Popular",      desc: "Tuna, salmon, yellowtail, seasonal fish",                      image: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" },
        { name: "Chocolate Lava Cake",  category: "dessert", price: 11.50, rating: 4.9, reviews: 267, time: "15 min", cal: 490,  badge: "🍫 Indulgent",   desc: "Warm dark chocolate, vanilla gelato",                          image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80" },
      ]);
      console.log("✅ Menu items seeded (9 items)");
    }

    // Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.insertMany([
        { itemId: 1, user: "Arjun K.",  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=60&q=80", rating: 5, text: "The smash burger is absolutely insane. Crispy edges, melty cheese — 10/10 every time.", date: "2 days ago" },
        { itemId: 2, user: "Meera S.",  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80", rating: 5, text: "Truffle Margherita is dreamy. Arrived piping hot and the truffle oil aroma was incredible.", date: "3 days ago" },
        { itemId: 3, user: "Vikram P.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80", rating: 4, text: "Dragon Roll was super fresh. Packaging kept it cold perfectly. Will order again!", date: "5 days ago" },
        { itemId: 9, user: "Sneha R.",  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80", rating: 5, text: "The lava cake is DANGEROUS. So rich and warm, the gelato pairing is perfect.", date: "1 week ago" },
        { itemId: 4, user: "Karan M.",  avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&q=80", rating: 4, text: "Harvest Bowl is my weekly go-to. Healthy, filling and actually delicious.", date: "1 week ago" },
        { itemId: 6, user: "Priya T.",  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80", rating: 5, text: "BBQ Bacon Melt hit different. The chipotle sauce is a perfect smoky kick.", date: "2 weeks ago" },
      ]);
      console.log("✅ Reviews seeded");
    }

    console.log("✅ Database ready");
  } catch (err) {
    console.error("Seed error:", err.message);
  }
}

// ─── JWT SECRETS ──────────────────────────────────────────────────────────────
const JWT_SECRET       = process.env.JWT_SECRET       || "forkfleet-secret-2025";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "forkfleet-admin-2025";

// ─── ORDER ID GENERATOR ───────────────────────────────────────────────────────
async function generateOrderId() {
  const count = await Order.countDocuments();
  return `ORD-${String(count + 1000).padStart(4, "0")}`;
}

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "No token provided" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ success: false, message: "Invalid or expired token" }); }
};

const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Admin token required" });
  try {
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
    if (decoded.role !== "admin") throw new Error("Not admin");
    req.admin = decoded; next();
  } catch { res.status(403).json({ success: false, message: "Admin access denied" }); }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// Health
app.get("/api/health", (req, res) => res.json({
  status: "ok",
  timestamp: new Date().toISOString(),
  db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
}));

// ── CUSTOMER AUTH ──────────────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password required" });
    if (password.length < 6) return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ success: false, message: "Email already registered" });
    const user = await User.create({ name: name.trim(), email: email.toLowerCase(), password: await bcrypt.hash(password, 10), phone: phone || "", role: "customer" });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const user = await User.findOne({ email: email.toLowerCase(), role: "customer" });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── ADMIN AUTH ─────────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email: email.toLowerCase(), role: "admin" });
    if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(401).json({ success: false, message: "Invalid admin credentials" });
    const token = jwt.sign({ id: admin._id, email: admin.email, role: "admin", name: admin.name }, ADMIN_JWT_SECRET, { expiresIn: "8h" });
    res.json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get("/api/admin/me", adminMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── MENU (Public) ──────────────────────────────────────────────────────────────
app.get("/api/menu", async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = { available: true };
    if (category && category !== "all") query.category = category;
    if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { desc: { $regex: search, $options: "i" } }];
    const items = await MenuItem.find(query).sort({ createdAt: 1 });
    const itemsWithId = items.map((item, i) => ({ ...item.toObject(), id: i + 1 }));
    res.json({ success: true, items: itemsWithId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── MENU (Admin) ───────────────────────────────────────────────────────────────
app.get("/api/admin/menu", adminMiddleware, async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: 1 });
    const itemsWithId = items.map((item, i) => ({ ...item.toObject(), id: i + 1 }));
    res.json({ success: true, items: itemsWithId });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post("/api/admin/menu", adminMiddleware, async (req, res) => {
  try {
    const { name, category, price, desc, image, time, cal, badge, available } = req.body;
    if (!name || !category || !price) return res.status(400).json({ success: false, message: "Name, category and price required" });
    const item = await MenuItem.create({ name: name.trim(), category, price: parseFloat(price), desc: desc || "", image: image || "", time: time || "20 min", cal: parseInt(cal) || 0, badge: badge || null, available: available !== false });
    const count = await MenuItem.countDocuments();
    res.status(201).json({ success: true, item: { ...item.toObject(), id: count } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put("/api/admin/menu/:id", adminMiddleware, async (req, res) => {
  try {
    const fields = ["name","category","price","desc","image","time","cal","badge","available"];
    const update = {};
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    if (update.price)  update.price = parseFloat(update.price);
    if (update.cal)    update.cal   = parseInt(update.cal);
    const item = await MenuItem.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete("/api/admin/menu/:id", adminMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch("/api/admin/menu/:id/toggle", adminMiddleware, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    item.available = !item.available;
    await item.save();
    res.json({ success: true, item });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── ORDERS ─────────────────────────────────────────────────────────────────────

// Customer: get their own orders
app.get("/api/orders/my", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    // ✅ Handle both ObjectId and string userId
    let query;
    try {
      query = { userId: new mongoose.Types.ObjectId(userId) };
    } catch {
      query = { userId: userId };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(o => ({ ...o.toObject(), id: o.orderId })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});


// Customer: get single order status
app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: { ...order.toObject(), id: order.orderId } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});
app.post("/api/orders", async (req, res) => {
  try {
    const { items, total, deliveryAddress, userId } = req.body;
    if (!items || !items.length) return res.status(400).json({ success: false, message: "Order must have items" });
    const orderId = await generateOrderId();
    const order = await Order.create({ orderId, items, total: parseFloat(total) || 0, deliveryAddress: deliveryAddress || "Not provided", userId: userId || null });
    res.status(201).json({ success: true, order: { ...order.toObject(), id: order.orderId } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get("/api/admin/orders", adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(o => ({ ...o.toObject(), id: o.orderId })) });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.patch("/api/admin/orders/:id/status", adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ success: false, message: "Invalid status" });
    const order = await Order.findOneAndUpdate({ orderId: req.params.id }, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order: { ...order.toObject(), id: order.orderId } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── REVIEWS ────────────────────────────────────────────────────────────────────
app.get("/api/reviews", async (req, res) => {
  try {
    const query = req.query.itemId ? { itemId: parseInt(req.query.itemId) } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post("/api/reviews", async (req, res) => {
  try {
    const { itemId, user, text, rating, avatar } = req.body;
    if (!itemId || !user || !text || !rating) return res.status(400).json({ success: false, message: "Missing required fields" });
    const review = await Review.create({ itemId: parseInt(itemId), user: user.trim(), avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=F4A435&color=0A0A0A&size=60`, rating: parseInt(rating), text: text.trim(), date: "Just now" });
    res.status(201).json({ success: true, review });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get("/api/admin/reviews", adminMiddleware, async (req, res) => {
  try {
    const reviews   = await Review.find().sort({ createdAt: -1 });
    const menuItems = await MenuItem.find().sort({ createdAt: 1 });
    const enriched  = reviews.map(r => ({ ...r.toObject(), itemName: menuItems[r.itemId - 1]?.name || "Unknown Item" }));
    res.json({ success: true, reviews: enriched });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete("/api/admin/reviews/:id", adminMiddleware, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── USERS (Admin) ──────────────────────────────────────────────────────────────
app.get("/api/admin/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete("/api/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: "customer" });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── DASHBOARD STATS ────────────────────────────────────────────────────────────
app.get("/api/admin/stats", adminMiddleware, async (req, res) => {
  try {
    const [totalOrders, totalUsers, totalMenuItems, totalReviews, allOrders, allReviews, topItems, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      MenuItem.countDocuments(),
      Review.countDocuments(),
      Order.find(),
      Review.find(),
      MenuItem.find({ available: true }).sort({ reviews: -1 }).limit(5),
      Order.find().sort({ createdAt: -1 }).limit(5),
    ]);
    const totalRevenue = allOrders.reduce((s, o) => s + (o.total || 0), 0);
    const avgRating    = allReviews.length ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1) : "0.0";
    res.json({
      success: true,
      stats: {
        totalOrders, totalRevenue: totalRevenue.toFixed(2), totalUsers, totalMenuItems, totalReviews, avgRating,
        recentOrders: recentOrders.map(o => ({ ...o.toObject(), id: o.orderId })),
        topItems:     topItems.map((item, i) => ({ ...item.toObject(), id: i + 1 })),
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ── START ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Fork.Fleet API running on http://localhost:${PORT}`);
  console.log(`🛠️  Admin panel: http://localhost:${PORT}/admin`);
});
