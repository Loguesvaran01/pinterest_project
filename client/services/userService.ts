/**
 * User API Service
 */

import api from "./api";
import { User, ProfileFormData, Post } from "@/types";

export const userService = {
  getUserProfile: async (username: string): Promise<{ success: boolean; user: User }> => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },

  getUserPosts: async (username: string, page: number = 1): Promise<{ success: boolean; posts: Post[]; pagination: any }> => {
    const response = await api.get(`/users/${username}/posts?page=${page}`);
    return response.data;
  },

  updateProfile: async (data: ProfileFormData): Promise<{ success: boolean; user: User }> => {
    const formData = new FormData();
    if (data.displayName) formData.append("displayName", data.displayName);
    if (data.bio !== undefined) formData.append("bio", data.bio);
    if (data.website !== undefined) formData.append("website", data.website);
    if (data.location !== undefined) formData.append("location", data.location);
    if (data.avatar) formData.append("avatar", data.avatar);
    const response = await api.put("/users/profile/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  toggleFollow: async (userId: string): Promise<{ success: boolean; isFollowing: boolean; followersCount: number }> => {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  searchUsers: async (query: string, limit: number = 10): Promise<{ success: boolean; users: User[] }> => {
    const response = await api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  getSuggestions: async (): Promise<{ success: boolean; users: User[] }> => {
    const response = await api.get("/users/me/suggestions");
    return response.data;
  },
};
