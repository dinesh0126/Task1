import { create } from "zustand";
import api from "../api/client";

export const usePostStore = create((set, get) => ({
  posts: [],
  page: 1,
  limit: 10,
  totalPages: 1,
  isFeedLoading: false,
  isSubmittingPost: false,
  feedError: "",

  updatePostInState: (postId, updater) =>
    set((state) => ({
      posts: state.posts.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        return typeof updater === "function" ? updater(post) : updater;
      })
    })),

  fetchFeed: async (page = 1) => {
    set({ isFeedLoading: true, feedError: "" });
    try {
      const response = await api.get(`/posts?page=${page}&limit=${get().limit}`);
      set({
        posts: response.data.data.posts,
        page: response.data.meta.page,
        totalPages: response.data.meta.totalPages || 1,
        isFeedLoading: false
      });
    } catch (error) {
      set({
        feedError: error.response?.data?.message || "Unable to load feed",
        isFeedLoading: false
      });
    }
  },

  createPost: async (payload) => {
    set({ isSubmittingPost: true, feedError: "" });
    try {
      const response = await api.post("/posts", payload);
      set((state) => ({
        posts: [response.data.data.post, ...state.posts],
        isSubmittingPost: false
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Unable to create post";
      set({ feedError: message, isSubmittingPost: false });
      return { success: false, message };
    }
  },

  toggleLike: async (postId) => {
    try {
      const response = await api.patch(`/posts/${postId}/like`);
      get().updatePostInState(postId, response.data.data.post);
    } catch (error) {
      set({
        feedError: error.response?.data?.message || "Unable to update like"
      });
    }
  },

  addComment: async (postId, text) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { text });
      get().updatePostInState(postId, response.data.data.post);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Unable to add comment";
      set({ feedError: message });
      return { success: false, message };
    }
  },

  deleteComment: async (postId, commentId) => {
    try {
      const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
      get().updatePostInState(postId, response.data.data.post);
    } catch (error) {
      set({
        feedError: error.response?.data?.message || "Unable to delete comment"
      });
    }
  },

  deletePost: async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId)
      }));
    } catch (error) {
      set({
        feedError: error.response?.data?.message || "Unable to delete post"
      });
    }
  }
}));
