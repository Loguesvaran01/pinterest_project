"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import MasonryGrid from "@/components/posts/MasonryGrid";
import CategoryFilter from "@/components/posts/CategoryFilter";
import { usePostsStore } from "@/store";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Viewed" },
  { value: "trending", label: "Trending" },
];

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSearch, setSort, sort, search } = usePostsStore();

  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setLocalSearch(q);
    setSearch(q);
  }, [searchParams, setSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      setSearch(localSearch.trim());
    }
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearch("");
    router.push("/search");
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950">
      <div className="max-w-[1800px] mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-6">
            {search ? `Results for "${search}"` : "Explore"}
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mb-6">
            <div className="relative group">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"
              />
              <input
                ref={inputRef}
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for ideas, people, and more..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-dark-800 border-2 border-gray-200 dark:border-dark-700 focus:border-brand-500 text-gray-900 dark:text-white placeholder:text-gray-400 outline-none text-base transition-all shadow-sm focus:shadow-md"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>

          {/* Sort & Filter Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CategoryFilter />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="shrink-0 px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer hover:border-brand-400 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <MasonryGrid />
      </div>
    </div>
  );
}
