/**
 * Comment Routes
 * /api/comments
 */

const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
} = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
const { commentValidation } = require("../middleware/validation");

// Get comments for a post (public)
router.get("/:postId", getComments);

// Add comment to a post (protected)
router.post("/:postId", protect, commentValidation, addComment);

// Comment-specific routes
router.put("/:id", protect, commentValidation, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like", protect, toggleCommentLike);

module.exports = router;
