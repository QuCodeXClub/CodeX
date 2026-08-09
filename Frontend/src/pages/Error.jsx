import React from "react";
import { Link, useRouteError } from "react-router-dom";
import contentData from "../data/content.json";
import { Terminal, Home, AlertCircle } from "lucide-react";

const GlobalError = () => {
  const error = useRouteError();
  const { error: errorContent } = contentData;

  const status = error?.status || 404;
  const message = error?.statusText || errorContent.defaultMessage || "Requested page route could not be found.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-bg text-text font-sans relative overflow-hidden">
      {/* Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger font-mono text-xs font-bold uppercase tracking-widest mb-6">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>HTTP {status} ERROR</span>
        </div>

        <h1 className="text-8xl sm:text-9xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-text via-text to-accent/40 leading-none tracking-tighter mb-2">
          {status}
        </h1>

        <p className="text-lg font-mono text-text-muted mb-8 max-w-md">
          {message}
        </p>

        {/* Terminal Diagnostic Block */}
        <div className="w-full bg-card-hover/90 border border-border/80 rounded-2xl p-5 mb-8 text-left font-mono text-xs text-text-muted shadow-lg">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-3">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-accent font-bold">system.diagnostics</span>
          </div>
          <p className="text-emerald-500 font-bold mb-1">&gt; ERROR_CODE: ROUTE_NOT_FOUND</p>
          <p className="mb-1">&gt; PATH: {window.location.pathname}</p>
          <p>&gt; RESOLUTION: RETURN_TO_CLUSTER_HOME</p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-text-inverse font-mono text-xs font-bold uppercase tracking-widest hover:opacity-95 shadow-lg shadow-accent/25 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{errorContent?.buttonText || "BACK TO HOME"}</span>
        </Link>
      </div>
    </div>
  );
};

export default GlobalError;
