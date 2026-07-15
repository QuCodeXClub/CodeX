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
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
