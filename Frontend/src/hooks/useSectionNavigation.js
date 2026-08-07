import { useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Hook to manage section-level (in-page anchor) navigation.
 * Excludes 'Home' and 'About'. Handles smooth scrolling and cross-page hash navigation.
 */
export const useSectionNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // Homepage sections (excluding Home and About per requirements)
  const sectionNavItems = useMemo(
    () => [
      { label: "VISION", path: "/#vision", targetId: "vision" },
      { label: "DOMAINS", path: "/#domains", targetId: "domains" },
      { label: "FAQS", path: "/#faqs", targetId: "faqs" },
      { label: "CONTACT", path: "/#contact", targetId: "contact" },
    ],
    []
  );

  // Smooth scroll helper
  const scrollToSection = useCallback((targetId) => {
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80; // Navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle section click: scroll if on home, otherwise navigate to home with target hash
  const handleSectionClick = useCallback(
    (e, item) => {
      e.preventDefault();
      if (isHomePage) {
        scrollToSection(item.targetId);
        window.history.pushState(null, "", item.path);
      } else {
        navigate(item.path);
      }
    },
    [isHomePage, navigate, scrollToSection]
  );

  // Handle post-mount scrolling when navigating to home with a hash from another page
  useEffect(() => {
    if (isHomePage && location.hash) {
      const targetId = location.hash.replace("#", "");
      const timer = setTimeout(() => {
        scrollToSection(targetId);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isHomePage, location.hash, scrollToSection]);

  return {
    sectionNavItems,
    isHomePage,
    scrollToSection,
    handleSectionClick,
  };
};

export default useSectionNavigation;
