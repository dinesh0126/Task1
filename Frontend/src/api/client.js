import axios from "axios";
import { useAuthStore } from "../store/authStore";

const defaultApiUrl = "https://task1-5peo.vercel.app/api/v1";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const isBrowser = typeof window !== "undefined";
const isLocalFrontend =
  isBrowser &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const resolveApiUrl = () => {
  if (!configuredApiUrl) {
    return defaultApiUrl;
  }

  const isLocalApiUrl =
    configuredApiUrl.includes("localhost") ||
    configuredApiUrl.includes("127.0.0.1");

  if (isLocalApiUrl && !isLocalFrontend) {
    return defaultApiUrl;
  }

  return configuredApiUrl;
};

const api = axios.create({
  baseURL: resolveApiUrl()
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
