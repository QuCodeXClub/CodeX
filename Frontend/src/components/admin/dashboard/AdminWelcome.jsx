import React from "react";
import { useSelector } from "react-redux";

export default function AdminWelcome({ isSuperView }) {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = (user?.admin?.role || user?.role) === "SuperAdmin";
  const shouldShowSuper = isSuperView !== undefined ? isSuperView : isSuperAdmin;

  return (
    <div className={`bg-card/85 backdrop-blur-xl rounded-2xl p-5 sm:p-7 text-text border ${shouldShowSuper ? "border-fuchsia-500/40 shadow-fuchsia-500/10 hover:border-fuchsia-500/60" : "border-border/80 hover:border-accent/40"} relative overflow-hidden shadow-lg transition-all`}>
      <div className={`absolute top-0 right-0 w-64 h-64 ${shouldShowSuper ? "bg-fuchsia-500 opacity-20" : "bg-accent opacity-15"} rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>
      <div className="relative z-10">
        {shouldShowSuper ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm shadow-fuchsia-500/20 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
            <span>ROOT CONTROL • SUPER ADMIN</span>
          </div>
        ) : (
          <p className="text-text-muted text-xs font-mono font-semibold uppercase tracking-wider mb-1">Welcome back,</p>
        )}
        <h2 className="text-2xl font-display font-black text-text mb-2 uppercase tracking-wide">
          {shouldShowSuper ? (
            <>ROOT <span className="text-fuchsia-400">CONTROL</span></>
          ) : (
            <>ADMIN <span className="text-accent">COMMAND</span></>
          )}
        </h2>
        <p className="text-text-muted text-xs leading-relaxed">
          {shouldShowSuper
            ? "Full root privileges enabled. Global certificate authorizations, administrator governance, and system telemetry."
            : "Platform telemetry and administrative console status for CodeX Developer Club."}
        </p>
      </div>
    </div>
  );
}