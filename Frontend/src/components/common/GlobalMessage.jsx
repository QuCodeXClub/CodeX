import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../context/messageSlice.js";
import { useEffect } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

function GlobalMessage() {
  const { message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const isRateLimit =
    message &&
    (message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("too many") ||
      message.toLowerCase().includes("cooldown") ||
      message.toLowerCase().includes("attempt"));

  useEffect(() => {
    if (message) {
      const displayDuration = isRateLimit ? 7000 : 4500;
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, displayDuration);

      return () => clearTimeout(timer);
    }
  }, [message, isRateLimit, dispatch]);

  if (!message) return null;

  return (
    <div className="fixed z-50 bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-auto max-w-lg animate-fadeIn pointer-events-auto">
      <div
        className={`
          px-4 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-mono font-medium
          flex items-start gap-3 w-full sm:w-auto
          break-words
          backdrop-blur-xl border
          ${
            isRateLimit
              ? "bg-rose-600/95 text-white border-rose-400 shadow-rose-600/30"
              : type === "success"
              ? "bg-accent text-[#111111] border-accent/60 shadow-accent/20 font-bold"
              : type === "warning"
              ? "bg-amber-500/95 text-zinc-950 border-amber-300 shadow-amber-500/20 font-bold"
              : "bg-rose-600/95 text-white border-rose-400 shadow-rose-600/30"
          }
        `}
      >
        {isRateLimit ? (
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-white animate-pulse" />
        ) : type === "success" ? (
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#111111]" />
        ) : type === "warning" ? (
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-zinc-950" />
        ) : (
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-white" />
        )}

        <div className="flex-1">
          {isRateLimit && (
            <span className="block font-bold uppercase tracking-wider text-[11px] mb-0.5 opacity-90">
              Security Rate Limit Protection
            </span>
          )}
          <span>{message}</span>
        </div>

        <button
          type="button"
          onClick={() => dispatch(clearError())}
          className="ml-2 text-current opacity-70 hover:opacity-100 text-xs uppercase font-bold shrink-0 cursor-pointer"
          title="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default GlobalMessage;
