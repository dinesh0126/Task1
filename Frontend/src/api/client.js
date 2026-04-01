import axios from "axios";
import { useAuthStore } from "../store/authStore";

const defaultApiUrl = "https://task1-5peo.vercel.app/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
