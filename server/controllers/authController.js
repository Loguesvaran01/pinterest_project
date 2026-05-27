/**
 * Auth Controller
 * Handles user registration, login, and profile retrieval
 */

const User = require("../models/User");
const { generateToken } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, displayName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    const field = existingUser.email === email ? "email" : "username";
    return res.status(409).json({
      success: false,
      message: `An account with this ${field} already exists.`,
    });
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    displayName: displayName || username,
    avatar: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff&size=200`,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: "Account created successfully! Welcome to PinVault 🎉",
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password field (normally excluded)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  // Update last seen
  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Welcome back! 👋",
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      savedPosts: user.savedPosts,
      following: user.following,
      followers: user.followers,
      createdAt: user.createdAt,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("following", "username displayName avatar")
    .populate("followers", "username displayName avatar")
    .populate("savedPosts", "_id title image.url");

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client should clear token)
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless - client removes token
  // Update last seen
  await User.findByIdAndUpdate(req.user._id, { lastSeen: new Date() });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect.",
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Password changed successfully.",
    token,
  });
});

module.exports = { register, login, getMe, logout, changePassword };
