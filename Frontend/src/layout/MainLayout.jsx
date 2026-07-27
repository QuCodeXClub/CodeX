import React, { useState, Suspense } from "react";
import { Outlet, useNavigate, ScrollRestoration, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer"; // Import the new component
import contentData from "../data/content.json";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="app-shell flex flex-col min-h-screen">
      <ScrollRestoration />
      <Navbar layout={layout} />

      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full mx-auto flex-1 border-x border-border bg-bg-soft"
        >
          <Suspense fallback={<div className="flex h-[60vh] items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full"></div></div>}>
            <Outlet />
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <Footer layout={layout} onFooterClick={handleFooterClick} />
    </div>
  );
};

export default MainLayout;