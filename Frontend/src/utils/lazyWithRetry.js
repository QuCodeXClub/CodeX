import { lazy } from "react";

const CHUNK_RELOAD_KEY = "codex_chunk_refreshed";
const moduleCache = new Map();

/**
 * Executes a dynamic import with memory caching and error recovery.
 */
const loadModuleWithCache = (componentImport) => {
  if (moduleCache.has(componentImport)) {
    return moduleCache.get(componentImport);
  }

  const promise = (async () => {
    try {
      const module = await componentImport();
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "false");
      return module;
    } catch (error) {
      // Remove failed promise from cache so retry is possible
      moduleCache.delete(componentImport);

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
        return new Promise(() => {});
      }

      throw error;
    }
  })();

  moduleCache.set(componentImport, promise);
  return promise;
};

/**
 * Prefetches a dynamic import module in background/idle time.
 * @param {Function} componentImport Dynamic import function, e.g. () => import('./MyPage')
 */
export const prefetchRoute = (componentImport) => {
  if (typeof componentImport === "function") {
    loadModuleWithCache(componentImport).catch(() => {});
  }
};

/**
 * Robust lazy loader wrapper with automatic retry and page reload for chunk mismatches.
 * @param {Function} componentImport Dynamic import function, e.g. () => import('./MyComponent')
 * @returns {React.LazyExoticComponent}
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const module = await loadModuleWithCache(componentImport);
    return module;
  });

/**
 * Route-level lazy loader for React Router v6.4+ Data Routers.
 * Returns a Promise resolving to an object with a `Component` property.
 */
export const routeLazy = (componentImport) => {
  return async () => {
    const module = await loadModuleWithCache(componentImport);
    return { Component: module.default };
  };
};

export default lazyWithRetry;
