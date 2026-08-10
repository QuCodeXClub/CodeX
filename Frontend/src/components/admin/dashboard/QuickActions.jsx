import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users2, FileText, Scan } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-card/85 backdrop-blur-xl rounded-2xl p-6 border border-border/80 shadow-lg">
      <h3 className="font-display font-bold text-text uppercase tracking-wide mb-4 text-sm">
        QUICK <span className="text-accent">ACTIONS</span>
      </h3>
      <div className="space-y-2.5">
        <Link
          to="/admin/qr-generator"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Scan className="w-4 h-4 text-accent" /> QR Generator
          </div>
        </Link>

        <Link
          to="/admin/events"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Calendar className="w-4 h-4 text-accent" /> Event Management
          </div>
        </Link>
        <Link
          to="/admin/team"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <Users2 className="w-4 h-4 text-accent" /> Team Management
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="flex items-center justify-between p-3 rounded-xl border border-border/60 hover:border-accent/40 hover:bg-accent/10 transition-all group"
        >
          <div className="flex items-center gap-3 text-xs font-mono font-medium text-text group-hover:text-accent">
            <FileText className="w-4 h-4 text-accent" /> Certificate Portal
          </div>
        </Link>
      </div>
    </div>
  );
}