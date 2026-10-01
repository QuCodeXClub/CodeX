import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ScrollText, Activity, Globe } from "lucide-react";
import ActivityLogsModal from "./components/ActivityLogsModal";
import AccessLogsModal from "./components/AccessLogsModal";

export default function Logs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "activity";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["activity", "access"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-sans text-text min-h-full flex flex-col">
      {/* Header */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6 shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
            <ScrollText className="w-3.5 h-3.5" />
            <span>SYSTEM AUDIT & LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            SYSTEM <span className="text-accent">LOGS</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Centralized viewer for Admin Activity and Public Traffic logs.
          </p>
        </div>

        {/* Tab Navigation Chips in Main Header */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 bg-card/90 border border-border/80 p-1.5 rounded-2xl shadow-md w-full md:w-auto">
          <button
            onClick={() => handleTabChange("activity")}
            className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "activity"
                ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 shadow-sm"
                : "text-text-muted hover:text-text hover:bg-card-hover"
            }`}
          >
            <Activity className="w-4 h-4 text-fuchsia-400" />
            <span>Admin Activity</span>
          </button>

          <button
            onClick={() => handleTabChange("access")}
            className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "access"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                : "text-text-muted hover:text-text hover:bg-card-hover"
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Public Actions</span>
          </button>
        </div>
      </header>

      {/* Embedded History Section Viewport */}
      <div className="flex-1 relative min-h-[600px] w-full">
        {activeTab === "activity" && <ActivityLogsModal />}
        {activeTab === "access" && <AccessLogsModal />}
      </div>
    </div>
  );
}
