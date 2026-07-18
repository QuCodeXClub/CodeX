import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users2, FileText, Settings, Scan } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="font-bold text-text mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link
          to="/admin/qr-generator"
          className="flex items-center justify-between p-3 rounded-xl border border-border-soft hover:border-accent/30 hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-text group-hover:text-accent">
            <Scan className="w-5 h-5 text-accent" /> QR Generator
          </div>
        </Link>

        <Link
          to="/admin/events"
          className="flex items-center justify-between p-3 rounded-xl border border-border-soft hover:border-accent/30 hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-text group-hover:text-accent">
            <Calendar className="w-5 h-5 text-accent" /> Event Management
          </div>
        </Link>
        <Link
          to="/admin/team"
          className="flex items-center justify-between p-3 rounded-xl border border-border-soft hover:border-accent/30 hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-text group-hover:text-accent">
            <Users2 className="w-5 h-5 text-accent" /> Team Management
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="flex items-center justify-between p-3 rounded-xl border border-border-soft hover:border-accent/30 hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-text group-hover:text-accent">
            <FileText className="w-5 h-5 text-accent" /> Certificate
            Management
          </div>
        </Link>
        <Link
          to="/admin/dashboard"
          className="flex items-center justify-between p-3 rounded-xl border border-border-soft hover:border-accent/30 hover:bg-accent/10 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-text group-hover:text-accent">
            <Settings className="w-5 h-5 text-text-text-muted group-hover:text-accent" />{" "}
            System Settings
          </div>
        </Link>
      </div>
    </div>
  );
}
