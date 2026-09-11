import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [updatingId, setUpdatingId] = useState(null);

  const isStandalonePage = location.pathname.includes("/admin/sessions");

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30 shadow-sm whitespace-nowrap">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Active
          </span>
        );
      case "LOGGED_OUT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-500/15 text-zinc-400 border border-zinc-500/30 whitespace-nowrap">
            <LogOut className="w-3 h-3 text-zinc-400" />
            Logged Out
          </span>
        );
      case "REVOKED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 whitespace-nowrap">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            Revoked
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 whitespace-nowrap">
            <Clock className="w-3 h-3 text-amber-400" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${isStandalonePage ? "p-4 sm:p-6 lg:p-10 min-h-full" : ""} font-sans text-text relative`}>
      {isStandalonePage && (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <Monitor className="w-3.5 h-3.5" />
              <span>SECURITY & ACCESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
              ACTIVE <span className="text-accent">SESSIONS</span>
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Audit and revoke active login sessions and device tokens.
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAdminSessions())}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl text-xs font-mono font-bold text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
            title="Refresh Sessions"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </header>
      )}

      {!isStandalonePage && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-xs text-text-muted font-mono">
            Total Sessions: <span className="font-bold text-text">{sessions.length}</span>
          </div>
          <button
            onClick={() => dispatch(fetchAdminSessions())}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
            />
            Refresh
          </button>
        </div>
      )}

      {isStandalonePage && (
        <div className="text-xs text-text-muted font-mono mb-4">
          Total Sessions: <span className="font-bold text-text">{sessions.length}</span>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 sm:p-16 text-center shadow-sm">
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
                } rounded-xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6 transition-all`}
              >
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  {/* Device Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-card-hover/80 border border-border/60 rounded-xl flex items-center justify-center text-accent shrink-0 shadow-sm">
                    {session.device?.toUpperCase() === "MOBILE" ? (
                      <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    ) : (
                      <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                    )}
                  </div>

                  {/* Session Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-sm sm:text-base font-display font-bold text-text uppercase flex items-center gap-1.5 sm:gap-2 truncate">
                        {session.os || "Unknown OS"}
                        <span className="text-text-muted">/</span>
                        <span className="text-accent truncate">
                          {session.browser || "Unknown Browser"}
                        </span>
                      </h3>
                      {renderStatusBadge(session)}
                    </div>

                    {session.adminId && (
                      <div className="text-xs font-mono font-medium text-text-muted flex flex-wrap items-center gap-1.5 mt-1 mb-1 bg-card-hover/50 px-2 py-0.5 rounded-md border border-border/40 w-fit max-w-full">
                        <User className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="font-semibold text-text truncate max-w-[140px] sm:max-w-none">{session.adminId.name || "Admin"}</span>
                        <span className="truncate max-w-[180px] sm:max-w-none text-text-muted">({session.adminId.email || "N/A"})</span>
                      </div>
                    )}

                    <div className="mt-1.5 space-y-1">
                      <p className="text-xs font-mono text-text-muted flex flex-wrap items-center gap-2 break-all">
                        <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>IP: {formatIP(session.ipAddress)}</span>
                      </p>
                      <p className="text-xs font-mono text-text-muted flex flex-wrap items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>Established: {new Date(session.createdAt).toLocaleString()}</span>
                      </p>
                      {session.loggedOutAt && (
                        <p className="text-xs font-mono text-text-muted flex flex-wrap items-center gap-2">
                          <LogOut className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          <span>Ended: {new Date(session.loggedOutAt).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto flex items-center justify-end pt-2 md:pt-0 border-t border-border/40 md:border-0 shrink-0">
                  {session.isCurrent ? (
                    <span className="w-full md:w-auto text-center justify-center text-xs font-mono font-bold text-accent px-3.5 py-2 bg-accent/10 border border-accent/30 rounded-lg shrink-0 flex items-center gap-1.5">
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
                    <span className="w-full md:w-auto text-center justify-center text-xs font-mono text-text-muted px-3 py-1.5 bg-card/60 border border-border/50 rounded-lg shrink-0">
                      Retained (7-Day Log)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
