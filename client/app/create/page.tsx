"use client";

/**
 * Create Post Page
 * Image upload form with preview and Cloudinary integration
 */

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Image as ImageIcon, Link as LinkIcon, Tag, X,
  Loader2, ArrowLeft, Plus, Check,
} from "lucide-react";
import { postService } from "@/services";
import { useAuthStore } from "@/store";
import { CATEGORIES, Category } from "@/types";
import toast from "react-hot-toast";

export default function CreatePostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other" as Category,
    tags: "",
    link: "",
    board: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum 10MB.");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleUrlPreview = () => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!imageFile && !formData.imageUrl && !imagePreview)
      newErrors.image = "Please provide an image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await postService.createPost({
        ...formData,
        image: imageFile || undefined,
      });
      toast.success("Pin created successfully! 📌");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to create pin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Create Pin
          </h1>
          <div className="w-20" />
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left - Image Upload */}
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Add your image
                </h2>

                {/* Tab Switcher */}
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-dark-800 rounded-xl mb-4">
                  {(["upload", "url"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                        activeTab === tab
                          ? "bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      {tab === "upload" ? "Upload File" : "Add URL"}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "upload" ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {/* Drop Zone */}
                      <div
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden ${
                          isDragging
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : imagePreview
                            ? "border-transparent"
                            : "border-gray-300 dark:border-dark-600 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-gray-50 dark:hover:bg-dark-800"
                        }`}
                        style={{ minHeight: "300px" }}
                      >
                        {imagePreview ? (
                          <div className="relative w-full h-full min-h-[300px]">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-contain rounded-2xl"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagePreview("");
                                setImageFile(null);
                              }}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-dark-800 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full py-16 gap-4">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                              isDragging ? "bg-brand-100 dark:bg-brand-900/30" : "bg-gray-100 dark:bg-dark-800"
                            }`}>
                              {isDragging ? (
                                <Plus size={28} className="text-brand-500" />
                              ) : (
                                <Upload size={28} className="text-gray-400" />
                              )}
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-700 dark:text-gray-300">
                                {isDragging ? "Drop it here!" : "Drag & drop or click to upload"}
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                JPG, PNG, GIF, WebP up to 10MB
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="url"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-3"
                    >
                      <div className="relative">
                        <LinkIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="input-field pl-11 pr-20"
                        />
                        <button
                          type="button"
                          onClick={handleUrlPreview}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-200 dark:bg-dark-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                      {imagePreview && (
                        <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: "200px" }}>
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain"
                            onError={() => {
                              setImagePreview("");
                              toast.error("Could not load image from URL");
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors.image && (
                  <p className="text-red-500 text-xs mt-2">{errors.image}</p>
                )}
              </div>

              {/* Right - Post Details */}
              <div className="space-y-5">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Pin details
                </h2>

                {/* Title */}
                <div>
                  <label className="input-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Add a catchy title..."
                    maxLength={100}
                    className={`input-field ${errors.title ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                    <p className="text-xs text-gray-400 ml-auto">{formData.title.length}/100</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="input-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell everyone about your pin..."
                    maxLength={2000}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="input-label">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="input-field appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="input-label">
                    <Tag size={14} className="inline mr-1.5" />
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="nature, photography, travel..."
                    className="input-field"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="input-label">
                    <LinkIcon size={14} className="inline mr-1.5" />
                    Destination URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="input-field"
                  />
                </div>

                {/* Board */}
                <div>
                  <label className="input-label">Board (optional)</label>
                  <input
                    type="text"
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    placeholder="e.g., Dream Home, Travel Goals"
                    className="input-field"
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Publishing pin...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Publish Pin
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
