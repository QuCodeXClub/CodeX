import React from "react";
import { Link, useRouteError } from "react-router-dom";
import contentData from "../data/content.json";
import { Terminal, Home, AlertCircle, RefreshCw } from "lucide-react";

const GlobalError = () => {
  const error = useRouteError();
  const { error: errorContent } = contentData;

  const errorMessage = error?.message || error?.toString() || "";
  const isChunkError =
    errorMessage.includes("Failed to fetch dynamically imported module") ||
    errorMessage.includes("Importing a module script failed") ||
    errorMessage.includes("text/html") ||
    errorMessage.includes("Loading chunk") ||
    errorMessage.includes("CSS chunk");

  const status = isChunkError ? "503" : error?.status || 404;
  const message = isChunkError
    ? "A new version of CodeX is available or cached resources were updated. Please refresh the app to load the latest components."
    : error?.statusText || errorContent.defaultMessage || "Requested page route could not be found.";

  const handleRefresh = () => {
    sessionStorage.removeItem("codex_chunk_refreshed");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-bg text-text font-sans relative overflow-hidden">
      {/* Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 text-danger font-mono text-xs font-bold uppercase tracking-widest mb-6">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{isChunkError ? "APP UPDATE REQUIRED" : `HTTP ${status} ERROR`}</span>
        </div>

        <h1 className="text-7xl sm:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-text via-text to-accent/40 leading-none tracking-tighter mb-4">
          {isChunkError ? "OUTDATED" : status}
        </h1>

        <p className="text-base font-mono text-text-muted mb-8 max-w-md">
          {message}
        </p>

        {/* Terminal Diagnostic Block */}
        <div className="w-full bg-card-hover/90 border border-border/80 rounded-2xl p-5 mb-8 text-left font-mono text-xs text-text-muted shadow-lg">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-3">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="text-accent font-bold">system.diagnostics</span>
          </div>
          <p className="text-emerald-500 font-bold mb-1">&gt; ERROR_CODE: {isChunkError ? "DYNAMIC_MODULE_FETCH_FAILED" : "ROUTE_NOT_FOUND"}</p>
          <p className="mb-1">&gt; PATH: {window.location.pathname}</p>
          <p>&gt; RESOLUTION: {isChunkError ? "REFRESH_BROWSER_CACHE" : "RETURN_TO_CLUSTER_HOME"}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {isChunkError && (
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-text-inverse font-mono text-xs font-bold uppercase tracking-widest hover:opacity-95 shadow-lg shadow-accent/25 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>REFRESH APP</span>
            </button>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-card border border-border text-text font-mono text-xs font-bold uppercase tracking-widest hover:bg-card-hover transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{errorContent?.buttonText || "BACK TO HOME"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GlobalError;
