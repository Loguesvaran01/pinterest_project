/**
 * Zustand Global Store
 * Manages auth state, posts, and UI state
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, Post } from "@/types";

// ─── Auth Store ──────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setToken: (token) => {
        set({ token });
        // Sync to localStorage for axios interceptor
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("pinvault_token", token);
          } else {
            localStorage.removeItem("pinvault_token");
          }
        }
      },

      login: (user, token) => {
        set({ user, token, isAuthenticated: true, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.setItem("pinvault_token", token);
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("pinvault_token");
          localStorage.removeItem("pinvault_user");
        }
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "pinvault_auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Posts Feed Store ─────────────────────────────────────────────────────────

interface PostsState {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  category: string;
  search: string;
  sort: string;
  setPosts: (posts: Post[]) => void;
  appendPosts: (posts: Post[]) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: string) => void;
  updatePost: (postId: string, updates: Partial<Post>) => void;
  removePost: (postId: string) => void;
  reset: () => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  category: "All",
  search: "",
  sort: "newest",

  setPosts: (posts) => set({ posts }),
  appendPosts: (posts) => set((state) => ({ posts: [...state.posts, ...posts] })),
  setPage: (currentPage) => set({ currentPage }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (isLoading) => set({ isLoading }),
  setLoadingMore: (isLoadingMore) => set({ isLoadingMore }),
  setError: (error) => set({ error }),
  setCategory: (category) => set({ category, currentPage: 1, posts: [] }),
  setSearch: (search) => set({ search, currentPage: 1, posts: [] }),
  setSort: (sort) => set({ sort, currentPage: 1, posts: [] }),

  updatePost: (postId, updates) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p._id === postId ? { ...p, ...updates } : p
      ),
    })),

  removePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((p) => p._id !== postId),
    })),

  reset: () =>
    set({
      posts: [],
      currentPage: 1,
      totalPages: 1,
      hasMore: false,
      isLoading: false,
      error: null,
    }),
}));

// ─── UI Store ─────────────────────────────────────────────────────────────────

interface UIState {
  isDarkMode: boolean;
  isSearchOpen: boolean;
  isUploadModalOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleUploadModal: () => void;
  setUploadModalOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      isSearchOpen: false,
      isUploadModalOpen: false,
      isMobileMenuOpen: false,

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setDarkMode: (isDarkMode) => set({ isDarkMode }),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      toggleUploadModal: () =>
        set((state) => ({ isUploadModalOpen: !state.isUploadModalOpen })),
      setUploadModalOpen: (isUploadModalOpen) => set({ isUploadModalOpen }),
      toggleMobileMenu: () =>
        set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
    }),
    {
      name: "pinvault_ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
