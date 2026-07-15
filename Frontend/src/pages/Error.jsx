import React from "react";
import { Link, useRouteError } from "react-router-dom";
import contentData from "../data/content.json";

const GlobalError = () => {
  const error = useRouteError();
  const { error: errorContent } = contentData;

  const status = error?.status || 404;
  const message = error?.statusText || errorContent.defaultMessage;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 transition-colors"
      style={{
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#111827" // dark-background
          : "#Faf9f6", // background
        color: document.documentElement.classList.contains("dark")
          ? "#FFFFFF" // dark-text
          : "#0a0a0a", // text-primary
      }}
    >
      <h1
        className="text-[6rem] font-extrabold bg-clip-text text-transparent animate-bounce"
        style={{
          backgroundImage: document.documentElement.classList.contains("dark")
            ? "linear-gradient(90deg, #27EBF5, #2ec5d4, #0a0a0a)" // dark gradient
            : "linear-gradient(90deg, #2ec5d4, #27EBF5, #000000)", // light gradient
        }}
      >
        {status}
      </h1>

      <p
        className="mt-3 text-xl font-medium text-center max-w-xs"
        style={{
          color: document.documentElement.classList.contains("dark")
            ? "#94A3B8" // dark-muted
            : "#475569", // text-secondary
        }}
      >
        {message}
      </p>

      <div
        className="mt-6 w-24 h-24 flex items-center justify-center rounded-full shadow-md animate-pulse"
        style={{
          backgroundImage: document.documentElement.classList.contains("dark")
            ? "linear-gradient(45deg, #27EBF533, #2ec5d433, #0a0a0a33)"
            : "linear-gradient(45deg, #2ec5d433, #27EBF533, #00000033)",
          boxShadow: "0 4px 6px rgba(46, 197, 212, 0.25)", // Teal Shadow
        }}
      >
        <span className="text-4xl">😢</span>
      </div>

      <Link
        to="/"
        className="mt-6 px-6 py-2 font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-transform duration-200"
        style={{
          backgroundImage: document.documentElement.classList.contains("dark")
            ? "linear-gradient(90deg, #27EBF5, #2ec5d4, #0a0a0a)"
            : "linear-gradient(90deg, #2ec5d4, #27EBF5, #0a0a0a)",
          color: "#FFFFFF",
          boxShadow: "0 4px 6px rgba(46, 197, 212, 0.25)", // Teal Shadow
        }}
      >
        {errorContent.buttonText}
      </Link>
    </div>
  );
};

export default GlobalError;
