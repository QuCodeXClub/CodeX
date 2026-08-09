import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import the new component
import contentData from "../data/content.json";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [footerClicks, setFooterClicks] = useState(0);
  const { layout } = contentData;

  // Scroll to top when shifting to any page (e.g. Events, Team, Register)
  useIsomorphicLayoutEffect(() => {
    if (location.pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Reset click count after 2 seconds of inactivity
  useEffect(() => {
    if (footerClicks === 0) return;
    const timer = setTimeout(() => {
      setFooterClicks(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, [footerClicks]);

  const handleFooterClick = () => {
    setFooterClicks((prev) => {
      const nextCount = prev + 1;
      if (nextCount >= 5) {
        navigate("/admin/login");
        return 0;
      }
      return nextCount;
    });
  };

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Navbar layout={layout} />

      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div></div>}>
        <main className="w-full mx-auto flex-1 border-x border-border bg-bg-soft">
          <Outlet />
        </main>
      </Suspense>

      <Footer layout={layout} onFooterClick={handleFooterClick} />
    </div>
  );
};

export default MainLayout;