"use client";

import { motion } from "framer-motion";
import CategoryFilter from "@/components/posts/CategoryFilter";
import MasonryGrid from "@/components/posts/MasonryGrid";
import { Sparkles } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      {/* Explore Header */}
      <div className="bg-gradient-to-br from-brand-500 via-pink-500 to-purple-600 text-white py-14">
        <div className="max-w-[1800px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Curated for you</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">
              Explore Ideas
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Browse through millions of handpicked pins across every category
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-8">
        <div className="mb-8">
          <CategoryFilter />
        </div>
        <MasonryGrid />
      </div>
    </div>
  );
}
