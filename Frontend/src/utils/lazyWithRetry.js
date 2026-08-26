import { lazy } from "react";

/**
 * Robust lazy loader wrapper with automatic retry and page reload for chunk mismatches.
 * Handles missing JS chunks caused by new deployments or cache mismatches gracefully.
 * 
 * @param {Function} componentImport Dynamic import function, e.g. () => import('./MyComponent')
 * @returns {React.LazyExoticComponent}
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const CHUNK_RELOAD_KEY = "codex_chunk_refreshed";

    try {
      const component = await componentImport();
      // Reset refresh flag upon successful dynamic module load
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "false");
      return component;
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || "";
      const isChunkError =
        errorMessage.includes("Failed to fetch dynamically imported module") ||
        errorMessage.includes("Importing a module script failed") ||
        errorMessage.includes("text/html") ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("CSS chunk");

      const hasRefreshed = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "true";

      if (isChunkError && !hasRefreshed) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
        window.location.reload();
        // Return a non-resolving promise while page reloads
        return new Promise(() => { });
      }

      // If already reloaded or non-chunk error, propagate error to ErrorBoundary
      throw error;
    }
  });

/**
 * Route-level lazy loader for React Router v6.4+ Data Routers.
 * Returns a Promise resolving to an object with a `Component` property.
 */
export const routeLazy = (componentImport) => {
  return async () => {
    const CHUNK_RELOAD_KEY = "codex_chunk_refreshed";

    try {
      const module = await componentImport();
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "false");
      return { Component: module.default };
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || "";
      const isChunkError =
        errorMessage.includes("Failed to fetch dynamically imported module") ||
        errorMessage.includes("Importing a module script failed") ||
        errorMessage.includes("text/html") ||
        errorMessage.includes("Loading chunk") ||
        errorMessage.includes("CSS chunk");

      const hasRefreshed = sessionStorage.getItem(CHUNK_RELOAD_KEY) === "true";

      if (isChunkError && !hasRefreshed) {
        sessionStorage.setItem(CHUNK_RELOAD_KEY, "true");
        window.location.reload();
        return new Promise(() => { });
      }

      throw error;
    }
  };
};

export default lazyWithRetry;
