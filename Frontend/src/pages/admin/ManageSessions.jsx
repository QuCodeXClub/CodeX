import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSessions,
  killAdminSession,
} from "../../context/adminSessionsSlice";
import { useConfirm } from "../../context/ConfirmContext";
import {
  Monitor,
  Smartphone,
  Trash2,
  Globe,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { SessionCardSkeleton } from "../../components/common/skeletons";

export default function ManageSessions() {
  const { sessions, loading, isLoaded } = useSelector(
    (state) => state.adminSessions
  );
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchAdminSessions());
    }
  }, [dispatch, isLoaded]);

  const handleKill = async (id) => {
    const isConfirmed = await confirm({
      title: "Revoke Session",
      message: "Are you sure you want to forcibly log out this device?",
    });

    if (!isConfirmed) return;

    setUpdatingId(id);
    try {
      await dispatch(killAdminSession(id)).unwrap();
    } catch {
      // Error handled in thunk
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to make local IPs readable during development
  const formatIP = (ip) => {
    if (!ip) return "Unknown";
    if (ip === "::1" || ip.includes("127.0.0.1"))
      return "127.0.0.1 (Localhost)";
    return ip;
  };

  return (
    <div className="font-sans text-slate-900 relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => dispatch(fetchAdminSessions())}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:text-teal-600 hover:bg-teal-50 hover:border-teal-200 transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-teal-500" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
          <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            No Active Connections
          </h3>
          <p className="text-slate-500 text-sm">
            No secondary devices are currently linked to this system.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* Device Icon */}
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  {session.device?.toUpperCase() === "MOBILE" ? (
                    <Smartphone className="w-6 h-6 text-slate-600" />
                  ) : (
                    <Monitor className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                {/* Session Details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {session.os || "Unknown OS"}
                    <span className="text-slate-300">/</span>
                    <span className="text-teal-600">
                      {session.browser || "Unknown Browser"}
                    </span>
                  </h3>

                  <div className="mt-1.5 space-y-1">
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      IP: {formatIP(session.ipAddress)}
                    </p>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-slate-400" />
                      Est: {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleKill(session._id)}
                disabled={updatingId === session._id}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors border border-red-100 hover:border-red-200 shrink-0 disabled:opacity-50"
              >
                {updatingId === session._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {updatingId === session._id ? "Revoking..." : "Revoke Access"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
