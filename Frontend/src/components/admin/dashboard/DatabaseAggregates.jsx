import React from "react";
import { Link } from "react-router-dom";

export default function DatabaseAggregates({ metrics }) {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-border/80 shadow-lg flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-text uppercase tracking-wide text-sm">
          DATABASE <span className="text-accent">METRICS</span>
        </h3>
        <Link
          to="/admin/events"
          className="text-xs font-mono font-semibold text-accent hover:underline uppercase tracking-wider"
        >
          Manage Records &rarr;
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex justify-between items-center p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted">
            Total Applications Received
          </span>
          <span className="text-lg font-display font-black text-text">
            {metrics.loading ? "-" : metrics.totalApps}
          </span>
        </div>
        <div className="flex justify-between items-center p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted">
            Total Events Hosted
          </span>
          <span className="text-lg font-display font-black text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
        </div>
        <div className="flex justify-between items-center p-3.5 rounded-xl bg-card-hover/80 border border-border/60">
          <span className="text-xs font-sans text-text-muted">
            Active Team Roster
          </span>
          <span className="text-lg font-display font-black text-text">
            {metrics.loading ? "-" : metrics.teamSize}
          </span>
        </div>
      </div>
    </div>
  );
}