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
  Globe,
  Activity,
  Loader2,
  RefreshCw,
  LogOut,
  ShieldAlert,
  Clock,
  User,
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

  const handleKill = async (session) => {
    const isCurrent = session.isCurrent;
    const isInactive = session.status !== "ACTIVE";

    const isConfirmed = await confirm({
      title: isInactive ? "Delete Session Record" : "Revoke Session",
      message: isCurrent
        ? "Revoking your current session will log you out immediately. Continue?"
        : isInactive
        ? "Are you sure you want to delete this session log record?"
        : "Are you sure you want to forcibly log out this device?",
    });

    if (!isConfirmed) return;

    setUpdatingId(session._id);
    try {
      await dispatch(killAdminSession(session._id)).unwrap();
    } catch {
      // Error handled in thunk
    } finally {
      setUpdatingId(null);
    }
  };

  const formatIP = (ip) => {
    if (!ip) return "Unknown";
    if (ip === "::1" || ip.includes("127.0.0.1"))
      return "127.0.0.1 (Localhost)";
    return ip;
  };

  const renderStatusBadge = (session) => {
    const status = session.status || "ACTIVE";
    if (session.isCurrent && status === "ACTIVE") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          This Device (Active)
        </span>
      );
    }

    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Active
          </span>
        );
      case "LOGGED_OUT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30">
            <LogOut className="w-3 h-3 text-zinc-400" />
            Logged Out
          </span>
        );
      case "REVOKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Revoked
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 text-amber-400" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-text relative">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xs text-text-muted font-mono">
          Total Sessions: <span className="font-bold text-text">{sessions.length}</span>
        </div>
        <button
          onClick={() => dispatch(fetchAdminSessions())}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent transition-colors shadow-sm disabled:opacity-50"
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
          <Activity className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-bold text-text mb-1">
            No Session Records
          </h3>
          <p className="text-text-muted text-sm">
            No active or past sessions found.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session) => {
            const isActive = session.status === "ACTIVE";
            return (
              <div
                key={session._id}
                className={`bg-card/85 backdrop-blur-xl border ${
                  session.isCurrent
                    ? "border-accent/50 shadow-accent/10"
                    : "border-border/80"
                } rounded-xl p-5 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all`}
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
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-display font-bold text-text uppercase flex items-center gap-2">
                        {session.os || "Unknown OS"}
                        <span className="text-text-muted">/</span>
                        <span className="text-accent">
                          {session.browser || "Unknown Browser"}
                        </span>
                      </h3>
                      {renderStatusBadge(session)}
                    </div>

                    {session.adminId && (
                      <div className="text-xs font-mono font-medium text-text-muted flex items-center gap-1.5 mt-1 mb-1 bg-card-hover/50 px-2 py-0.5 rounded-md border border-border/40 w-fit">
                        <User className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="font-semibold text-text">{session.adminId.name || "Admin"}</span>
                        <span>({session.adminId.email || "N/A"})</span>
                      </div>
                    )}

                    <div className="mt-1.5 space-y-1">
                      <p className="text-xs font-mono text-text-muted flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-accent" />
                        IP: {formatIP(session.ipAddress)}
                      </p>
                      <p className="text-xs font-mono text-text-muted flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-accent" />
                        Established: {new Date(session.createdAt).toLocaleString()}
                      </p>
                      {session.loggedOutAt && (
                        <p className="text-xs font-mono text-text-muted flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5 text-text-muted" />
                          Ended: {new Date(session.loggedOutAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {session.isCurrent ? (
                  <span className="text-xs font-mono font-bold text-accent px-3.5 py-1.5 bg-accent/10 border border-accent/30 rounded-lg shrink-0 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    This Device (Active)
                  </span>
                ) : isActive ? (
                  <button
                    onClick={() => handleKill(session)}
                    disabled={updatingId === session._id}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-sm bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/30"
                  >
                    {updatingId === session._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldAlert className="w-4 h-4" />
                    )}
                    {updatingId === session._id ? "Revoking..." : "Revoke Access"}
                  </button>
                ) : (
                  <span className="text-xs font-mono text-text-muted px-3 py-1.5 bg-card/60 border border-border/50 rounded-lg shrink-0">
                    Retained (7-Day Log)
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
