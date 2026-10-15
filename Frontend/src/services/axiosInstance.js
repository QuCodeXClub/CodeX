import axios from "axios";
import store from "../store/store";
import { setError, setSuccess } from "../context/messageSlice";
import { setLogout } from "../context/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  // Dual auth strategy for production software:
  // 1. withCredentials: true sends the httpOnly cookie
  // 2. Authorization header sends the Bearer token as a fail-safe against cross-origin cookie blockage
  try {
    const token = store.getState()?.auth?.token || localStorage.getItem("codex_access_token");
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  } catch {
    // Graceful fallback if storage is inaccessible
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();
    if (["post", "put", "patch", "delete"].includes(method)) {
      const successMessage = response.data?.message;
      if (successMessage && successMessage !== "Success") {
        store.dispatch(setSuccess(successMessage));
      }
    }
    return response.data;
  },
  (error) => {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred.";

    // Global error handler for all backend errors
    store.dispatch(setError(errorMessage));

    if (error.response?.status === 401) {
      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        store.dispatch(setLogout());
      }
    }

    // Enrich error so both err.response.data.message and err.message work across all frontend pages
    const enrichedError =
      error.response?.data && typeof error.response.data === "object"
        ? Object.assign(error, error.response.data)
        : error;

    return Promise.reject(enrichedError);
  }
);

export default axiosInstance;
