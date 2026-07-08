import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import contentData from "../data/content.json";

const MainLayout = () => {
  const navigate = useNavigate();
  const [footerClicks, setFooterClicks] = useState(0);
  const { layout } = contentData;

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 5) {
      navigate("/admin/login");
      setFooterClicks(0);
    }
  };

  return (
    <div className="app-shell">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest"
      >
        Skip to main content
      </a>
      <header className="site-header sticky top-0 z-50">
        <div className="brand-lockup flex items-center gap-3">
          <div className="brand-dot"></div>
          <Link
            to="/"
            className="brand-wordmark hover:text-accent transition-colors"
          >
            CODEX
          </Link>
        </div>

        <nav className="site-nav flex">
          {layout.nav.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="site-meta flex items-center justify-between w-full lg:w-auto">
          <span className="hidden lg:inline-block">{layout.meta}</span>
          <Button
            onClick={() => navigate("/register")}
            variant="solid"
            className="join-button m-0 lg:ml-4"
          >
            {layout.cta}
          </Button>
        </div>
      </header>
      <div className="ticker-bar">
        <div className="ticker-track">
          {layout.ticker.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
      <footer className="border-t border-line p-6 font-mono text-xs text-ink/40 text-center uppercase tracking-widest bg-bg">
        <button
          type="button"
          onClick={handleFooterClick}
          className="cursor-default select-none text-inherit"
          aria-label="Footer copyright text"
        >
          {layout.footerText.replace("2026", new Date().getFullYear())}
        </button>
      </footer>
    </div>
  );
};

export default MainLayout;
