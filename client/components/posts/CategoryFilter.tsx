"use client";

/**
 * Category Filter Bar
 * Horizontal scrollable filter tabs for categories
 */

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { CATEGORIES } from "@/types";
import { usePostsStore } from "@/store";

const ALL_CATEGORIES = ["All", ...CATEGORIES];

export default function CategoryFilter() {
  const { category, setCategory } = usePostsStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left scroll button */}
      <button
        onClick={() => scroll("left")}
        className="shrink-0 w-9 h-9 rounded-full bg-white dark:bg-dark-800 shadow-sm border border-gray-200 dark:border-dark-700 flex items-center justify-center hover:shadow-md transition-all"
      >
        <ChevronLeft size={16} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Scrollable category tabs */}
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
      >
        {ALL_CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                  : "bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700"
              }`}
            >
              {cat === "All" && (
                <span className="inline-flex items-center gap-1.5">
                  <LayoutGrid size={12} />
                  All
                </span>
              )}
              {cat !== "All" && cat}
            </motion.button>
          );
        })}
      </div>

      {/* Right scroll button */}
      <button
        onClick={() => scroll("right")}
        className="shrink-0 w-9 h-9 rounded-full bg-white dark:bg-dark-800 shadow-sm border border-gray-200 dark:border-dark-700 flex items-center justify-center hover:shadow-md transition-all"
      >
        <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />
      </button>
    </div>
  );
}
