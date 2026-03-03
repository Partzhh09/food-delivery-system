const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

// ── POST /api/auth/register ────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token,
    user,
  });
});

// ── POST /api/auth/login ───────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  if (!user.isActive) {
    return res.status(401).json({ success: false, message: "Account has been deactivated" });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: "Logged in successfully",
    token,
    user,
  });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── PUT /api/auth/update-profile ──────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );

  res.json({ success: true, message: "Profile updated", user });
});

// ── PUT /api/auth/change-password ─────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: "Current password is incorrect" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password changed successfully" });
});

// ── POST /api/auth/addresses ───────────────────────────────────────────────────
const addAddress = asyncHandler(async (req, res) => {
  const { label, line1, line2, city, state, zip, lat, lng, isDefault } = req.body;

  const user = await User.findById(req.user._id);

  // If setting as default, unset others
  if (isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }

  user.addresses.push({ label, line1, line2, city, state, zip, lat, lng, isDefault });
  await user.save();

  res.status(201).json({ success: true, message: "Address added", addresses: user.addresses });
});

// ── DELETE /api/auth/addresses/:addressId ─────────────────────────────────────
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();

  res.json({ success: true, message: "Address removed", addresses: user.addresses });
});

module.exports = { register, login, getMe, updateProfile, changePassword, addAddress, deleteAddress };
