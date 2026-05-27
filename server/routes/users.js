/**
 * User Routes
 * /api/users
 */

const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getUserPosts,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestions,
} = require("../controllers/userController");
const { protect, optionalAuth } = require("../middleware/auth");
const { profileValidation } = require("../middleware/validation");
const { upload } = require("../config/cloudinary");

// Public routes
router.get("/search", searchUsers);
router.get("/:username", optionalAuth, getUserProfile);
router.get("/:username/posts", getUserPosts);

// Protected routes
router.get("/me/suggestions", protect, getSuggestions);
router.put(
  "/profile/update",
  protect,
  upload.single("avatar"),
  profileValidation,
  updateProfile
);
router.post("/:id/follow", protect, toggleFollow);

module.exports = router;
