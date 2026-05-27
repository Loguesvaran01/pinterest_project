/**
 * Upload Routes
 * /api/upload - standalone image upload endpoint
 */

const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");
const { asyncHandler } = require("../middleware/errorHandler");

/**
 * @route   POST /api/upload/image
 * @desc    Upload a single image to Cloudinary
 * @access  Private
 */
router.post(
  "/image",
  protect,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully.",
      url: req.file.path,
      publicId: req.file.filename,
    });
  })
);

/**
 * @route   DELETE /api/upload/image/:publicId
 * @desc    Delete an image from Cloudinary
 * @access  Private
 */
router.delete(
  "/image/:publicId",
  protect,
  asyncHandler(async (req, res) => {
    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
    });
  })
);

module.exports = router;
