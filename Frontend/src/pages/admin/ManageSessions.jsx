import { useEffect, useState, useMemo } from "react";
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
  Tablet,
  Globe,
  Activity,
  Loader2,
  RefreshCw,
  LogOut,
  ShieldAlert,
  Clock,
  User,
  Search,
  Copy,
  Check,
  ShieldCheck,
  X,
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
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, CURRENT, INACTIVE

  const isStandalonePage = location.pathname.includes("/admin/sessions");

  useEffect(() => {
    if (!isLoaded) {
      dispatch(fetchAdminSessions());
    }
  }, [dispatch, isLoaded]);

  // Derived metric statistics
  const stats = useMemo(() => {
    const total = sessions.length;
    const active = sessions.filter((s) => s.status === "ACTIVE").length;
    const current = sessions.find((s) => s.isCurrent);
    const inactive = sessions.filter((s) => s.status !== "ACTIVE").length;
    return { total, active, current, inactive };
  }, [sessions]);

  // Filtered sessions based on search & status filter
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      // Status filtering
      if (statusFilter === "ACTIVE" && session.status !== "ACTIVE") return false;
      if (statusFilter === "CURRENT" && !session.isCurrent) return false;
      if (statusFilter === "INACTIVE" && session.status === "ACTIVE") return false;

      // Text search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const ip = (session.ipAddress || "").toLowerCase();
        const os = (session.os || "").toLowerCase();
        const browser = (session.browser || "").toLowerCase();
        const device = (session.device || "").toLowerCase();
        const adminName = (session.adminId?.name || "").toLowerCase();
        const adminEmail = (session.adminId?.email || "").toLowerCase();

        return (
          ip.includes(q) ||
          os.includes(q) ||
          browser.includes(q) ||
          device.includes(q) ||
          adminName.includes(q) ||
          adminEmail.includes(q)
        );
      }

      return true;
    });
  }, [sessions, statusFilter, searchTerm]);

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

  const handleCopyIp = (id, ip) => {
    if (!ip) return;
    navigator.clipboard.writeText(ip);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatIP = (ip) => {
    if (!ip) return "Unknown";
    if (ip === "::1" || ip.includes("127.0.0.1")) {
      return "127.0.0.1 (Localhost)";
    }
    return ip;
  };

  const renderDeviceIcon = (deviceType) => {
    const dev = (deviceType || "").toUpperCase();
    if (dev === "MOBILE") {
      return <Smartphone className="w-5 h-5 text-accent shrink-0" />;
    }
    if (dev === "TABLET") {
      return <Tablet className="w-5 h-5 text-accent shrink-0" />;
    }
    return <Monitor className="w-5 h-5 text-accent shrink-0" />;
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
    <div
      className={`${
        isStandalonePage
          ? "p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-full"
          : "w-full"
      } font-sans text-text relative`}
    >
      {/* Header */}
      {isStandalonePage ? (
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 border-b border-border/60 pb-5 sm:pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-2 shadow-sm">
              <Monitor className="w-3.5 h-3.5" />
              <span>SECURITY & ACCESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-text uppercase tracking-tight">
              ACTIVE <span className="text-accent">SESSIONS</span>
            </h1>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Audit, track, and revoke active login sessions and device tokens across devices.
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAdminSessions())}
            disabled={loading}
            className="self-stretch sm:self-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl text-xs font-mono font-bold text-text-muted hover:text-accent hover:border-accent/40 transition-all shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap min-h-[42px]"
            title="Refresh Sessions"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </header>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-text uppercase tracking-tight">
              Device & Login <span className="text-accent">Sessions</span>
            </h2>
            <p className="text-xs text-text-muted">
              Inspect devices and active tokens logged into your account.
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchAdminSessions())}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 bg-card border border-border rounded-xl text-xs font-medium text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent transition-colors shadow-sm disabled:opacity-50 cursor-pointer min-h-[38px]"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-accent" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-5 sm:mb-6">
        {/* Total Sessions */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider block truncate">
              Total Logged
            </span>
            <span className="text-xl sm:text-2xl font-display font-black text-text">
              {stats.total}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
          </div>
        </div>

        {/* Active Devices */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider block truncate">
              Active Now
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-display font-black text-emerald-400">
                {stats.active}
              </span>
              {stats.active > 0 && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              )}
            </div>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
        </div>

        {/* Current Device */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider block truncate">
              This Device
            </span>
            <span className="text-sm sm:text-base font-display font-bold text-accent truncate block">
              {stats.current ? stats.current.os || "Active" : "Detected"}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
            {stats.current?.device?.toUpperCase() === "MOBILE" ? (
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            ) : (
              <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            )}
          </div>
        </div>

        {/* Terminated Logs */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl p-3 sm:p-4 shadow-sm flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-mono font-bold text-text-muted uppercase tracking-wider block truncate">
              Terminated
            </span>
            <span className="text-xl sm:text-2xl font-display font-black text-text-muted">
              {stats.inactive}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-500/10 border border-zinc-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-text-muted" />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        {/* Search input */}
        <div className="relative flex-1 sm:max-w-xs md:max-w-sm">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search IP, OS, browser, admin..."
            className="w-full pl-9 pr-8 py-2 bg-card/85 backdrop-blur-xl border border-border/80 rounded-xl text-xs sm:text-sm font-sans placeholder:text-text-muted/60 text-text focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/40 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar shrink-0">
          {[
            { id: "ALL", label: "All", count: stats.total },
            { id: "ACTIVE", label: "Active", count: stats.active },
            { id: "CURRENT", label: "This Device", count: stats.current ? 1 : 0 },
            { id: "INACTIVE", label: "History", count: stats.inactive },
          ].map((tab) => {
            const isSelected = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-accent/20 text-accent border border-accent/40 shadow-sm"
                    : "bg-card/70 text-text-muted hover:text-text border border-border/70 hover:bg-card-hover"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? "bg-accent text-panel"
                      : "bg-card-hover text-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {loading && !isLoaded ? (
        <div className="grid gap-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <SessionCardSkeleton key={i} />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-14 text-center shadow-sm">
          <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-text-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-base sm:text-lg font-bold text-text mb-1">
            No Session Records
          </h3>
          <p className="text-text-muted text-xs sm:text-sm max-w-sm mx-auto">
            No active or past sessions found in the system.
          </p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="bg-card/85 backdrop-blur-xl border border-border rounded-2xl p-8 sm:p-12 text-center shadow-sm">
          <Search className="w-9 h-9 text-text-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-base sm:text-lg font-bold text-text mb-1">
            No Matching Sessions
          </h3>
          <p className="text-text-muted text-xs sm:text-sm max-w-sm mx-auto mb-4">
            No sessions match your search &quot;{searchTerm}&quot; and filter criteria.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
            }}
            className="px-4 py-2 bg-card hover:bg-card-hover border border-border rounded-xl text-xs font-mono font-semibold text-accent transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredSessions.map((session) => {
            const isActive = session.status === "ACTIVE";
            return (
              <div
                key={session._id}
                className={`bg-card/85 backdrop-blur-xl border rounded-2xl p-4 sm:p-5 shadow-md transition-all duration-200 relative overflow-hidden flex flex-col gap-3.5 ${
                  session.isCurrent
                    ? "border-accent/60 shadow-[0_0_20px_var(--color-accent-glow)] ring-1 ring-accent/30"
                    : "border-border/80 hover:border-border"
                }`}
              >
                {/* Top Row: Device Icon, OS/Browser, Admin info, and Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Device Icon + Titles */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-card-hover/90 border border-border/70 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      {renderDeviceIcon(session.device)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="text-sm sm:text-base font-display font-bold text-text uppercase tracking-tight flex items-center gap-1.5 truncate">
                          <span>{session.os || "Unknown OS"}</span>
                          <span className="text-text-muted">/</span>
                          <span className="text-accent truncate">
                            {session.browser || "Unknown Browser"}
                          </span>
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-card-hover/80 text-text-muted border border-border/40 uppercase tracking-wider shrink-0">
                          {session.device || "Desktop"}
                        </span>
                      </div>

                      {session.adminId && (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded-md bg-card-hover/60 border border-border/40 text-xs font-mono text-text-muted max-w-full">
                          <User className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span className="font-semibold text-text truncate max-w-[110px] xs:max-w-[160px] sm:max-w-none">
                            {session.adminId.name || "Admin"}
                          </span>
                          <span className="truncate max-w-[130px] xs:max-w-[180px] sm:max-w-none text-text-muted">
                            ({session.adminId.email || "N/A"})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-center shrink-0">
                    {renderStatusBadge(session)}
                  </div>
                </div>

                {/* Middle Row: Responsive Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 pt-3 border-t border-border/50 text-xs font-mono">
                  {/* IP Address chip with copy button */}
                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-card-hover/50 border border-border/40 text-text-muted">
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">
                        IP: <span className="text-text font-medium">{formatIP(session.ipAddress)}</span>
                      </span>
                    </div>
                    {session.ipAddress && (
                      <button
                        onClick={() => handleCopyIp(session._id, session.ipAddress)}
                        className="p-1 text-text-muted hover:text-accent rounded transition-colors shrink-0 cursor-pointer"
                        title="Copy IP Address"
                      >
                        {copiedId === session._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Established Time */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card-hover/50 border border-border/40 text-text-muted">
                    <Activity className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="truncate">
                      Established:{" "}
                      <span className="text-text font-medium">
                        {new Date(session.createdAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                        })}
                        ,{" "}
                        {new Date(session.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </div>

                  {/* Expiry or Logged Out Time */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-card-hover/50 border border-border/40 text-text-muted sm:col-span-2 lg:col-span-1">
                    {session.loggedOutAt ? (
                      <>
                        <LogOut className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">
                          Ended:{" "}
                          <span className="text-text font-medium">
                            {new Date(session.loggedOutAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                            ,{" "}
                            {new Date(session.loggedOutAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                      </>
                    ) : session.expiresAt ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">
                          Expires:{" "}
                          <span className="text-text font-medium">
                            {new Date(session.expiresAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}
                            ,{" "}
                            {new Date(session.expiresAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="truncate">Token: Active</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Context Info and Action Button */}
                <div className="pt-3 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
                    {session.isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 text-accent font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        Current active session on this device
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Authorized remote login
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        Retained 7-day security audit record
                      </span>
                    )}
                  </div>

                  <div>
                    {session.isCurrent ? (
                      <span className="w-full sm:w-auto text-center justify-center text-xs font-mono font-bold text-accent px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl flex items-center gap-1.5 shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        Current Device
                      </span>
                    ) : isActive ? (
                      <button
                        onClick={() => handleKill(session)}
                        disabled={updatingId === session._id}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-sm bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/30 hover:border-danger hover:shadow-tech min-h-[40px]"
                      >
                        {updatingId === session._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ShieldAlert className="w-3.5 h-3.5" />
                        )}
                        {updatingId === session._id ? "Revoking..." : "Revoke Access"}
                      </button>
                    ) : (
                      <span className="w-full sm:w-auto text-center justify-center text-xs font-mono text-text-muted px-3 py-1.5 bg-card/60 border border-border/50 rounded-xl flex items-center gap-1.5">
                        Archived Log
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
