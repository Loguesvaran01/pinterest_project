/**
 * Cloudinary Configuration
 * Handles image upload to Cloudinary CDN
 * Falls back to memory storage if Cloudinary is not configured
 */

const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo",
});

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "demo" &&
  process.env.CLOUDINARY_API_KEY !== "demo";

let storage;

if (isCloudinaryConfigured) {
  // Use Cloudinary storage when properly configured
  try {
    const { CloudinaryStorage } = require("multer-storage-cloudinary");
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: "pinvault",
        allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
        transformation: [
          { width: 1200, height: 1200, crop: "limit", quality: "auto:good" },
        ],
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
      }),
    });
    console.log("✅ Cloudinary storage configured");
  } catch (err) {
    console.warn("⚠️  Cloudinary storage failed, using memory storage:", err.message);
    storage = multer.memoryStorage();
  }
} else {
  // Use memory storage + save as local URL for demo mode
  console.log("ℹ️  Cloudinary not configured — using memory storage (demo mode)");
  storage = multer.memoryStorage();
}

// File filter — only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

module.exports = { cloudinary, upload, isCloudinaryConfigured };
