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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const navRef = useRef(null);

  // Decoupled Custom Navigation Hooks
  const { pageNavItems } = usePageNavigation();
  const { sectionNavItems, activeSection, isHomePage, handleSectionClick } = useSectionNavigation();

  // Close mobile menu on location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
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

  // Unified Navigation Item Renderer for both Page Links and Section Links
  // Identical typography, colors, hover effects, active highlighting, and spacing
  const renderNavItem = (item, isSection = false, isMobile = false) => {
    const isActive = isSection
      ? isHomePage && activeSection === item.targetId
      : location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));

    const commonClasses = isMobile
      ? `flex items-center px-4 py-3 rounded-lg font-sans text-xs tracking-[0.15em] uppercase font-semibold transition-colors duration-200 ${
          isActive
            ? "text-accent bg-accent/10 font-bold"
            : "text-text-muted hover:text-accent hover:bg-card-hover"
        }`
      : `relative font-sans text-xs xl:text-sm tracking-[0.12em] uppercase font-semibold transition-colors duration-200 whitespace-nowrap py-2 cursor-pointer ${
          isActive ? "text-accent font-bold" : "text-text-muted hover:text-accent"
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
              className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full bg-accent shadow-[0_0_8px_rgba(46,197,212,0.6)] transition-all duration-300 origin-left ${
                isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
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
            className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full bg-accent shadow-[0_0_8px_rgba(46,197,212,0.6)] transition-all duration-300 origin-left ${
              isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          />
        )}
      </Link>
    );
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full bg-bg/90 backdrop-blur-md border-b border-border/80 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* Brand Logo (Primary link to return home) */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="CodeX Club home"
        >
          <img
            src={ASSETS.IMAGES.CODEX_LOGO_ICON}
            alt="CodeX Club logo"
            className="h-7 md:h-8 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-sans font-bold text-lg md:text-xl tracking-[0.2em] text-text group-hover:text-accent transition-colors">
            CODEX
          </span>
        </Link>

        {/* Unified Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {/* 1. Homepage Section Links */}
          <div className="flex items-center gap-5 xl:gap-7">
            {sectionNavItems.map((item) => renderNavItem(item, true, false))}
          </div>

          {/* 2. Subtle Visual Separator */}
          <div className="h-3.5 w-[1px] bg-border/60 mx-1 xl:mx-2 select-none" />

          {/* 3. Standalone Page Links */}
          <div className="flex items-center gap-5 xl:gap-7">
            {pageNavItems.map((item) => renderNavItem(item, false, false))}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          
          {/* Meta Kicker */}
          {layout?.meta && (
            <span className="hidden xl:inline-block text-accent font-mono text-xs tracking-wider uppercase font-semibold pr-4 border-r border-border/60">
              {layout.meta}
            </span>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer text-text hover:bg-card-hover hover:shadow-sm"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-accent" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-text" />
            )}
          </button>

          {/* CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="flex items-center justify-center gap-1.5 md:gap-2 h-8 md:h-10 px-3.5 md:px-6 rounded-full bg-accent text-bg font-sans text-xs md:text-sm font-bold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-md shadow-accent/20 cursor-pointer border-0"
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
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "top-2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out top-2 ${
                  isMobileMenuOpen ? "opacity-0 translate-x-2" : "opacity-100 translate-x-0"
                }`}
              />
              <span
                className={`absolute block w-5 h-[2px] bg-current transition-all duration-300 ease-in-out ${
                  isMobileMenuOpen ? "top-2 -rotate-45" : "top-4"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-bg/95 backdrop-blur-xl border-b border-border shadow-xl absolute w-full left-0 ${
          isMobileMenuOpen
            ? "max-h-[450px] opacity-100 py-4"
            : "max-h-0 opacity-0 py-0 pointer-events-none"
        }`}
      >
        <div className="px-4 flex flex-col gap-1">
          <nav className="flex flex-col gap-1">
            {/* 1. Homepage Section Links */}
            {sectionNavItems.map((item) => renderNavItem(item, true, true))}
            
            {/* 2. Mobile Subtle Divider */}
            <div className="h-[1px] w-full bg-border/40 my-2" />

            {/* 3. Standalone Page Links */}
            {pageNavItems.map((item) => renderNavItem(item, false, true))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;