/**
 * Global TypeScript Types for PinVault
 */

// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  avatar: string;
  website?: string;
  location?: string;
  role: "user" | "admin";
  isVerified: boolean;
  following: string[] | User[];
  followers: string[] | User[];
  savedPosts: string[] | Post[];
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

// Post types
export interface PostImage {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

export type Category =
  | "Nature"
  | "Architecture"
  | "Food"
  | "Travel"
  | "Fashion"
  | "Art"
  | "Technology"
  | "Photography"
  | "Interior"
  | "Fitness"
  | "Music"
  | "Animals"
  | "DIY"
  | "Books"
  | "Other";

export const CATEGORIES: Category[] = [
  "Nature", "Architecture", "Food", "Travel", "Fashion", "Art",
  "Technology", "Photography", "Interior", "Fitness", "Music",
  "Animals", "DIY", "Books", "Other",
];

export interface Post {
  _id: string;
  title: string;
  description: string;
  image: PostImage;
  author: User;
  category: Category;
  tags: string[];
  link?: string;
  board?: string;
  likes: string[];
  saves: string[];
  comments: string[] | Comment[];
  views: number;
  isPublic: boolean;
  slug: string;
  // Client-side computed
  isLiked?: boolean;
  isSaved?: boolean;
  likesCount?: number;
  savesCount?: number;
  commentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Comment types
export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parentComment?: string;
  replies: Comment[];
  likes: string[];
  likesCount?: number;
  isLiked?: boolean;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

// Filter types
export interface PostFilters {
  category?: string;
  search?: string;
  userId?: string;
  sort?: "newest" | "oldest" | "popular" | "trending";
  page?: number;
  limit?: number;
}

// Form types
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  displayName?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface CreatePostFormData {
  title: string;
  description?: string;
  category: Category;
  tags?: string;
  link?: string;
  board?: string;
  image?: File;
  imageUrl?: string;
}

export interface ProfileFormData {
  displayName?: string;
  bio?: string;
  website?: string;
  location?: string;
  avatar?: File;
}

// UI state types
export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

// Sort options
export type SortOption = "newest" | "oldest" | "popular" | "trending";
