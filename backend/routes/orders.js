const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  rateOrder,
  getAllOrders,
  updateOrderStatus,
  validatePromo,
} = require("../controllers/orderController");
const { protect, restrictTo } = require("../middleware/auth");

// All order routes require login
router.use(protect);

// Customer routes
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);
router.post("/validate-promo", validatePromo);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);
router.put("/:id/rate", rateOrder);

// Admin routes
router.get("/", restrictTo("admin"), getAllOrders);
router.put("/:id/status", restrictTo("admin"), updateOrderStatus);

module.exports = router;
