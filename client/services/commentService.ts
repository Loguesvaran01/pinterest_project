/**
 * Comment API Service
 */

import api from "./api";
import { Comment } from "@/types";

export const commentService = {
  getComments: async (postId: string, page: number = 1): Promise<{ success: boolean; comments: Comment[]; pagination: any }> => {
    const response = await api.get(`/comments/${postId}?page=${page}`);
    return response.data;
  },

  addComment: async (postId: string, content: string, parentCommentId?: string): Promise<{ success: boolean; comment: Comment }> => {
    const response = await api.post(`/comments/${postId}`, { content, parentCommentId });
    return response.data;
  },

  updateComment: async (commentId: string, content: string): Promise<{ success: boolean; comment: Comment }> => {
    const response = await api.put(`/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  toggleCommentLike: async (commentId: string): Promise<{ success: boolean; isLiked: boolean; likesCount: number }> => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },
};


