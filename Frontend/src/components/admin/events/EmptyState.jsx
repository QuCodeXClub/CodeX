import React from "react";
import { Calendar, SearchX, Plus } from "lucide-react";

export default function EmptyState({ isFiltered = false, onClearFilters, openCreateModal }) {
  if (isFiltered) {
    return (
      <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-12 text-center shadow-lg my-4 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 border border-accent/20">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-display font-bold text-text mb-1 uppercase tracking-tight">
          No matching events found
        </h3>
        <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto mb-5 font-mono">
          We couldn't find any events matching your current search criteria or status filter.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-card-hover border border-border text-accent hover:border-accent/40 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-2xl p-14 text-center shadow-lg my-4 flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 border border-accent/20">
        <Calendar className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-display font-bold text-text mb-1 uppercase tracking-tight">
        No Events Scheduled
      </h3>
      <p className="text-text-muted text-xs sm:text-sm max-w-md mx-auto mb-5 font-mono">
        There are currently no events created in the system. Click "Create Event" to schedule your first event.
      </p>
      {openCreateModal && (
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-text-inverse rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-accent/90 transition-all shadow-md shadow-accent/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      )}
    </div>
  );
}
