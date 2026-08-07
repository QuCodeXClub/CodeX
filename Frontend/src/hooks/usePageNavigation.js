import { useMemo } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to manage page-level (route-based) navigation.
 * Excludes 'Home' (brand logo serves as return home link).
 */
export const usePageNavigation = () => {
  const location = useLocation();

  const pageNavItems = useMemo(
    () => [
      { label: "EVENTS", path: "/events" },
      { label: "TEAM", path: "/team" },
    ],
    []
  );

  return {
    pageNavItems,
    currentPath: location.pathname,
  };
};

export default usePageNavigation;
