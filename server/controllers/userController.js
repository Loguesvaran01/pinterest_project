/**
 * User Controller
 * Handles user profile operations, following, etc.
 */

const User = require("../models/User");
const Post = require("../models/Post");
const { cloudinary } = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @route   GET /api/users/:username
 * @desc    Get user profile by username
 * @access  Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .select("-password -resetPasswordToken -resetPasswordExpire")
    .populate("following", "username displayName avatar isVerified")
    .populate("followers", "username displayName avatar isVerified");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  // Get user's post count
  const postsCount = await Post.countDocuments({ author: user._id, isPublic: true });

  // Check if current user follows this user
  const isFollowing = req.user
    ? user.followers.some((f) => f._id.toString() === req.user._id.toString())
    : false;

  res.status(200).json({
    success: true,
    user: {
      ...user.toObject(),
      postsCount,
      isFollowing,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    },
  });
});

/**
 * @route   GET /api/users/:username/posts
 * @desc    Get all posts by a user
 * @access  Public
 */
const getUserPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const [posts, total] = await Promise.all([
    Post.find({ author: user._id, isPublic: true })
      .populate("author", "username displayName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Post.countDocuments({ author: user._id, isPublic: true }),
  ]);

  res.status(200).json({
    success: true,
    posts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalPosts: total,
      hasMore: skip + posts.length < total,
    },
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { displayName, bio, website, location } = req.body;

  const updateData = {};
  if (displayName !== undefined) updateData.displayName = displayName;
  if (bio !== undefined) updateData.bio = bio;
  if (website !== undefined) updateData.website = website;
  if (location !== undefined) updateData.location = location;

  // Handle avatar upload
  if (req.file) {
    // Delete old avatar from Cloudinary if it exists and is not a UI avatar
    const currentUser = await User.findById(req.user._id);
    if (currentUser.avatar && currentUser.avatar.includes("cloudinary")) {
      // Extract public_id from URL (simplified - in production store publicId separately)
      try {
        const urlParts = currentUser.avatar.split("/");
        const publicId = urlParts[urlParts.length - 1].split(".")[0];
        await cloudinary.uploader.destroy(`pinvault/avatars/${publicId}`);
      } catch (err) {
        console.error("Old avatar deletion error:", err);
      }
    }
    updateData.avatar = req.file.path;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user,
  });
});

/**
 * @route   POST /api/users/:id/follow
 * @desc    Follow or unfollow a user (toggle)
 * @access  Private
 */
const toggleFollow = asyncHandler(async (req, res) => {
  const targetUserId = req.params.id;
  const currentUserId = req.user._id;

  // Can't follow yourself
  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({
      success: false,
      message: "You cannot follow yourself.",
    });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ success: false, message: "User not found." });
  }

  const isFollowing = targetUser.followers.includes(currentUserId);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: targetUserId } });
  } else {
    // Follow
    await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: currentUserId } });
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: targetUserId } });
  }

  const updatedTarget = await User.findById(targetUserId);

  res.status(200).json({
    success: true,
    message: isFollowing ? "Unfollowed successfully." : "Following! 🎉",
    isFollowing: !isFollowing,
    followersCount: updatedTarget.followers.length,
  });
});

/**
 * @route   GET /api/users/search
 * @desc    Search users by username or display name
 * @access  Public
 */
const searchUsers = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required.",
    });
  }

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { displayName: { $regex: q, $options: "i" } },
    ],
  })
    .select("username displayName avatar bio isVerified followers")
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    users,
    count: users.length,
  });
});

/**
 * @route   GET /api/users/suggestions
 * @desc    Get user suggestions (people to follow)
 * @access  Private
 */
const getSuggestions = asyncHandler(async (req, res) => {
  const currentUser = await User.findById(req.user._id);

  // Get users not followed by current user (exclude self)
  const suggestions = await User.find({
    _id: {
      $ne: req.user._id,
      $nin: currentUser.following,
    },
  })
    .select("username displayName avatar bio isVerified followers")
    .sort({ "followers.length": -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    users: suggestions,
  });
});

module.exports = {
  getUserProfile,
  getUserPosts,
  updateProfile,
  toggleFollow,
  searchUsers,
  getSuggestions,
};
