/**
 * Post Routes
 * /api/posts
 */

const express = require("express");
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  getSavedPosts,
} = require("../controllers/postController");
const { protect, optionalAuth } = require("../middleware/auth");
const { postValidation } = require("../middleware/validation");
const { upload } = require("../config/cloudinary");

// Public routes (with optional auth to personalize response)
router.get("/", optionalAuth, getPosts);
router.get("/saved", protect, getSavedPosts);
router.get("/:id", optionalAuth, getPostById);

// Protected routes
router.post("/", protect, upload.single("image"), postValidation, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/save", protect, toggleSave);

module.exports = router;
