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
    <div className="font-sans text-text relative">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => dispatch(fetchAdminSessions())}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
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
        <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm">
          <Activity className="w-12 h-12 text-text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-1">
            No Active Connections
          </h3>
          <p className="text-text-text-muted text-sm">
            No secondary devices are currently linked to this system.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-accent/40 hover:shadow-accent/5 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Device Icon */}
                <div className="w-12 h-12 bg-card-hover/80 border border-border/60 rounded-xl flex items-center justify-center text-accent shrink-0 shadow-sm">
                  {session.device?.toUpperCase() === "MOBILE" ? (
                    <Smartphone className="w-5 h-5 text-accent" />
                  ) : (
                    <Monitor className="w-5 h-5 text-accent" />
                  )}
                </div>

                {/* Session Details */}
                <div>
                  <h3 className="text-base font-display font-bold text-text uppercase flex items-center gap-2">
                    {session.os || "Unknown OS"}
                    <span className="text-text-muted">/</span>
                    <span className="text-accent">
                      {session.browser || "Unknown Browser"}
                    </span>
                  </h3>

                  <div className="mt-1.5 space-y-1">
                    <p className="text-xs font-mono text-text-muted flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-accent" />
                      IP: {formatIP(session.ipAddress)}
                    </p>
                    <p className="text-xs font-mono text-text-muted flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-accent" />
                      Est: {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleKill(session._id)}
                disabled={updatingId === session._id}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border border-danger/30 shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
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
