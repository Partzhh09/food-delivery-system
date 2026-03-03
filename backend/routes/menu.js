const express = require("express");
const router = express.Router();
const {
  getMenu,
  getCategories,
  getFeatured,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect, restrictTo } = require("../middleware/auth");

// Public
router.get("/", getMenu);
router.get("/categories", getCategories);
router.get("/featured", getFeatured);
router.get("/:id", getMenuItem);

// Admin only
router.post("/", protect, restrictTo("admin"), createMenuItem);
router.put("/:id", protect, restrictTo("admin"), updateMenuItem);
router.delete("/:id", protect, restrictTo("admin"), deleteMenuItem);

module.exports = router;
