import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sun, Moon, ArrowRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

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
    <header className="sticky top-0 z-50 w-full px-3 py-2.5 md:px-6 md:py-3 transition-colors duration-300">
      {/* Outer Floating Capsule */}
      <div
        className={`max-w-[1360px] mx-auto flex items-center justify-between gap-3 p-1.5 md:p-2 rounded-full backdrop-blur-xl border transition-all duration-300 ${
          isDark
            ? "bg-[#101822]/95 text-white border-[#2EC5D4]/40 shadow-[0_0_25px_rgba(46,197,212,0.3)]"
            : "bg-white/95 text-[#111111] border-border/40 shadow-[0_4px_25px_rgba(0,0,0,0.08)]"
        }`}
      >
        {/* 1. Brand Lockup Pill */}
        <Link
          to="/"
          className={`flex items-center gap-2.5 px-4 py-1.5 rounded-full border shadow-sm hover:shadow transition-all group shrink-0 ${
            isDark
              ? "bg-[#1a2432] border-white/10 text-white"
              : "bg-[#F2F5F8] border-black/5 text-[#111111]"
          }`}
          aria-label="CodeX Club home"
        >
          <img
            src="/university-logo-icon.svg"
            alt="Quantum University logo"
            className="h-5 w-5 md:h-6 md:w-6 object-contain"
          />
          <img
            src="/codex-logo-icon.svg"
            alt="CodeX Club logo"
            className="h-5 w-5 md:h-6 md:w-6 object-contain"
          />
          <span className="font-sans font-bold text-sm md:text-base tracking-[0.22em] group-hover:text-accent transition-colors">
            CODEX
          </span>
        </Link>

        {/* 2. Desktop Navigation Pill */}
        <nav
          className={`hidden lg:flex items-center justify-center gap-1 xl:gap-2 px-6 py-1.5 rounded-full border shadow-sm ${
            isDark
              ? "bg-[#1a2432] border-white/10 text-white"
              : "bg-[#F2F5F8] border-black/5 text-[#111111]"
          }`}
        >
          {layout.nav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3.5 py-1 font-sans text-xs md:text-[0.82rem] tracking-[0.1em] uppercase transition-colors whitespace-nowrap ${
                  isActive
                    ? isDark
                      ? "text-white font-bold"
                      : "text-[#111111] font-bold"
                    : isDark
                    ? "text-white/70 hover:text-white font-medium"
                    : "text-[#111111]/70 hover:text-[#111111] font-medium"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#2EC5D4] shadow-[0_0_6px_#2EC5D4]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Meta Kicker, Theme Toggle, Desktop CTA, and Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          
          {/* Meta Kicker - Hidden below XL screens */}
          <span className="hidden xl:inline-block text-[#2EC5D4] font-mono text-[0.72rem] tracking-wider uppercase font-semibold px-2">
            {layout.meta}
          </span>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-full border shadow-sm flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer ${
              isDark
                ? "bg-[#1a2432] border-white/10 text-white hover:bg-white/10"
                : "bg-[#F2F5F8] border-black/5 text-[#111111] hover:bg-black/5"
            }`}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#111111]" />
            )}
          </button>

          {/* Desktop CTA Button */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="hidden lg:flex items-center justify-center gap-2 h-8 md:h-9 px-5 rounded-full bg-[#2EC5D4] text-white font-sans text-xs md:text-[0.82rem] font-bold tracking-wider uppercase hover:bg-[#25a8b5] active:scale-95 transition-all shadow-md cursor-pointer border-0"
          >
            <span>{layout.cta}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`lg:hidden flex justify-center items-center w-8 h-8 md:w-9 md:h-9 rounded-full border shadow-sm transition-colors focus:outline-none cursor-pointer ${
              isDark
                ? "bg-[#1a2432] border-white/10 text-white"
                : "bg-[#F2F5F8] border-black/5 text-[#111111]"
            }`}
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
        className={`lg:hidden max-w-[1360px] mx-auto transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 mt-2"
            : "max-h-0 opacity-0 mt-0 pointer-events-none"
        }`}
      >
        <div
          className={`backdrop-blur-xl border shadow-xl rounded-2xl p-4 flex flex-col gap-2 ${
            isDark
              ? "bg-[#101822]/95 border-[#2EC5D4]/30 text-white"
              : "bg-white/95 border-border/40 text-[#111111]"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {layout.nav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-xs tracking-[0.15em] uppercase transition-all ${
                    isActive
                      ? "bg-[#2EC5D4]/10 text-accent font-bold"
                      : isDark
                      ? "text-white/70 hover:text-white hover:bg-white/5"
                      : "text-[#111111]/70 hover:text-[#111111] hover:bg-black/5"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#2EC5D4] shadow-[0_0_6px_#2EC5D4]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-3">
            <span className="text-[#2EC5D4] font-mono text-[0.7rem] tracking-wider uppercase font-semibold">
              {layout.meta}
            </span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="flex items-center justify-center gap-2 h-9 px-5 rounded-full bg-[#2EC5D4] text-white font-sans text-xs font-bold tracking-wider uppercase hover:bg-[#25a8b5] transition-all shadow-md border-0 cursor-pointer"
            >
              <span>{layout.cta}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;