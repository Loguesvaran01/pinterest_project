/**
 * Post Controller
 * Handles all post-related operations: CRUD, likes, saves
 */

const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { cloudinary } = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @route   GET /api/posts
 * @desc    Get all posts with pagination, filtering, and search
 * @access  Public
 */
const getPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    userId,
    sort = "newest",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Build query object
  let query = { isPublic: true };

  // Filter by category
  if (category && category !== "All") {
    query.category = category;
  }

  // Filter by user
  if (userId) {
    query.author = userId;
  }

  // Text search across title, description, tags
  if (search) {
    query.$text = { $search: search };
  }

  // Sort options
  let sortObj = {};
  switch (sort) {
    case "newest":
      sortObj = { createdAt: -1 };
      break;
    case "oldest":
      sortObj = { createdAt: 1 };
      break;
    case "popular":
      sortObj = { views: -1 };
      break;
    case "trending":
      // Posts with most likes in last 7 days
      sortObj = { "likes.length": -1, createdAt: -1 };
      break;
    default:
      sortObj = { createdAt: -1 };
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("author", "username displayName avatar isVerified")
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(), // Use lean() for better performance on read-only queries
    Post.countDocuments(query),
  ]);

  // Add isLiked and isSaved flags for authenticated users
  const currentUserId = req.user?._id?.toString();
  const processedPosts = posts.map((post) => ({
    ...post,
    isLiked: currentUserId ? post.likes.some((id) => id.toString() === currentUserId) : false,
    isSaved: currentUserId ? post.saves.some((id) => id.toString() === currentUserId) : false,
    likesCount: post.likes.length,
    savesCount: post.saves.length,
    commentsCount: post.comments.length,
  }));

  res.status(200).json({
    success: true,
    posts: processedPosts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalPosts: total,
      hasMore: skip + posts.length < total,
    },
  });
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "username displayName avatar bio isVerified followers")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username displayName avatar",
      },
      options: { sort: { createdAt: -1 }, limit: 20 },
    });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  // Increment view count
  await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  // Add isLiked/isSaved flags
  const currentUserId = req.user?._id?.toString();
  const postObj = post.toObject();
  postObj.isLiked = currentUserId
    ? post.likes.some((id) => id.toString() === currentUserId)
    : false;
  postObj.isSaved = currentUserId
    ? post.saves.some((id) => id.toString() === currentUserId)
    : false;
  postObj.likesCount = post.likes.length;
  postObj.savesCount = post.saves.length;

  res.status(200).json({
    success: true,
    post: postObj,
  });
});

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, description, category, tags, link, board, imageUrl } = req.body;

  let imageData = {};

  // If file was uploaded (Cloudinary gives req.file.path; memory storage gives req.file.buffer)
  if (req.file) {
    // Cloudinary storage: file.path contains the secure URL
    if (req.file.path) {
      imageData = {
        url: req.file.path,
        publicId: req.file.filename || "",
      };
    } else {
      // Memory storage (demo mode) — use a placeholder or the provided imageUrl
      imageData = {
        url: imageUrl || `https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800`,
        publicId: "",
      };
    }
  } else if (imageUrl) {
    // External image URL provided
    imageData = { url: imageUrl, publicId: "" };
  } else {
    return res.status(400).json({
      success: false,
      message: "Please provide an image URL.",
    });
  }

  // Parse tags if string
  const parsedTags = typeof tags === "string"
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : tags || [];

  const post = await Post.create({
    title,
    description,
    image: imageData,
    category: category || "Other",
    tags: parsedTags,
    link: link || "",
    board: board || "",
    author: req.user._id,
  });

  await post.populate("author", "username displayName avatar");

  res.status(201).json({
    success: true,
    message: "Post created successfully! 📌",
    post,
  });
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Private (own post only)
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You can only edit your own posts.",
    });
  }

  const { title, description, category, tags, link, board } = req.body;
  const parsedTags = typeof tags === "string"
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : tags || post.tags;

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: title || post.title,
      description: description !== undefined ? description : post.description,
      category: category || post.category,
      tags: parsedTags,
      link: link !== undefined ? link : post.link,
      board: board !== undefined ? board : post.board,
    },
    { new: true, runValidators: true }
  ).populate("author", "username displayName avatar");

  res.status(200).json({
    success: true,
    message: "Post updated successfully.",
    post: updatedPost,
  });
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Private (own post or admin)
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  // Check ownership
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You can only delete your own posts.",
    });
  }

  // Delete image from Cloudinary if it exists
  if (post.image.publicId) {
    try {
      await cloudinary.uploader.destroy(post.image.publicId);
    } catch (err) {
      console.error("Cloudinary deletion error:", err);
    }
  }

  // Delete all comments associated with this post
  await Comment.deleteMany({ post: post._id });

  // Remove post from users' savedPosts
  await User.updateMany(
    { savedPosts: post._id },
    { $pull: { savedPosts: post._id } }
  );

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

/**
 * @route   POST /api/posts/:id/like
 * @desc    Like or unlike a post (toggle)
 * @access  Private
 */
const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const userId = req.user._id;
  const isLiked = post.likes.includes(userId);

  // Toggle like
  if (isLiked) {
    await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } });
  } else {
    await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } });
  }

  const updatedPost = await Post.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: isLiked ? "Post unliked." : "Post liked! ❤️",
    isLiked: !isLiked,
    likesCount: updatedPost.likes.length,
  });
});

/**
 * @route   POST /api/posts/:id/save
 * @desc    Save or unsave a post (toggle)
 * @access  Private
 */
const toggleSave = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ success: false, message: "Post not found." });
  }

  const userId = req.user._id;
  const isSaved = post.saves.includes(userId);

  if (isSaved) {
    // Unsave: remove from post saves and user savedPosts
    await Post.findByIdAndUpdate(req.params.id, { $pull: { saves: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: post._id } });
  } else {
    // Save: add to post saves and user savedPosts
    await Post.findByIdAndUpdate(req.params.id, { $addToSet: { saves: userId } });
    await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: post._id } });
  }

  const updatedPost = await Post.findById(req.params.id);

  res.status(200).json({
    success: true,
    message: isSaved ? "Post unsaved." : "Post saved! 🔖",
    isSaved: !isSaved,
    savesCount: updatedPost.saves.length,
  });
});

/**
 * @route   GET /api/posts/saved
 * @desc    Get current user's saved posts
 * @access  Private
 */
const getSavedPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const user = await User.findById(req.user._id).populate({
    path: "savedPosts",
    populate: { path: "author", select: "username displayName avatar" },
    options: {
      skip,
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    },
  });

  const total = user.savedPosts.length;

  res.status(200).json({
    success: true,
    posts: user.savedPosts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalPosts: total,
    },
  });
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  getSavedPosts,
};
