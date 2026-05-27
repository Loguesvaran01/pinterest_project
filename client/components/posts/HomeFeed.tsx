"use client";

/**
 * HomeFeed Component - Main feed with category filter and masonry grid
 */

import { motion } from "framer-motion";
import CategoryFilter from "./CategoryFilter";
import MasonryGrid from "./MasonryGrid";
import { useAuthStore } from "@/store";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function HomeFeed() {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="max-w-[1800px] mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
            Explore
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Discover ideas from our community
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter />
      </div>

      {/* Masonry Grid */}
      <MasonryGrid />

      {/* Floating Create Button */}
      {isAuthenticated && (
        <Link href="/create">
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fab"
            aria-label="Create new pin"
          >
            <Plus size={24} />
          </motion.button>
        </Link>
      )}
    </section>
  );
}
