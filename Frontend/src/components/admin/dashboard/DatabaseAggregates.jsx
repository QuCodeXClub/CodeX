import React from "react";
import { Link } from "react-router-dom";

export default function DatabaseAggregates({ metrics }) {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-border/80 shadow-lg flex flex-col justify-between min-h-[300px] h-[320px]">
      <div className="flex items-center justify-between mb-4 sm:mb-6 shrink-0 gap-2">
        <h3 className="font-display font-bold text-text uppercase tracking-wide text-xs sm:text-sm truncate">
          DATABASE <span className="text-accent">METRICS</span>
        </h3>
        <Link
          to="/admin/events"
          className="text-[11px] sm:text-xs font-mono font-semibold text-accent hover:underline uppercase tracking-wider shrink-0"
        >
          Manage &rarr;
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-around gap-2.5 sm:gap-3.5">
        <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted truncate pr-2">
            Total Applications Received
          </span>
          <span className="text-base sm:text-lg font-display font-black text-text shrink-0">
            {metrics.loading ? "-" : metrics.totalApps}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted truncate pr-2">
            Total Events Hosted
          </span>
          <span className="text-base sm:text-lg font-display font-black text-text shrink-0">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 sm:p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted truncate pr-2">
            Active Team Roster
          </span>
          <span className="text-base sm:text-lg font-display font-black text-text shrink-0">
            {metrics.loading ? "-" : metrics.teamSize}
          </span>
        </div>
      </div>
    </div>
  );
}
