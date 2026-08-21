import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { History, Award, Ticket, Megaphone, ShieldCheck } from "lucide-react";
import IssuedCertificatesModal from "./components/IssuedCertificatesModal";
import IssuedBoardingPassesModal from "./components/IssuedBoardingPassesModal";
import AnnouncementsHistoryModal from "./components/AnnouncementsHistoryModal";

export default function AuditHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "certificates";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["certificates", "boarding-passes", "announcements"].includes(tabFromUrl)) {
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
            <History className="w-3.5 h-3.5" />
            <span>SYSTEM AUDIT LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
            AUDIT & HISTORY <span className="text-accent">CENTER</span>
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Centralized archive of issued certificates, event boarding passes, and club announcements.
          </p>
        </div>

        {/* Tab Navigation Chips in Main Header */}
        <div className="flex flex-wrap items-center gap-2 bg-card/90 border border-border/80 p-1.5 rounded-2xl shadow-md">
          <button
            onClick={() => handleTabChange("certificates")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "certificates"
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-sm"
                : "text-text-muted hover:text-text hover:bg-card-hover"
            }`}
          >
            <Award className="w-4 h-4 text-teal-400" />
            <span>Certificates</span>
          </button>

          <button
            onClick={() => handleTabChange("boarding-passes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "boarding-passes"
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm"
                : "text-text-muted hover:text-text hover:bg-card-hover"
            }`}
          >
            <Ticket className="w-4 h-4 text-cyan-400" />
            <span>Boarding Passes</span>
          </button>

          <button
            onClick={() => handleTabChange("announcements")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "announcements"
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-sm"
                : "text-text-muted hover:text-text hover:bg-card-hover"
            }`}
          >
            <Megaphone className="w-4 h-4 text-indigo-400" />
            <span>Announcements</span>
          </button>
        </div>
      </header>

      {/* Embedded History Section Viewport */}
      <div className="flex-1 relative min-h-[600px] w-full">
        {activeTab === "certificates" && (
          <IssuedCertificatesModal onClose={() => handleTabChange("certificates")} />
        )}
        {activeTab === "boarding-passes" && (
          <IssuedBoardingPassesModal onClose={() => handleTabChange("boarding-passes")} />
        )}
        {activeTab === "announcements" && (
          <AnnouncementsHistoryModal onClose={() => handleTabChange("announcements")} />
        )}
      </div>
    </div>
  );
}
