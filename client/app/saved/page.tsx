"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import MasonryGrid from "@/components/posts/MasonryGrid";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function SavedPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-[1800px] mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center">
            <Bookmark size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              Saved Pins
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your personal collection
            </p>
          </div>
        </motion.div>

        <MasonryGrid filters={{ userId: user?._id }} />
      </div>
    </div>
  );
}
