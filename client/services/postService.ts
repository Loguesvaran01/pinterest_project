/**
 * Post API Service
 */

import api from "./api";
import { Post, PostFilters, CreatePostFormData } from "@/types";

export const postService = {
  getPosts: async (filters: PostFilters = {}): Promise<{ success: boolean; posts: Post[]; pagination: any }> => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", filters.page.toString());
    if (filters.limit) params.set("limit", filters.limit.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.userId) params.set("userId", filters.userId);
    if (filters.sort) params.set("sort", filters.sort);
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  getPostById: async (id: string): Promise<{ success: boolean; post: Post }> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostFormData): Promise<{ success: boolean; post: Post }> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    formData.append("category", data.category);
    if (data.tags) formData.append("tags", data.tags);
    if (data.link) formData.append("link", data.link);
    if (data.board) formData.append("board", data.board);
    if (data.image) formData.append("image", data.image);
    if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
    const response = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updatePost: async (id: string, data: Partial<CreatePostFormData>): Promise<{ success: boolean; post: Post }> => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  toggleLike: async (id: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  toggleSave: async (id: string): Promise<{ success: boolean; isSaved: boolean; savesCount: number }> => {
    const response = await api.post(`/posts/${id}/save`);
    return response.data;
  },

  getSavedPosts: async (page: number = 1): Promise<{ success: boolean; posts: Post[]; pagination: any }> => {
    const response = await api.get(`/posts/saved?page=${page}`);
    return response.data;
  },
};
