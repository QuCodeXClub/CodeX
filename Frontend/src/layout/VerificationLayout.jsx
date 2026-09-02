import React from "react";
import { Copy, CheckCircle2, ShieldAlert, FileDown, ImageDown, Loader2, ShieldCheck, FileCode } from "lucide-react";

const VerificationLayout = ({
  isLoading,
  error,
  errorTitle = "Invalid Document",
  loadingTitle = "Verifying Document",
  loadingMessage = "Checking cryptographic signature & authenticity...",
  verificationURL,
  metadata = [],
  badgeTitle = "Verified Credential",
  badgeSubtitle = "Authentic CodeX Certificate",
  onExportPDF,
  onExportImage,
  onExportJPG,
  onExportSVG,
  isExportingPDF = false,
  isExportingImage = false,
  isExportingJPG = false,
  isExportingSVG = false,
  children,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="app-shell bg-bg h-screen max-h-screen w-screen max-w-full flex items-center justify-center relative font-sans text-text p-2 sm:p-4 lg:p-6 overflow-hidden select-none">
      {/* Print-Specific CSS */}
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
          #codex-certificate-svg, #codex-certificate-svg * {
            visibility: visible;
          }
          #codex-certificate-svg {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Main Expansive Container */}
      <div className="w-full max-w-[1780px] h-full max-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Loading State */}
        {isLoading ? (
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 glass-card rounded-3xl border border-border/80 w-full max-w-md text-center items-center my-auto">
            <div className="relative w-14 h-14 mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
            </div>
            <h2 className="font-display font-bold text-xl uppercase tracking-wider text-text">
              {loadingTitle}
            </h2>
            <p className="mt-2 text-text-muted text-xs font-mono">
              {loadingMessage}
            </p>
          </div>
        ) : error ? (
          /* Error State */
          <div className="relative z-10 flex flex-col justify-center p-8 sm:p-10 glass-card rounded-3xl border border-danger/40 w-full max-w-xl text-center items-center my-auto">
            <ShieldAlert className="w-14 h-14 text-danger mb-4" />
            <h1 className="font-display font-bold text-2xl uppercase tracking-wide text-danger">
              {errorTitle}
            </h1>
            <p className="mt-3 text-text-muted font-mono text-xs max-w-md">
              {error}
            </p>
          </div>
        ) : (
          /* Expansive Unscrollable Split-screen Layout */
          <div className="w-full h-full flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6 xl:gap-8 min-w-0 min-h-0 overflow-hidden">
            {/* Left: Certificate Display Area (Fills Full Available Screen Height & Width on Desktop) */}
            <div className="flex-1 w-full h-full min-w-0 min-h-0 flex items-center justify-center overflow-hidden">
              {children}
            </div>

            {/* Right: Sidebar Details & Actions Panel */}
            <div className="w-full lg:w-76 xl:w-84 2xl:w-92 flex flex-col justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl sm:rounded-3xl shadow-2xl print:hidden shrink-0">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400 opacity-60"></span>
                    <ShieldCheck className="relative w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-text">
                      {badgeTitle}
                    </h3>
                    <p className="text-[11px] text-text-muted">{badgeSubtitle}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  VERIFIED
                </span>
              </div>

              {/* Document Metadata Details Card */}
              {metadata && metadata.length > 0 && (
                <div className="bg-bg/60 border border-border/60 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 flex flex-col gap-1.5 sm:gap-2">
                  <div className="flex flex-col gap-1.5">
                    {metadata.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between text-xs py-0.5 sm:py-1 border-b border-border/30 last:border-0 ${
                          item.hideOnMobile ? "hidden sm:flex" : "flex"
                        }`}
                      >
                        <span className="text-text-muted font-medium text-[11px]">
                          {item.label}
                        </span>
                        {item.isBadge ? (
                          <span className="px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] font-bold bg-accent/15 text-accent border border-accent/25">
                            {item.value}
                          </span>
                        ) : item.isMono ? (
                          <span className="font-mono text-[10.5px] sm:text-[11px] font-semibold text-text select-all bg-card/80 px-1.5 py-0.5 rounded border border-border/40">
                            {item.value}
                          </span>
                        ) : (
                          <span className="font-semibold text-text text-right max-w-40 sm:max-w-47.5 truncate text-[11px] sm:text-xs" title={item.value}>
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="flex flex-col gap-2">
                {/* PDF Export Button */}
                {onExportPDF && (
                  <button
                    onClick={onExportPDF}
                    disabled={isExportingPDF}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl bg-accent text-text-inverse font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 shadow-md shadow-accent/20 cursor-pointer border-0 transition-all disabled:opacity-50"
                    title="Download Official PDF"
                  >
                    {isExportingPDF ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                    <span>{isExportingPDF ? "Exporting PDF..." : "Download PDF"}</span>
                  </button>
                )}

                {/* Quick Action Chips: 4-column row on mobile, 2x2 grid on desktop */}
                <div className="grid grid-cols-4 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {/* PNG Image Export Button */}
                  {onExportImage && (
                    <button
                      onClick={onExportImage}
                      disabled={isExportingImage}
                      className="inline-flex items-center justify-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-card border border-border text-text font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-card-hover hover:border-accent/40 cursor-pointer transition-all disabled:opacity-50"
                      title="Download High-Res PNG (300 DPI)"
                    >
                      {isExportingImage ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImageDown className="w-3.5 h-3.5 text-teal-400" />
                      )}
                      <span>PNG</span>
                    </button>
                  )}

                  {/* JPG Image Export Button */}
                  {onExportJPG && (
                    <button
                      onClick={onExportJPG}
                      disabled={isExportingJPG}
                      className="inline-flex items-center justify-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-card border border-border text-text font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-card-hover hover:border-accent/40 cursor-pointer transition-all disabled:opacity-50"
                      title="Download High-Res JPG (300 DPI)"
                    >
                      {isExportingJPG ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImageDown className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span>JPG</span>
                    </button>
                  )}

                  {/* Direct SVG Vector Export Button */}
                  {onExportSVG && (
                    <button
                      onClick={onExportSVG}
                      disabled={isExportingSVG}
                      className="inline-flex items-center justify-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-card border border-border text-text font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-card-hover hover:border-accent/40 cursor-pointer transition-all disabled:opacity-50"
                      title="Download Direct Vector SVG"
                    >
                      {isExportingSVG ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <FileCode className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>SVG</span>
                    </button>
                  )}

                  {/* Copy Link Button */}
                  <button
                    onClick={copyVerificationLink}
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-card border border-border text-text font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider hover:bg-card-hover hover:border-accent/40 cursor-pointer transition-all"
                    title="Copy Verification URL"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-accent" />
                    )}
                    <span>{copied ? "COPIED" : "SHARE"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationLayout;