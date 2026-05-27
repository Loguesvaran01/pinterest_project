/**
 * Comment Controller
 * Handles creating, reading, updating, and deleting comments
 */

const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @route   GET /api/comments/:postId
 * @desc    Get all comments for a post
 * @access  Public
 */
const getComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [comments, total] = await Promise.all([
    Comment.find({ post: req.params.postId, parentComment: null })
      .populate("author", "username displayName avatar isVerified")
      .populate({
        path: "replies",
        populate: { path: "author", select: "username displayName avatar" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Comment.countDocuments({ post: req.params.postId, parentComment: null }),
  ]);

  res.status(200).json({
    success: true,
    comments,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalComments: total,
      hasMore: skip + comments.length < total,
    },
  });
});

/**
 * @route   POST /api/comments/:postId
 * @desc    Add a comment to a post
 * @access  Private
 */
const addComment = asyncHandler(async (req, res) => {
  const { content, parentCommentId } = req.body;

  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  // Create comment
  const comment = await Comment.create({
    content,
    author: req.user._id,
    post: req.params.postId,
    parentComment: parentCommentId || null,
  });

  // If it's a reply, add to parent comment's replies
  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, {
      $addToSet: { replies: comment._id },
    });
  } else {
    // Add comment to post's comments array
    await Post.findByIdAndUpdate(req.params.postId, {
      $addToSet: { comments: comment._id },
    });
  }

  // Populate author for the response
  await comment.populate("author", "username displayName avatar isVerified");

  res.status(201).json({
    success: true,
    message: "Comment added successfully.",
    comment,
  });
});

/**
 * @route   PUT /api/comments/:id
 * @desc    Update a comment
 * @access  Private (own comment only)
 */
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found." });
  }

  // Check ownership
  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You can only edit your own comments.",
    });
  }

  comment.content = req.body.content;
  comment.isEdited = true;
  comment.editedAt = new Date();
  await comment.save();

  await comment.populate("author", "username displayName avatar");

  res.status(200).json({
    success: true,
    message: "Comment updated successfully.",
    comment,
  });
});

/**
 * @route   DELETE /api/comments/:id
 * @desc    Delete a comment
 * @access  Private (own comment or admin)
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found." });
  }

  // Check ownership or admin
  if (
    comment.author.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own comments.",
    });
  }

  // Remove from post's comments array
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });

  // Remove from parent comment's replies if it's a reply
  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: comment._id },
    });
  }

  // Delete all replies to this comment
  await Comment.deleteMany({ parentComment: comment._id });

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully.",
  });
});

/**
 * @route   POST /api/comments/:id/like
 * @desc    Like or unlike a comment
 * @access  Private
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ success: false, message: "Comment not found." });
  }

  const userId = req.user._id;
  const isLiked = comment.likes.includes(userId);

  if (isLiked) {
    await Comment.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
  } else {
    await Comment.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
  }

  const updatedComment = await Comment.findById(req.params.id);

  res.status(200).json({
    success: true,
    isLiked: !isLiked,
    likesCount: updatedComment.likes.length,
  });
});

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
};
