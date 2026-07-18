import React from "react";
import { Link } from "react-router-dom";

export default function DatabaseAggregates({ metrics }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text">Database Aggregates</h3>
        <Link
          to="/admin/events"
          className="text-xs font-medium text-accent hover:underline"
        >
          Manage Records
        </Link>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-6">
        <div className="flex justify-between items-center p-4 rounded-xl bg-card-hover border border-border-soft">
          <span className="text-sm font-medium text-text-muted">
            Total Applications Received
          </span>
          <span className="text-xl font-bold text-text">
            {metrics.loading ? "-" : metrics.totalApps}
          </span>
        </div>
        <div className="flex justify-between items-center p-4 rounded-xl bg-card-hover border border-border-soft">
          <span className="text-sm font-medium text-text-muted">
            Total Events Hosted
          </span>
          <span className="text-xl font-bold text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
        </div>
        <div className="flex justify-between items-center p-4 rounded-xl bg-card-hover border border-border-soft">
          <span className="text-sm font-medium text-text-muted">
            Active Team Roster
          </span>
          <span className="text-xl font-bold text-text">
            {metrics.loading ? "-" : metrics.teamSize}
          </span>
        </div>
      </div>
    </div>
  );
}