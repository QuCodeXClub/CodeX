import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { usePageNavigation } from "../hooks/usePageNavigation";
import { useSectionNavigation } from "../hooks/useSectionNavigation";
import { ASSETS } from "../config/assets";

const Navbar = ({ layout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHomeExpanded, setIsHomeExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navRef = useRef(null);

  // Decoupled Custom Navigation Hooks
  const { pageNavItems } = usePageNavigation();
  const { sectionNavItems, activeSection, isHomePage, handleSectionClick } = useSectionNavigation();

  // Close mobile menu on location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsHomeExpanded(false);
    setIsAboutExpanded(false);
  }, [location.pathname, location.hash]);

  // Close mobile menu when clicking outside header
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleAboutSectionClick = (e, targetId) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    setIsAboutExpanded(false);

    if (location.pathname === "/about") {
      if (targetId === "hero" || targetId === "about") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(targetId);
        if (el) {
          const navbarOffset = window.innerWidth < 768 ? 64 : 80;
          const elementPosition = el.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = Math.max(0, Math.floor(elementPosition - navbarOffset));
          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
      }
    } else {
      navigate(`/about#${targetId}`, { state: { scrollTo: targetId } });
    }
  };

  const handleMainAboutClick = (e) => {
    setIsMobileMenuOpen(false);
    setIsAboutExpanded(false);
    if (location.pathname === "/about") {
      if (e) e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Unified Navigation Item Renderer for both Page Links and Section Links
  // Identical typography, colors, hover effects, active highlighting, and spacing
  const renderNavItem = (item, isSection = false, isMobile = false) => {
    let isActive = false;
    if (isSection) {
      if (isHomePage) {
        const activeIdx = sectionNavItems.findIndex((nav) => nav.targetId === activeSection);
        const currentIdx = sectionNavItems.findIndex((nav) => nav.targetId === item.targetId);
        isActive = activeIdx !== -1 ? currentIdx <= activeIdx : currentIdx === 0;
      }
    } else {
      isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
    }

    const commonClasses = isMobile
      ? `flex items-center px-4 py-3 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-200 ${isActive
        ? "text-accent bg-accent/10 font-bold border-l-2 border-accent"
        : "text-text-muted hover:text-accent hover:bg-card-hover"
      }`
      : `relative font-sans text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 whitespace-nowrap py-2 cursor-pointer ${isActive ? "text-accent font-bold" : "text-text-muted hover:text-accent"
      }`;

    if (isSection) {
      return (
        <button
          key={item.targetId}
          type="button"
          onClick={(e) => {
            handleSectionClick(e, item);
            setIsMobileMenuOpen(false);
          }}
          className={commonClasses}
        >
          {item.label}
          {!isMobile && (
            <span
              className={`absolute left-0 bottom-0 w-full h-[2.5px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-300 origin-left ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
            />
          )}
        </button>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setIsMobileMenuOpen(false)}
        className={commonClasses}
      >
        {item.label}
        {!isMobile && (
          <span
            className={`absolute left-0 bottom-0 w-full h-[2.5px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-300 origin-left ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
          />
        )}
      </Link>
    );
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-bg/85 backdrop-blur-xl border-b border-border/80 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <Link
          to="/"
          onClick={(e) => {
            handleSectionClick(e, { label: "HOME", targetId: "home" });
          }}
          className="flex items-center gap-3 shrink-0 group"
          aria-label="CodeX Club home"
        >
          <div className="relative p-1.5 rounded-xl bg-accent/10 border border-accent/20 group-hover:border-accent/50 group-hover:shadow-[0_0_15px_var(--color-accent-glow)] transition-all duration-300">
            <img
              src={ASSETS.IMAGES.CODEX_LOGO_ICON}
              alt="CodeX Club logo"
              className="h-6 md:h-7 object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="font-display font-extrabold text-lg md:text-2xl tracking-[0.15em] text-text group-hover:text-accent transition-colors">
            CODE<span className="text-accent">X</span>
          </span>
        </Link>

        {/* Unified Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          <div className="flex items-center gap-5 xl:gap-7">
            {/* Home Dropdown */}
            <div className="relative group py-2">
              <Link
                to="/"
                className={`relative font-sans text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1 ${location.pathname === '/' ? "text-accent font-bold" : "text-text-muted hover:text-accent"}`}
              >
                HOME
                <span className="text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-300">▼</span>
                <span
                  className={`absolute left-0 -bottom-2 w-full h-[2.5px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-300 origin-left ${location.pathname === '/' ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
                />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                <div className="flex flex-col min-w-[160px] bg-bg/95 backdrop-blur-xl border border-border/80 rounded-xl shadow-xl overflow-hidden py-1">
                  {sectionNavItems.filter(item => item.targetId !== 'home').map((item) => (
                    <button
                      key={item.targetId}
                      type="button"
                      onClick={(e) => {
                        handleSectionClick(e, item);
                      }}
                      className="text-left px-4 py-2.5 font-sans text-xs tracking-wider uppercase font-semibold text-text-muted hover:text-accent hover:bg-card-hover transition-colors whitespace-nowrap"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* About Dropdown */}
            <div className="relative group py-2">
              <Link
                to="/about"
                onClick={handleMainAboutClick}
                className={`relative font-sans text-xs xl:text-sm tracking-wider uppercase font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer flex items-center gap-1 ${location.pathname === '/about' ? "text-accent font-bold" : "text-text-muted hover:text-accent"}`}
              >
                ABOUT
                <span className="text-[10px] opacity-70 group-hover:rotate-180 transition-transform duration-300">▼</span>
                <span
                  className={`absolute left-0 -bottom-2 w-full h-[2.5px] rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-300 origin-left ${location.pathname === '/about' ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`}
                />
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 ease-out z-50">
                <div className="flex flex-col min-w-[170px] bg-bg/95 backdrop-blur-xl border border-border/80 rounded-xl shadow-xl overflow-hidden py-1">
                  {[
                    { label: "Flagship Events", targetId: "events" },
                    { label: "Community & Culture", targetId: "community" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={(e) => handleAboutSectionClick(e, item.targetId)}
                      className="text-left px-4 py-2.5 font-sans text-xs tracking-wider uppercase font-semibold text-text-muted hover:text-accent hover:bg-card-hover transition-colors whitespace-nowrap cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Standalone Page Links */}
            {pageNavItems.map((item) => renderNavItem(item, false, false))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">

         

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer text-text bg-card-hover/80 border border-border hover:border-accent/40 hover:text-accent hover:shadow-md"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-accent animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-text" />
            )}
          </button>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-2 h-9 md:h-10 px-4 md:px-6 rounded-xl bg-accent text-text-inverse font-sans text-xs md:text-sm font-bold tracking-wider uppercase hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 cursor-pointer border-0"
          >
            <span>{layout?.cta || "JOIN US"}</span>
            <ArrowRight className="hidden md:block w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="lg:hidden flex justify-center items-center w-9 h-9 ml-1 rounded-md text-text transition-colors focus:outline-none hover:bg-card-hover cursor-pointer"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="relative w-5 h-4 text-current">
              <span
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "top-2 rotate-45" : "top-0"
                  }`}
              />
              <span
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out top-2 ${isMobileMenuOpen ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
                  }`}
              />
              <span
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "top-2 -rotate-45" : "top-4"
                  }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-bg/95 backdrop-blur-xl border-b border-border shadow-xl absolute w-full left-0 ${isMobileMenuOpen
          ? "max-h-[70vh] overflow-y-auto opacity-100 py-4"
          : "max-h-0 opacity-0 py-0 pointer-events-none"
          }`}
      >
        <div className="px-4 flex flex-col gap-1">
          <nav className="flex flex-col gap-1">
            {/* Home Expandable */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex-1 flex items-center px-4 py-3 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-200 ${location.pathname === '/' ? "text-accent bg-accent/10 font-bold border-l-2 border-accent" : "text-text-muted hover:text-accent hover:bg-card-hover"}`}
                >
                  HOME
                </Link>
                <button 
                  onClick={() => setIsHomeExpanded(!isHomeExpanded)}
                  className="p-3 text-text-muted hover:text-accent focus:outline-none"
                  aria-label="Toggle Home Menu"
                >
                  <span className={`inline-block transition-transform duration-300 ${isHomeExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHomeExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col pl-6 pr-2 py-2 gap-1 border-l border-border/40 ml-4 mb-2">
                  {sectionNavItems.filter(item => item.targetId !== 'home').map((item) => (
                    <button
                      key={item.targetId}
                      type="button"
                      onClick={(e) => {
                        handleSectionClick(e, item);
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold text-text-muted hover:text-accent hover:bg-card-hover transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* About Expandable */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link
                  to="/about"
                  onClick={handleMainAboutClick}
                  className={`flex-1 flex items-center px-4 py-3 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold transition-all duration-200 ${location.pathname === '/about' ? "text-accent bg-accent/10 font-bold border-l-2 border-accent" : "text-text-muted hover:text-accent hover:bg-card-hover"}`}
                >
                  ABOUT
                </Link>
                <button 
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="p-3 text-text-muted hover:text-accent focus:outline-none cursor-pointer"
                  aria-label="Toggle About Menu"
                >
                  <span className={`inline-block transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`}>▼</span>
                </button>
              </div>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAboutExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="flex flex-col pl-6 pr-2 py-2 gap-1 border-l border-border/40 ml-4 mb-2">
                  {[
                    { label: "Flagship Events", targetId: "events" },
                    { label: "Community & Culture", targetId: "community" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={(e) => handleAboutSectionClick(e, item.targetId)}
                      className="text-left px-4 py-2 rounded-lg font-mono text-xs tracking-wider uppercase font-semibold text-text-muted hover:text-accent hover:bg-card-hover transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Standalone Page Links */}
            {pageNavItems.map((item) => renderNavItem(item, false, true))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;