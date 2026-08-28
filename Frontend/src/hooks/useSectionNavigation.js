import { useEffect, useLayoutEffect, useCallback, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Immediately set browser scrollRestoration to manual at top-level
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const VALID_SECTIONS = ["home", "vision", "programs", "domains", "partners", "faqs", "contact"];

const getSavedSection = () => {
  if (typeof window === "undefined") return "home";
  try {
    const saved = localStorage.getItem("codex_last_section");
    if (saved) {
      const normalized = saved.trim().toLowerCase();
      if (VALID_SECTIONS.includes(normalized)) {
        return normalized;
      }
    }
  } catch {
    // Ignore storage error
  }
  return "home";
};

/**
 * Hook to manage section-level (in-page anchor) navigation.
 * Includes 'Home', 'Vision', 'Programs', 'Domains', 'FAQs', and 'Contact'.
 * Handles smooth scrolling and scrollSpy active section tracking without modifying the URL hash.
 */
export const useSectionNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  // Homepage sections
  const sectionNavItems = useMemo(
    () => [
      { label: "HOME", targetId: "home" },
      { label: "VISION", targetId: "vision" },
      { label: "PROGRAMS", targetId: "programs" },
      { label: "DOMAINS", targetId: "domains" },
      { label: "FAQS", targetId: "faqs" },
      { label: "CONTACT", targetId: "contact" },
    ],
    []
  );

  // Synchronous initial section calculation
  const resolveTargetSection = useCallback(() => {
    const stateTarget = location.state?.scrollTo;
    const hashTarget = location.hash ? location.hash.replace("#", "") : null;
    if (stateTarget && VALID_SECTIONS.includes(stateTarget.toLowerCase())) {
      return stateTarget.toLowerCase();
    }
    if (hashTarget && VALID_SECTIONS.includes(hashTarget.toLowerCase())) {
      return hashTarget.toLowerCase();
    }
    return getSavedSection();
  }, [location.state, location.hash]);

  // Active section state initialized synchronously on first render
  const [activeSection, setActiveSection] = useState(resolveTargetSection);
  const isClickScrolling = useRef(false);
  const clickScrollTimer = useRef(null);
  const scrollEndHandlerRef = useRef(null);
  const isRestoringScroll = useRef(true);
  const restorationTimer = useRef(null);

  // Helper to calculate target section top offset position
  const getSectionOffsetPosition = useCallback((targetId) => {
    if (targetId === "home") return 0;
    const el = document.getElementById(targetId);
    if (!el) return null;
    const navbarOffset = window.innerWidth < 768 ? 64 : 80;
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, Math.floor(elementPosition - navbarOffset));
  }, []);

  // Smooth or instant scroll helper
  const scrollToSection = useCallback(
    (targetId, behavior = "smooth") => {
      const topPos = getSectionOffsetPosition(targetId);
      if (topPos !== null) {
        window.scrollTo({
          top: topPos,
          behavior,
        });
      }
    },
    [getSectionOffsetPosition]
  );

  // Handle section click from Navbar
  const handleSectionClick = useCallback(
    (e, item) => {
      if (e) e.preventDefault();
      setActiveSection(item.targetId);

      try {
        localStorage.setItem("codex_last_section", item.targetId);
      } catch {
        // Ignore storage error
      }

      if (scrollEndHandlerRef.current) {
        window.removeEventListener("scroll", scrollEndHandlerRef.current);
      }

      isClickScrolling.current = true;
      if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);

      if (isHomePage) {
        scrollToSection(item.targetId, "smooth");
      } else {
        navigate("/", { state: { scrollTo: item.targetId } });
      }

      // Dynamic debounce: keep scrollSpy locked until smooth scrolling completely settles
      const handleScrollEnd = () => {
        if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);
        clickScrollTimer.current = setTimeout(() => {
          isClickScrolling.current = false;
          window.removeEventListener("scroll", handleScrollEnd);
          scrollEndHandlerRef.current = null;
        }, 150);
      };

      scrollEndHandlerRef.current = handleScrollEnd;
      window.addEventListener("scroll", handleScrollEnd, { passive: true });
    },
    [isHomePage, navigate, scrollToSection]
  );

  // Clean up timers and scroll listeners on unmount
  useEffect(() => {
    return () => {
      if (scrollEndHandlerRef.current) {
        window.removeEventListener("scroll", scrollEndHandlerRef.current);
      }
      if (clickScrollTimer.current) clearTimeout(clickScrollTimer.current);
      if (restorationTimer.current) clearTimeout(restorationTimer.current);
    };
  }, []);

  // Save active section to localStorage on scroll (only after restoration completes)
  useEffect(() => {
    if (isHomePage && activeSection && !isRestoringScroll.current) {
      try {
        localStorage.setItem("codex_last_section", activeSection);
      } catch {
        // Ignore storage error
      }
    }
  }, [isHomePage, activeSection]);

  // ScrollSpy section tracking on homepage
  useEffect(() => {
    if (!isHomePage) return;

    let rAFId = null;

    const updateScrollSpy = () => {
      rAFId = null;
      // STRICT LOCK: Never allow scrollSpy to update activeSection while restoration or click scrolling is active
      if (isClickScrolling.current || isRestoringScroll.current) return;

      const scrollMarker = window.scrollY + 160;
      let currentSection = "home";

      for (const item of sectionNavItems) {
        const el = document.getElementById(item.targetId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollMarker >= top) {
            currentSection = item.targetId;
          }
        }
      }

      setActiveSection((previous) => (previous === currentSection ? previous : currentSection));
    };

    const handleScroll = () => {
      if (rAFId === null) {
        rAFId = requestAnimationFrame(updateScrollSpy);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isHomePage, sectionNavItems]);

  // Instant pre-paint initial scroll restoration on mount/load
  useIsomorphicLayoutEffect(() => {
    if (!isHomePage) return;

    const targetId = resolveTargetSection();
    setActiveSection(targetId);

    if (targetId === "home") {
      window.scrollTo(0, 0);
      isRestoringScroll.current = false;
      return;
    }

    // Lock scrollSpy strictly during initial scroll restoration
    isRestoringScroll.current = true;
    if (restorationTimer.current) clearTimeout(restorationTimer.current);

    const attemptScroll = () => {
      const topPos = getSectionOffsetPosition(targetId);
      if (topPos !== null) {
        window.scrollTo(0, topPos);
        return true;
      }
      return false;
    };

    const scrolledImmediately = attemptScroll();

    let pollTimerId = null;
    let attempts = 0;
    const maxAttempts = 60; // Poll up to 3 seconds for lazy component loading

    const startRestorationScrollDebounce = () => {
      let scrollTimer = null;
      const handleRestorationScroll = () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          // Re-verify and perform final scroll adjustment
          attemptScroll();
          isRestoringScroll.current = false;
          window.removeEventListener("scroll", handleRestorationScroll);
        }, 250);
      };
      window.addEventListener("scroll", handleRestorationScroll, { passive: true });
      // Call once to trigger initial layout timeout in case no scroll events fire
      handleRestorationScroll();
    };

    const pollForTargetElement = () => {
      attempts++;
      const foundAndScrolled = attemptScroll();
      if (foundAndScrolled) {
        // Target element mounted! Begin scroll debounce checking
        startRestorationScrollDebounce();
      } else if (attempts < maxAttempts) {
        pollTimerId = setTimeout(pollForTargetElement, 50);
      } else {
        // Fallback safety unlock
        isRestoringScroll.current = false;
      }
    };

    pollForTargetElement();

    // Ensure clean URL without hash in the address bar
    if (location.hash && typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }

    return () => {
      if (pollTimerId) clearTimeout(pollTimerId);
      if (restorationTimer.current) clearTimeout(restorationTimer.current);
    };
  }, [isHomePage, resolveTargetSection, getSectionOffsetPosition, location.hash]);

  return {
    sectionNavItems,
    activeSection,
    isHomePage,
    scrollToSection,
    handleSectionClick,
  };
};

export default useSectionNavigation;
