import { useEffect, useCallback, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Hook to manage section-level (in-page anchor) navigation.
 * Includes 'Home', 'Vision', 'Programs', 'Domains', 'FAQs', and 'Contact'.
 * Handles smooth scrolling and scrollSpy active section tracking without modifying the URL hash.
 */
export const useSectionNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [activeSection, setActiveSection] = useState("home");
  const isClickScrolling = useRef(false);
  const clickScrollTimer = useRef(null);

  // Homepage sections
  const sectionNavItems = useMemo(
    () => [
      { label: "HOME", targetId: "home" },
      { label: "VISION", targetId: "vision" },
      { label: "PROGRAMS", targetId: "programs" },
      { label: "DOMAINS", targetId: "domains" },
      { label: "PARTNERS", targetId: "partners" },
      { label: "FAQS", targetId: "faqs" },
      { label: "CONTACT", targetId: "contact" },
    ],
    []
  );

  // Smooth scroll helper
  const scrollToSection = useCallback((targetId) => {
    if (targetId === "home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

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

  // Handle section click: scroll if on home, otherwise navigate to home with target state (no hash parameter)
  const handleSectionClick = useCallback(
    (e, item) => {
      if (e) e.preventDefault();
      setActiveSection(item.targetId);
      isClickScrolling.current = true;
      if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);

      if (isHomePage) {
        scrollToSection(item.targetId);
      } else {
        navigate("/", { state: { scrollTo: item.targetId } });
      }

      clickScrollTimer.current = setTimeout(() => {
        isClickScrolling.current = false;
      }, 1000);
    },
    [isHomePage, navigate, scrollToSection]
  );

  // Active section scroll tracking (scrollSpy) on homepage
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      if (isClickScrolling.current) return;

      const scrollMarker = window.scrollY + 160;
      let currentSection = "home";

      for (const item of sectionNavItems) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.offsetTop;
          if (scrollMarker >= top) {
            currentSection = item.targetId;
          }
        }
      }

      setActiveSection((previous) => (previous === currentSection ? previous : currentSection));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHomePage, sectionNavItems]);

  // Handle post-mount scrolling when navigating to home via router state or clean hash cleanup
  useEffect(() => {
    if (!isHomePage) return;

    const targetId = location.state?.scrollTo || (location.hash ? location.hash.replace("#", "") : null);
    if (targetId) {
      setActiveSection(targetId);
      const timer = setTimeout(() => {
        scrollToSection(targetId);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isHomePage, location.state, location.hash, scrollToSection]);

  return {
    sectionNavItems,
    activeSection,
    isHomePage,
    scrollToSection,
    handleSectionClick,
  };
};

export default useSectionNavigation;
