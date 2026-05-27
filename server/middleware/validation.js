/**
 * Validation Middleware
 * Input validation using express-validator
 */

const { body, param, query, validationResult } = require("express-validator");

/**
 * Process validation results and return errors if any
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number"),
  validate,
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

// Post validation rules
const postValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be 1-100 characters"),
  body("description")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("category")
    .optional()
    .isIn([
      "Nature", "Architecture", "Food", "Travel", "Fashion", "Art",
      "Technology", "Photography", "Interior", "Fitness", "Music",
      "Animals", "DIY", "Books", "Other",
    ])
    .withMessage("Invalid category"),
  validate,
];

// Comment validation rules
const commentValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Comment must be 1-500 characters"),
  validate,
];

// Profile update validation
const profileValidation = [
  body("displayName")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Display name cannot exceed 50 characters"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),
  body("website").optional().isURL().withMessage("Please provide a valid URL"),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  postValidation,
  commentValidation,
  profileValidation,
};
