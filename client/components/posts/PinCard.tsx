"use client";

/**
 * PinCard Component
 * Individual Pinterest-style pin card with hover overlay
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Bookmark, Download, MoreHorizontal, ExternalLink } from "lucide-react";
import { Post } from "@/types";
import { postService } from "@/services";
import { useAuthStore, usePostsStore } from "@/store";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface PinCardProps {
  post: Post;
  index?: number;
}

export default function PinCard({ post, index = 0 }: PinCardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { updatePost } = usePostsStore();

  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || post.likes?.length || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle like toggle
  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Please log in to like posts");
        return;
      }

      if (isLikeLoading) return;

      // Optimistic update
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
      setIsLikeLoading(true);

      try {
        const res = await postService.toggleLike(post._id);
        setIsLiked(res.isLiked);
        setLikesCount(res.likesCount);
        updatePost(post._id, {
          isLiked: res.isLiked,
          likesCount: res.likesCount,
        });
      } catch {
        // Revert on error
        setIsLiked((prev) => !prev);
        setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
        toast.error("Failed to update like");
      } finally {
        setIsLikeLoading(false);
      }
    },
    [isAuthenticated, isLiked, isLikeLoading, post._id, updatePost]
  );

  // Handle save toggle
  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAuthenticated) {
        toast.error("Please log in to save posts");
        return;
      }

      if (isSaveLoading) return;

      setIsSaved((prev) => !prev);
      setIsSaveLoading(true);

      try {
        const res = await postService.toggleSave(post._id);
        setIsSaved(res.isSaved);
        updatePost(post._id, { isSaved: res.isSaved });
        toast.success(res.isSaved ? "Saved to your collection! 🔖" : "Removed from saved");
      } catch {
        setIsSaved((prev) => !prev);
        toast.error("Failed to update saved");
      } finally {
        setIsSaveLoading(false);
      }
    },
    [isAuthenticated, isSaved, isSaveLoading, post._id, updatePost]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="masonry-item"
    >
      <Link href={`/post/${post._id}`} className="block">
        <div className="pin-card group">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            {/* Skeleton while loading */}
            {!imageLoaded && (
              <div className="skeleton w-full" style={{ aspectRatio: "3/4", minHeight: "200px" }} />
            )}

            {/* Main Image */}
            <Image
              src={post.image?.url || "https://images.unsplash.com/photo-1579783902614?w=400"}
              alt={post.title}
              width={400}
              height={600}
              className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />

            {/* Hover Overlay */}
            <div className="pin-card-overlay">
              {/* Top Actions */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {/* Save Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isSaved
                      ? "bg-brand-500 text-white"
                      : "bg-white text-gray-800 hover:bg-brand-500 hover:text-white"
                  }`}
                >
                  <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                </motion.button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                  {post.category}
                </span>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg mb-2">
                  {post.title}
                </h3>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between">
                  {/* Author */}
                  <Link
                    href={`/profile/${(post.author as any)?.username || "#"}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 group/author"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/50">
                      <Image
                        src={
                          (post.author as any)?.avatar ||
                          `https://ui-avatars.com/api/?name=${(post.author as any)?.username}&size=24`
                        }
                        alt={(post.author as any)?.displayName || "User"}
                        width={24}
                        height={24}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="text-white/80 text-xs group-hover/author:text-white transition-colors line-clamp-1 max-w-[80px]">
                      {(post.author as any)?.displayName || (post.author as any)?.username}
                    </span>
                  </Link>

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLike}
                    className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                  >
                    <Heart
                      size={14}
                      className={`transition-all duration-200 ${
                        isLiked ? "fill-red-500 text-red-500 scale-110" : ""
                      }`}
                    />
                    {likesCount > 0 && (
                      <span className="text-xs font-medium">{likesCount}</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* External link icon */}
            {post.link && (
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                >
                  <ExternalLink size={12} className="text-gray-700" />
                </a>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
