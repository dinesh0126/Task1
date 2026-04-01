import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/client";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthLoading: false,
      authError: "",

      signup: async (payload) => {
        set({ isAuthLoading: true, authError: "" });
        try {
          const response = await api.post("/auth/signup", payload, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          set({
            user: response.data.data.user,
            token: response.data.data.token,
            isAuthLoading: false
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Signup failed";
          set({ authError: message, isAuthLoading: false });
          return { success: false, message };
        }
      },

      login: async (payload) => {
        set({ isAuthLoading: true, authError: "" });
        try {
          const response = await api.post("/auth/login", payload);
          set({
            user: response.data.data.user,
            token: response.data.data.token,
            isAuthLoading: false
          });
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || "Login failed";
          set({ authError: message, isAuthLoading: false });
          return { success: false, message };
        }
      },

      restoreSession: async () => {
        if (!get().token) {
          return;
        }

        set({ isAuthLoading: true });
        try {
          const response = await api.get("/auth/me");
          set({
            user: response.data.data.user,
            isAuthLoading: false,
            authError: ""
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthLoading: false,
            authError: ""
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          authError: ""
        });
      }
    }),
    {
      name: "mini-social-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);
