"use client";

/**
 * Post Detail Page
 * Full pin view with image, likes, saves, comments
 */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Bookmark, Share2, ExternalLink, MessageCircle, MoreHorizontal,
  Send, Loader2, ArrowLeft, Tag, Eye, ChevronLeft, Trash2, Edit3,
} from "lucide-react";
import { postService, commentService } from "@/services";
import { useAuthStore } from "@/store";
import { Post, Comment } from "@/types";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await postService.getPostById(params.id as string);
        setPost(res.post);
        setIsLiked(res.post.isLiked || false);
        setIsSaved(res.post.isSaved || false);
        setLikesCount(res.post.likesCount || res.post.likes?.length || 0);

        // Fetch comments
        const commentsRes = await commentService.getComments(params.id as string);
        setComments(commentsRes.comments);
      } catch (err: any) {
        toast.error("Failed to load post");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) fetchPost();
  }, [params.id, router]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like posts");
      return;
    }
    const prevLiked = isLiked;
    const prevCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    try {
      const res = await postService.toggleLike(post!._id);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch {
      setIsLiked(prevLiked);
      setLikesCount(prevCount);
      toast.error("Failed to update like");
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to save posts");
      return;
    }
    const prevSaved = isSaved;
    setIsSaved(!isSaved);
    try {
      const res = await postService.toggleSave(post!._id);
      setIsSaved(res.isSaved);
      toast.success(res.isSaved ? "Saved! 🔖" : "Removed from saved");
    } catch {
      setIsSaved(prevSaved);
      toast.error("Failed to update save");
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: post?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please log in to comment");
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await commentService.addComment(post!._id, commentText.trim());
      setComments([res.comment, ...comments]);
      setCommentText("");
      toast.success("Comment added!");
    } catch (err: any) {
      toast.error(err.message || "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full gradient-brand animate-spin" style={{ borderTop: "3px solid transparent" }} />
          <p className="text-gray-500 dark:text-gray-400">Loading pin...</p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const author = post.author as any;
  const isOwner = user?._id === author?._id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Panel */}
            <div className="relative bg-gray-100 dark:bg-dark-900 min-h-[400px] md:min-h-[600px] flex items-center justify-center overflow-hidden rounded-2xl md:rounded-r-none">
              {!imageLoaded && (
                <div className="absolute inset-0 skeleton animate-pulse" />
              )}
              <Image
                src={post.image?.url}
                alt={post.title}
                fill
                className={`object-contain transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Content Panel */}
            <div className="flex flex-col h-full max-h-[700px] overflow-y-auto p-6 md:p-8">
              {/* Action Bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  {/* Like */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      isLiked
                        ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                        : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                    }`}
                  >
                    <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                    <span>{likesCount}</span>
                  </motion.button>

                  {/* Save */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      isSaved
                        ? "bg-brand-500 text-white shadow-brand"
                        : "bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-500"
                    }`}
                  >
                    <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    {isSaved ? "Saved" : "Save"}
                  </motion.button>
                </div>

                <div className="flex items-center gap-1">
                  <button onClick={handleShare} className="btn-icon" aria-label="Share">
                    <Share2 size={18} />
                  </button>
                  {post.link && (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn-icon">
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {isOwner && (
                    <button className="btn-icon" aria-label="More options">
                      <MoreHorizontal size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category & Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-brand">{post.category}</span>
                {post.tags?.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag">
                    <Tag size={10} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              {post.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {post.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  {post.views || 0} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} />
                  {comments.length} comments
                </span>
                <span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>

              {/* Author */}
              <Link
                href={`/profile/${author?.username}`}
                className="flex items-center gap-3 mb-6 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors group"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-dark-700">
                  <Image
                    src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.username}`}
                    alt={author?.displayName || "User"}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">
                    {author?.displayName || author?.username}
                  </p>
                  <p className="text-xs text-gray-500">@{author?.username}</p>
                </div>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-dark-700 mb-4" />

              {/* Comments Section */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-4">
                  Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
                  {user?.avatar && (
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={user.avatar}
                        alt="You"
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder={isAuthenticated ? "Add a comment..." : "Log in to comment"}
                      disabled={!isAuthenticated}
                      maxLength={500}
                      className="input-field text-sm pr-12"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isSubmittingComment || !isAuthenticated}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-500 disabled:text-gray-300 dark:disabled:text-dark-600 hover:scale-110 transition-transform disabled:cursor-not-allowed"
                    >
                      {isSubmittingComment ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {comments.map((comment, i) => {
                      const commentAuthor = comment.author as any;
                      const isCommentOwner = user?._id === commentAuthor?._id;
                      return (
                        <motion.div
                          key={comment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.03 }}
                          className="flex gap-3 group"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                            <Image
                              src={
                                commentAuthor?.avatar ||
                                `https://ui-avatars.com/api/?name=${commentAuthor?.username}&size=32`
                              }
                              alt={commentAuthor?.displayName}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Link
                                href={`/profile/${commentAuthor?.username}`}
                                className="text-xs font-semibold text-gray-900 dark:text-white hover:text-brand-500 transition-colors"
                              >
                                {commentAuthor?.displayName || commentAuthor?.username}
                              </Link>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                              {comment.isEdited && (
                                <span className="text-xs text-gray-400 italic">(edited)</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              {comment.content}
                            </p>
                          </div>
                          {isCommentOwner && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="opacity-0 group-hover:opacity-100 btn-icon text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {comments.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-6">
                      No comments yet. Be the first to comment! 💬
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
