import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Button from '../components/common/Button';

const MainLayout = () => {
  return (
    <div className="app-shell">
            <header className="site-header sticky top-0 z-50">
        <div className="brand-lockup flex items-center gap-3">
          <div className="brand-dot"></div>
          <Link to="/" className="brand-wordmark hover:text-accent transition-colors">
            CODEX
          </Link>
        </div>

        <nav className="site-nav flex">
          <Link to="/about">ABOUT</Link>
          <Link to="/events">EVENTS</Link>
          <Link to="/team">TEAM</Link>
          <Link to="/resources">RESOURCES</Link>
        </nav>

        <div className="site-meta flex items-center justify-between w-full lg:w-auto">
          <span className="hidden lg:inline-block">EST. 2018 — VOL.07</span>
          <Button href="#join" variant="solid" className="join-button m-0 lg:ml-4">
            JOIN US
          </Button>
        </div>
      </header>
      <div className="ticker-bar">
        <div className="ticker-track">
          <span>HACKATHONS</span>
          <span>OPEN SOURCE</span>
          <span>PIXEL PERFECT</span>
          <span>PROTOCOL DEV</span>
          <span>100+ MEMBERS</span>
          <span>WORKSHOPS</span>
        </div>
      </div>
      <main className="main-content">
        <Outlet />
      </main>
            <footer className="border-t border-line p-6 font-mono text-xs text-ink/40 text-center uppercase tracking-widest bg-bg">
        © {new Date().getFullYear()} Codex Collective. All systems nominal.
      </footer>
    </div>
  );
};

export default MainLayout;