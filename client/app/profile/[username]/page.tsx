"use client";

/**
 * User Profile Page
 */

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Link as LinkIcon, Calendar, Grid3X3, Bookmark, Settings, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { userService } from "@/services";
import { useAuthStore } from "@/store";
import { User, Post } from "@/types";
import PinCard from "@/components/posts/PinCard";
import PinCardSkeleton from "@/components/posts/PinCardSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import { ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

type ProfileTab = "posts" | "saved";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const isOwnProfile = currentUser?.username === params.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getUserProfile(params.username as string);
        setProfileUser(res.user);
        setIsFollowing(res.user.isFollowing || false);
        setFollowersCount(res.user.followersCount || 0);
      } catch {
        toast.error("User not found");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.username) fetchProfile();
  }, [params.username]);

  useEffect(() => {
    if (!profileUser) return;
    const fetchPosts = async () => {
      setIsPostsLoading(true);
      try {
        const res = await userService.getUserPosts(profileUser.username);
        setPosts(res.posts);
      } catch {
        toast.error("Failed to load posts");
      } finally {
        setIsPostsLoading(false);
      }
    };
    fetchPosts();
  }, [profileUser]);

  const handleFollow = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to follow users");
      return;
    }
    if (isFollowLoading || !profileUser) return;

    setIsFollowing((prev) => !prev);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
    setIsFollowLoading(true);

    try {
      const res = await userService.toggleFollow(profileUser._id);
      setIsFollowing(res.isFollowing);
      setFollowersCount(res.followersCount);
    } catch {
      setIsFollowing((prev) => !prev);
      setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
      toast.error("Failed to update follow");
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (!profileUser) return null;

  const tabs: { key: ProfileTab; label: string; icon: any }[] = [
    { key: "posts", label: "Posts", icon: Grid3X3 },
    { key: "saved", label: "Saved", icon: Bookmark },
  ];

  const displayedPosts = activeTab === "posts" ? posts : savedPosts;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white dark:ring-dark-800 shadow-xl">
              <Image
                src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&size=112&background=random`}
                alt={profileUser.displayName}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            </div>
            {profileUser.isVerified && (
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          {/* Name & Username */}
          <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
            {profileUser.displayName}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-3">@{profileUser.username}</p>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-gray-600 dark:text-gray-400 max-w-md text-sm leading-relaxed mb-4">
              {profileUser.bio}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap justify-center">
            {profileUser.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {profileUser.location}
              </span>
            )}
            {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-brand-500 hover:underline"
              >
                <LinkIcon size={14} />
                {profileUser.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              Joined {format(new Date(profileUser.createdAt), "MMMM yyyy")}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {profileUser.postsCount || posts.length}
              </p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-700" />
            <div className="text-center">
              <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {followersCount}
              </p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-dark-700" />
            <div className="text-center">
              <p className="text-xl font-display font-bold text-gray-900 dark:text-white">
                {(profileUser.following as any[])?.length || 0}
              </p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {isOwnProfile ? (
              <Link href="/settings">
                <button className="btn-secondary">
                  <Settings size={16} />
                  Edit Profile
                </button>
              </Link>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFollow}
                disabled={isFollowLoading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  isFollowing
                    ? "bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                    : "btn-primary"
                }`}
              >
                {isFollowLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck size={16} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Follow
                  </>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1800px] mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-dark-800 rounded-full">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon size={15} />
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-300" : "bg-gray-200/50 dark:bg-dark-700/50 text-gray-400"
                }`}>
                  {tab.key === "posts" ? posts.length : (profileUser.savedPosts as any[])?.length || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {isPostsLoading ? (
          <div className="masonry-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <PinCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : displayedPosts.length === 0 ? (
          <EmptyState
            icon={<ImageIcon size={56} className="text-gray-300 dark:text-gray-600" />}
            title={activeTab === "posts" ? "No posts yet" : "Nothing saved yet"}
            description={
              isOwnProfile
                ? activeTab === "posts"
                  ? "Share your first creation with the world!"
                  : "Save pins you love to find them later."
                : activeTab === "posts"
                ? `${profileUser.displayName} hasn't posted anything yet.`
                : `${profileUser.displayName} hasn't saved anything yet.`
            }
            actionLabel={isOwnProfile && activeTab === "posts" ? "Create your first pin" : undefined}
            actionHref={isOwnProfile && activeTab === "posts" ? "/create" : undefined}
          />
        ) : (
          <div className="masonry-grid">
            {displayedPosts.map((post, i) => (
              <PinCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
