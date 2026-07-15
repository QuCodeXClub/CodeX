import { useSelector, useDispatch } from "react-redux";
import { clearError } from "../../context/messageSlice.js";
import { useEffect } from "react";

function GlobalMessage() {
  const { message, type } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!message) return null;

  const typeStyles = {
    error: "bg-red-500 text-white",
    success: "bg-teal-500 text-white",
    warning: "bg-amber-500 text-white",
  };

  return (
    <div className="fixed z-50 bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-auto max-w-md">
      <div
        className={`
          px-4 py-3 rounded-xl shadow-lg text-sm font-medium
          flex items-center gap-2 w-full sm:w-auto
          break-words
          backdrop-blur-md
          border border-white/20
          ${typeStyles[type] || "bg-gray-800 text-white"}
        `}
      >
        {message}
      </div>
    </div>
  );
}

export default GlobalMessage;
