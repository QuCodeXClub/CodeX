import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation, useNavigation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import the new component
import contentData from "../data/content.json";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const [footerClicks, setFooterClicks] = useState(0);
  const { layout } = contentData;
  const isPageLoading = navigation.state === "loading";

  // Scroll to top when shifting to any page (e.g. Events, Team, Register), unless there is a hash or target section
  useIsomorphicLayoutEffect(() => {
    if (location.pathname !== "/" && !location.hash && !location.state?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash, location.state]);

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
    <div className="app-shell flex flex-col min-h-screen bg-bg relative font-sans text-text overflow-x-clip">
      {/* Background Grid Pattern (Same as Welcome Page & Admin Portal) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-0"
        style={{
          backgroundImage:
            "linear-gradient(#2ec5d4 1px, transparent 1px), linear-gradient(90deg, #2ec5d4 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Ambient Top & Bottom Glow Blobs */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <Navbar layout={layout} />

      {isPageLoading && (
        <div className="fixed top-0 left-0 w-full h-1 z-[9999] overflow-hidden bg-accent/20">
          <div className="h-full bg-accent w-1/2 rounded-r-full animate-indeterminate-progress"></div>
        </div>
      )}

      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center relative z-10"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div></div>}>
        <main className="w-full mx-auto flex-1 border-x border-border/80 bg-transparent relative z-10">
          <Outlet />
        </main>
      </Suspense>

      <Footer layout={layout} onFooterClick={handleFooterClick} />
    </div>
  );
};

export default MainLayout;