/**
 * Auth Routes
 * /api/auth
 */

const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { registerValidation, loginValidation } = require("../middleware/validation");

// Public routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/change-password", protect, changePassword);

module.exports = router;
