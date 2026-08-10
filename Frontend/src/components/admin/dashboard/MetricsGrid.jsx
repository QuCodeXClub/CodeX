import React from "react";
import { Users, Calendar, Activity, ShieldCheck } from "lucide-react";

export default function MetricsGrid({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Pending Apps
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.pendingApps}
          </span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live sync active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Active Events
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.activeEvents}
          </span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live sync active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-warning/10 rounded-xl border border-warning/20 text-warning group-hover:bg-warning group-hover:text-white transition-all">
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            Live Sessions
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">
            {metrics.loading ? "-" : metrics.liveSessions}
          </span>
          <p className="text-[11px] font-mono text-warning mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            Session active
          </p>
        </div>
      </div>

      <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-5 border border-border/80 shadow-lg hover:border-accent/40 hover:shadow-accent/5 transition-all flex flex-col justify-between group">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent group-hover:bg-accent group-hover:text-white transition-all">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-mono font-semibold uppercase text-text-muted">
            System Node
          </span>
        </div>
        <div>
          <span className="text-3xl font-display font-black text-text">ONLINE</span>
          <p className="text-[11px] font-mono text-accent mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% operational
          </p>
        </div>
      </div>
    </div>
  );
}