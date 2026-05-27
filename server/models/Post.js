/**
 * Post Model
 * Represents a pin/post in the PinVault application
 */

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    image: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      publicId: {
        type: String, // Cloudinary public_id for deletion
        default: "",
      },
      width: Number,
      height: Number,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    // Categories for filtering
    category: {
      type: String,
      enum: [
        "Nature",
        "Architecture",
        "Food",
        "Travel",
        "Fashion",
        "Art",
        "Technology",
        "Photography",
        "Interior",
        "Fitness",
        "Music",
        "Animals",
        "DIY",
        "Books",
        "Other",
      ],
      default: "Other",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    // External link for the pin
    link: {
      type: String,
      trim: true,
      default: "",
    },
    // Users who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Users who saved this post
    saves: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Comments on this post
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    // View count for analytics
    views: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    // Board/collection this post belongs to
    board: {
      type: String,
      trim: true,
      default: "",
    },
    // SEO-friendly slug
    slug: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ title: "text", description: "text", tags: "text" }); // Text search index

// Virtual: likes count
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

// Virtual: saves count
postSchema.virtual("savesCount").get(function () {
  return this.saves.length;
});

// Virtual: comments count
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

// Pre-save: generate unique slug from title
postSchema.pre("save", async function (next) {
  if (this.isModified("title") || this.isNew) {
    const slugify = require("slugify");
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    this.slug = `${baseSlug}-${randomSuffix}`;
  }
  next();
});

// Instance method: check if user has liked this post
postSchema.methods.isLikedBy = function (userId) {
  return this.likes.includes(userId);
};

// Instance method: check if user has saved this post
postSchema.methods.isSavedBy = function (userId) {
  return this.saves.includes(userId);
};

module.exports = mongoose.model("Post", postSchema);
