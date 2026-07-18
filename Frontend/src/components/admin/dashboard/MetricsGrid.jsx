import React from "react";
import { Users, Calendar, Activity, ShieldCheck } from "lucide-react";

export default function MetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-medium text-text-muted">
            Pending Applications
          </span>
        </div>
        <div>
          <span className="text-3xl font-bold text-text">
            {metrics.loading ? "-" : metrics.pendingApps}
          </span>
          <p className="text-xs font-medium text-accent mt-2">
            Real-time sync
          </p>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Calendar className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm font-medium text-text-muted">
            Active Events
          </span>
        </div>
        <div>
          <span className="text-3xl font-bold text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
          <p className="text-xs font-medium text-accent mt-2">
            Real-time sync
          </p>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Activity className="w-6 h-6 text-warning" />
          </div>
          <span className="text-sm font-medium text-text-muted">
            Live Sessions
          </span>
        </div>
        <div>
          <span className="text-3xl font-bold text-text">
            {metrics.loading ? "-" : metrics.liveSessions}
          </span>
          <p className="text-xs font-medium text-accent mt-2">
            Real-time sync
          </p>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-text/10 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-text" />
          </div>
          <span className="text-sm font-medium text-text-muted">
            System Status
          </span>
        </div>
        <div>
          <span className="text-3xl font-bold text-text">OK</span>
          <p className="text-xs font-medium text-accent mt-2">
            All systems operational
          </p>
        </div>
      </div>
    </div>
  );
}