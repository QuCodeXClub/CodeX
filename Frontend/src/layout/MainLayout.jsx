import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Adjust path if you placed it elsewhere
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
      {/* 1. Inject the new Navbar here */}
      <Navbar layout={layout} />

      <div className="ticker-bar">
        <div className="ticker-track">
          {layout.ticker.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="border-t border-line p-6 font-mono text-xs text-ink/40 text-center uppercase tracking-widest bg-bg">
        <span
          onClick={handleFooterClick}
          className="cursor-default select-none"
        >
          {layout.footerText.replace("2026", new Date().getFullYear())}
        </span>
      </footer>
    </div>
  );
};

export default MainLayout;
