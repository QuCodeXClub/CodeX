import React from "react";
import { CheckCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center font-sans p-6 relative">
      <div className="glass-card p-8 sm:p-14 rounded-3xl border border-border/80 shadow-2xl max-w-xl w-full text-center relative z-10">
        <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-6 relative">
          <div className="absolute inset-0 rounded-full border-2 border-accent/40 animate-ping"></div>
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-xs font-bold uppercase tracking-widest mb-4">
          <span>TRANSMISSION RECEIVED</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase text-text mb-4 tracking-tight">
          APPLICATION SUBMITTED
        </h2>

        <p className="text-text-muted font-mono text-xs sm:text-sm leading-relaxed mb-8 max-w-md mx-auto">
          Your registration details have been securely recorded. You will receive an email notification once Central Command reviews and approves your submission.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-text-inverse font-mono text-xs font-bold uppercase tracking-widest hover:opacity-95 shadow-lg shadow-accent/25 transition-all cursor-pointer border-0"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </button>
      </div>
    </div>
  );
}
