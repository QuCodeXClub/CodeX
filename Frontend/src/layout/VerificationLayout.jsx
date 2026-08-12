import React from "react";
import { Printer, Copy, CheckCircle2, ShieldAlert } from "lucide-react";

const VerificationLayout = ({
  isLoading,
  error,
  errorTitle = "Invalid Document",
  loadingTitle = "Verifying Document",
  loadingMessage = "Checking cryptographic signature & authenticity...",
  verificationURL,
  downloadText = "Download PDF",
  children,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy link.");
    }
  };

  return (
    <div className="app-shell bg-transparent min-h-screen relative font-sans text-text">
      {/* Fixed Print-Specific CSS */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          #verification-overlay, #verification-overlay * {
            visibility: visible;
          }
          #verification-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>

      {/* Main Shared Wrapper */}
      <div
        id="verification-overlay"
        className="w-full max-w-[1400px] mx-auto flex-1 bg-transparent min-h-[calc(100vh-10rem)] py-12 px-4 flex flex-col items-center justify-center relative"
      >
        
        {/* Loading State */}
        {isLoading ? (
          <div className="relative z-10 flex flex-col justify-center p-10 glass-card rounded-3xl border border-border/80 w-full max-w-lg text-center items-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            </div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-text">
              {loadingTitle}
            </h2>
            <p className="mt-2 text-text-muted text-xs font-mono">
              {loadingMessage}
            </p>
          </div>
        ) : 
        
        /* Error State */
        error ? (
          <div className="relative z-10 flex flex-col justify-center p-10 glass-card rounded-3xl border border-danger/40 w-full max-w-xl text-center items-center">
            <ShieldAlert className="w-16 h-16 text-danger mb-4" />
            <h1 className="font-display font-bold text-3xl uppercase tracking-wide text-danger">
              {errorTitle}
            </h1>
            <p className="mt-4 text-text-muted font-mono text-xs max-w-md">
              {error}
            </p>
          </div>
        ) : 
        
        /* Success Layout */
        (
          <>
            {/* Action Buttons Toolbar */}
            <div className="relative z-10 w-full max-w-[1000px] flex flex-wrap justify-end gap-3 mb-6 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-text-inverse font-mono text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-md shadow-accent/20 cursor-pointer border-0 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>{downloadText}</span>
              </button>
              
              <button
                onClick={copyVerificationLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-text font-mono text-xs font-bold uppercase tracking-wider hover:bg-card-hover hover:border-accent/40 cursor-pointer transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-accent" />}
                <span>{copied ? "COPIED LINK" : "COPY LINK"}</span>
              </button>
            </div>

            {/* Document Container */}
            {children}
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationLayout;