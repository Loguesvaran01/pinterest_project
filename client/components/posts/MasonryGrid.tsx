"use client";

/**
 * MasonryGrid Component
 * Pinterest-style masonry grid with infinite scroll
 */

import { useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import PinCard from "./PinCard";
import PinCardSkeleton from "./PinCardSkeleton";
import { postService } from "@/services";
import { usePostsStore } from "@/store";
import { PostFilters } from "@/types";
import EmptyState from "@/components/ui/EmptyState";
import { ImageOff } from "lucide-react";

interface MasonryGridProps {
  filters?: PostFilters;
}

export default function MasonryGrid({ filters = {} }: MasonryGridProps) {
  const {
    posts, isLoading, isLoadingMore, hasMore, currentPage,
    setPosts, appendPosts, setPage, setHasMore,
    setLoading, setLoadingMore, setError, category, search, sort,
  } = usePostsStore();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);

  // Fetch posts
  const fetchPosts = useCallback(
    async (page: number, append: boolean = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const res = await postService.getPosts({
          page,
          limit: 20,
          category: category === "All" ? undefined : category,
          search: search || undefined,
          sort: sort as any,
          ...filters,
        });

        if (append) {
          appendPosts(res.posts);
        } else {
          setPosts(res.posts);
        }

        setHasMore(res.pagination.hasMore);
        setPage(page);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load posts");
      } finally {
        setLoading(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [category, search, sort, filters, setPosts, appendPosts, setHasMore, setPage, setLoading, setLoadingMore, setError]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchPosts(1, false);
  }, [category, search, sort]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          fetchPosts(currentPage + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, isLoadingMore, isLoading, currentPage, fetchPosts]);

  // Skeleton count for initial load
  const SKELETON_COUNT = 12;

  if (isLoading) {
    return (
      <div className="masonry-grid">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PinCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  if (!isLoading && posts.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff size={56} className="text-gray-300 dark:text-gray-600" />}
        title="No pins found"
        description={
          search
            ? `No results for "${search}". Try a different search term.`
            : category !== "All"
            ? `No pins in ${category} yet. Be the first to add one!`
            : "The feed is empty. Start exploring and creating!"
        }
        actionLabel="Explore Categories"
        actionHref="/explore"
      />
    );
  }

  return (
    <div>
      {/* Masonry Grid */}
      <div className="masonry-grid">
        {posts.map((post, index) => (
          <PinCard key={post._id} post={post} index={index} />
        ))}
      </div>

      {/* Load More Trigger (Intersection Observer target) */}
      <div ref={loadMoreRef} className="h-4 mt-4" />

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="masonry-grid mt-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <PinCardSkeleton key={`more-${i}`} index={i} />
          ))}
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-dark-800">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              You've reached the end — {posts.length} pins explored!
            </span>
            <span className="w-2 h-2 rounded-full bg-brand-500" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
