/**
 * Auth API Service
 */

import api from "./api";
import { AuthResponse, RegisterFormData, LoginFormData, User } from "@/types";

export const authService = {
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; user: User }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ success: boolean; message: string; token: string }> => {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },
};
