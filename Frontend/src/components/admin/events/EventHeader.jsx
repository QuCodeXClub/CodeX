import React from "react";
import { Plus, RefreshCw } from "lucide-react";

export default function EventHeader({ openCreateModal, onRefresh, loading }) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Event Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create, edit, and organize public events.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-teal-600 hover:border-teal-200 transition-colors shadow-sm disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw
            className={`w-5 h-5 ${loading ? "animate-spin text-teal-500" : ""}`}
          />
        </button>
        <button
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>
    </header>
  );
}
