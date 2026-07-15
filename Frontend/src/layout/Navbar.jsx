import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/common/Button";

const Navbar = ({ layout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu automatically when the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="site-header sticky top-0 z-50 bg-bg flex justify-between">
      {/* 1. Brand Lockup */}
      <Link
        to="/"
        className="brand-lockup flex items-center gap-3 z-50 relative shrink-0"
        aria-label="CodeX Club home"
      >
        <img
          src="/codex-logo-icon.svg"
          alt="CodeX Club logo"
          className="h-9 w-9 shrink-0"
        />
        <span
          className="brand-divider hidden sm:block w-px h-6 bg-line"
          aria-hidden="true"
        />
        <img
          src="/university-logo-icon.svg"
          alt="Quantum University logo"
          className="h-7 w-7 shrink-0 hidden sm:block"
        />
        <span className="brand-wordmark hover:text-accent transition-colors">
          CODEX
        </span>
      </Link>

      {/* 2. Desktop Navigation */}
      <nav className="site-nav hidden lg:flex">
        {layout.nav.map((item) => (
          <Link key={item.path} to={item.path}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* 3. Meta, Desktop CTA, and Mobile Toggle Container */}
      {/* FIX: Removed 'w-full' so this stays on the same line as the logo in mobile view */}
      <div className="site-meta flex items-center gap-4 z-50 relative">
        <span className="hidden lg:inline-block">{layout.meta}</span>

        {/* DESKTOP BUTTON: Hidden on mobile */}
        <Button
          onClick={() => navigate("/register")}
          variant="solid"
          className="join-button hidden lg:flex m-0"
        >
          {layout.cta}
        </Button>

        {/* MOBILE HAMBURGER TOGGLE: Visible only on mobile */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span
            className={`block w-6 h-[2px] bg-current transition-all duration-300 origin-center ${isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`}
          ></span>
          <span
            className={`block w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 translate-x-2" : ""}`}
          ></span>
          <span
            className={`block w-6 h-[2px] bg-current transition-all duration-300 origin-center ${isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`}
          ></span>
        </button>
      </div>

      {/* 4. Mobile Menu Dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-bg border-b border-line transition-all duration-300 ease-in-out overflow-hidden shadow-xl ${
          isMobileMenuOpen
            ? "max-h-[400px] py-8 opacity-100"
            : "max-h-0 py-0 opacity-0 border-transparent"
        }`}
      >
        <nav className="flex flex-col items-center gap-6">
          {layout.nav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-accent transition-colors font-mono text-lg uppercase tracking-widest"
            >
              {item.label}
            </Link>
          ))}

          {/* MOBILE BUTTON: Uses your exact theme variant, stretched and centered for mobile */}
          <Button
            onClick={() => navigate("/register")}
            variant="solid"
            className="join-button mt-4 w-[80%] max-w-[300px] flex justify-center items-center mx-auto"
          >
            {layout.cta}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
