import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { ASSETS } from "../config/assets";

const Navbar = ({ layout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg shadow-sm border-b border-border transition-colors duration-300 transform-gpu">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
        
        {/* 1. Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 group"
          aria-label="CodeX Club home"
        >
          <img
            src={ASSETS.IMAGES.CODEX_LOGO_ICON}
            alt="CodeX Club logo"
            className="h-6 md:h-8 object-contain"
          />
          <span className="font-sans font-bold text-lg md:text-xl tracking-[0.22em] text-text group-hover:text-accent transition-colors mt-0.5">
            CODEX
          </span>
        </Link>

        {/* 2. Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {layout.nav.map((item) => {
            const isActive = location.pathname === item.path;
            const isHash = item.path.includes('#');
            
            const className = `relative font-sans text-sm tracking-[0.1em] uppercase transition-colors whitespace-nowrap py-2 ${
              isActive
                ? "text-accent font-bold"
                : "text-text-muted hover:text-text font-medium"
            }`;
            
            const isHomePage = location.pathname === '/';
            
            return isHash && isHomePage ? (
              <ScrollLink
                key={item.path}
                to={item.path.split('#')[1]}
                spy={true}
                smooth="easeInOutQuart"
                duration={800}
                offset={-80}
                activeClass="!text-accent !font-bold"
                className={`${className} cursor-pointer transition-all duration-300`}
              >
                {item.label}
              </ScrollLink>
            ) : isHash ? (
              <a key={item.path} href={item.path} className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.path} to={item.path} className={className}>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_8px_#2EC5D4]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Actions: Meta Kicker, Theme Toggle, Desktop CTA, and Mobile Toggle */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          
          {/* Meta Kicker - Hidden below XL screens */}
          <span className="hidden xl:inline-block text-accent font-mono text-xs tracking-wider uppercase font-semibold pr-4 border-r border-border">
            {layout.meta}
          </span>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer text-text hover:bg-card-hover hover:shadow-sm"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-accent" />
            ) : (
              <Moon className="w-5 h-5 text-text" />
            )}
          </button>

          {/* Desktop CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="hidden lg:flex items-center justify-center gap-2 h-10 px-6 rounded-full bg-accent text-bg font-sans text-sm font-bold tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20 cursor-pointer border-0"
          >
            <span>{layout.cta}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="lg:hidden flex justify-center items-center w-9 h-9 rounded-md text-text transition-colors focus:outline-none hover:bg-card-hover cursor-pointer"
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

      {/* 4. Mobile Menu Dropdown */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden bg-card border-b border-border shadow-2xl absolute w-full ${
          isMobileMenuOpen
            ? "max-h-[400px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            {layout.nav.map((item) => {
              const isActive = location.pathname === item.path;
              const isHash = item.path.includes('#');
              const className = `flex items-center px-4 py-3 rounded-lg font-sans text-sm tracking-[0.15em] uppercase transition-all ${
                isActive
                  ? "bg-accent/10 text-accent font-bold"
                  : "text-text hover:text-text hover:bg-card-hover"
              }`;
              
              const isHomePage = location.pathname === '/';
              
              return isHash && isHomePage ? (
                <ScrollLink
                  key={item.path}
                  to={item.path.split('#')[1]}
                  spy={true}
                  smooth="easeInOutQuart"
                  duration={800}
                  offset={-80}
                  onClick={() => setIsMobileMenuOpen(false)}
                  activeClass="!bg-accent/10 !text-accent !font-bold"
                  className={`${className} cursor-pointer transition-all duration-300`}
                >
                  <span>{item.label}</span>
                </ScrollLink>
              ) : isHash ? (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={className}
                >
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={className}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 mt-2 border-t border-border flex flex-col gap-4">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 h-11 w-full rounded-lg bg-accent text-bg font-sans text-sm font-bold tracking-wider uppercase hover:opacity-90 transition-all shadow-md border-0 cursor-pointer"
            >
              <span>{layout.cta}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;