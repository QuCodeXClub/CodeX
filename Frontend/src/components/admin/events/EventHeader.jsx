import React from "react";
import { Calendar, Plus, RefreshCw } from "lucide-react";

export default function EventHeader({ openCreateModal, onRefresh, loading }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
          <Calendar className="w-3.5 h-3.5" />
          <span>EVENTS & WORKSHOPS</span>
        </div>
        <h1 className="text-3xl font-display font-black text-text uppercase tracking-tight">
          EVENT <span className="text-accent">MANAGEMENT</span>
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Create, edit, schedule, and publish community events.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2.5 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin text-accent" : ""}`}
          />
        </button>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 cursor-pointer border-0"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>
    </header>
  );
}