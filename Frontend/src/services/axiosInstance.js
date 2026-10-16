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

    // Attach response rate-limit telemetry if present
    const rlRemaining = response.headers?.["ratelimit-remaining"] || response.headers?.["x-ratelimit-remaining"];
    const rLimit = response.headers?.["ratelimit-limit"] || response.headers?.["x-ratelimit-limit"];
    const rlReset = response.headers?.["ratelimit-reset"] || response.headers?.["x-ratelimit-reset"];

    if (rlRemaining !== undefined && response.data && typeof response.data === "object") {
      response.data._rateLimit = {
        remaining: Number(rlRemaining),
        limit: Number(rLimit),
        reset: Number(rlReset),
      };
    }

    return response.data;
  },
  (error) => {
    const errData = error.response?.data;
    const statusCode = error.response?.status;
    const retryAfterHeader = error.response?.headers?.["retry-after"];
    const rlRemaining = error.response?.headers?.["ratelimit-remaining"] || error.response?.headers?.["x-ratelimit-remaining"];
    const rLimit = error.response?.headers?.["ratelimit-limit"] || error.response?.headers?.["x-ratelimit-limit"];
    const rlReset = error.response?.headers?.["ratelimit-reset"] || error.response?.headers?.["x-ratelimit-reset"];

    const retryAfter =
      errData?.rateLimit?.retryAfter ||
      errData?.retryAfter ||
      (retryAfterHeader ? Number(retryAfterHeader) : undefined) ||
      (rlReset ? Number(rlReset) : undefined);

    const errorMessage =
      errData?.message ||
      error.message ||
      "An unexpected error occurred.";

    // Show clear toast notice with countdown on rate limit
    if (statusCode === 429) {
      const cooldownNote = retryAfter ? ` (Cooldown: ${retryAfter}s)` : "";
      store.dispatch(setError(`${errorMessage}${cooldownNote}`));
    } else {
      store.dispatch(setError(errorMessage));
    }

    if (statusCode === 401) {
      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        store.dispatch(setLogout());
      }
    }

    // Enrich error so both err.response.data.message, err.message, and rate limit telemetry work everywhere
    const enrichedError =
      errData && typeof errData === "object"
        ? Object.assign(error, errData, {
            rateLimit: errData.rateLimit || {
              remaining: rlRemaining !== undefined ? Number(rlRemaining) : 0,
              limit: rLimit !== undefined ? Number(rLimit) : undefined,
              retryAfter,
            },
            attemptsRemaining: errData.attemptsRemaining,
            maxAttempts: errData.maxAttempts || 5,
            isLocked: errData.isLocked || statusCode === 429,
            retryAfter,
          })
        : error;

    return Promise.reject(enrichedError);
  }
);

export default axiosInstance;
