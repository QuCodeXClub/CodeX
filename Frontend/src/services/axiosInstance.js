import axios from "axios";
import store from "../store/store";
import { setError, setSuccess } from "../context/messageSlice";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

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
    if (error.response?.status === 401) {
      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        localStorage.setItem("trueLogin", "false");
        window.location.href = "/admin/login";
      }
    } else {
      // Global error handler for backend errors
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred.";
      store.dispatch(setError(errorMessage));
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
