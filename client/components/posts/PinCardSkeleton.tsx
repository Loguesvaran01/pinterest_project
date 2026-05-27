"use client";

/**
 * PinCard Skeleton Loading Component
 */

import { motion } from "framer-motion";

interface PinCardSkeletonProps {
  index?: number;
}

// Different heights to simulate varied pin heights
const heights = [220, 280, 180, 320, 250, 200, 300, 240, 190, 260, 310, 170];

export default function PinCardSkeleton({ index = 0 }: PinCardSkeletonProps) {
  const height = heights[index % heights.length];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="masonry-item"
    >
      <div className="rounded-2xl overflow-hidden bg-gray-200 dark:bg-dark-800">
        {/* Image skeleton */}
        <div
          className="relative overflow-hidden"
          style={{ height: `${height}px` }}
        >
          <div className="absolute inset-0 skeleton-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-dark-800 dark:via-dark-700 dark:to-dark-800" />
        </div>

        {/* Content skeleton */}
        <div className="p-3 space-y-2 bg-white dark:bg-dark-800">
          <div className="h-3 skeleton rounded-full w-3/4" />
          <div className="h-3 skeleton rounded-full w-1/2" />
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 skeleton rounded-full shrink-0" />
            <div className="h-2.5 skeleton rounded-full w-20" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
