import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users2, FileText, Settings } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Link
          to="/admin/events"
          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
            <Calendar className="w-5 h-5 text-teal-500" /> Event Management
          </div>
        </Link>
        <Link
          to="/admin/team"
          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
            <Users2 className="w-5 h-5 text-teal-500" /> Team Management
          </div>
        </Link>
        <Link
          to="/admin/certificates"
          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
            <FileText className="w-5 h-5 text-teal-500" /> Certificate
            Management
          </div>
        </Link>
        <Link
          to="/admin/dashboard"
          className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50 transition-colors group"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-slate-700 group-hover:text-teal-700">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-teal-500" />{" "}
            System Settings
          </div>
        </Link>
      </div>
    </div>
  );
}
