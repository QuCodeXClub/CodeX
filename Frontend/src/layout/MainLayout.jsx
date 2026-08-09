import React, { useState, useEffect, useLayoutEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import the new component
import contentData from "../data/content.json";
import { AnimatePresence, motion } from "framer-motion";

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

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);
    if (newCount >= 5) {
      navigate("/admin/login");
      setFooterClicks(0);
    }
  };

  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Navbar layout={layout} />


      <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div></div>}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full mx-auto flex-1 border-x border-border bg-bg-soft"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </Suspense>

      <Footer layout={layout} onFooterClick={handleFooterClick} />
    </div>
  );
};

export default MainLayout;