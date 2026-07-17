import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { boardingPassService } from "../services/boardingPassService";
import { QrCode, Wifi, Ticket, Hash, KeyRound } from "lucide-react";

const VerifyBoardingPass = () => {
  const { boardingPassId } = useParams();

  const [loading, setLoading] = useState(true);
  const [boardingPass, setBoardingPass] = useState(null);
  const [error, setError] = useState("");

  const verificationURL = `${window.location.origin}/verify-boarding-pass/${boardingPassId}`;

  useEffect(() => {
    fetchBoardingPass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardingPassId]);

  const fetchBoardingPass = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await boardingPassService.verifyBoardingPass(boardingPassId);

      if (response.success) {
        setBoardingPass(response.data);
      } else {
        setError("Boarding Pass not found.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Unable to verify this boarding pass."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const copyVerificationLink = async () => {
    try {
      await navigator.clipboard.writeText(verificationURL);
      alert("Verification link copied.");
    } catch {
      alert("Unable to copy link.");
    }
  };

  /* ---------------- Loading State ---------------- */
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border-2 border-slate-200 bg-white p-12 text-center shadow-xl">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-[6px] border-slate-200 border-t-teal-500" />
          <h2 className="mt-8 text-2xl font-bold uppercase tracking-[0.3em] text-slate-800">
            Verifying
          </h2>
          <p className="mt-4 text-slate-500">
            Please wait while we verify authenticity...
          </p>
        </div>
      </section>
    );
  }

  /* ---------------- Error State ---------------- */
  if (error || !boardingPass) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-2xl rounded-3xl border-2 border-red-200 bg-white p-12 text-center shadow-xl">
          <h1 className="mt-6 text-4xl font-black uppercase tracking-wider text-slate-800">
            Invalid Boarding Pass
          </h1>
          <p className="mt-5 text-lg text-slate-500">{error}</p>
        </div>
      </section>
    );
  }

  /* ---------------- Main Boarding Pass Page ---------------- */
  return (
    <>
      {/* Fixed Print-Specific CSS */}
      <style>{`
        @media print {
          @page { size: auto; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important;
          }
          body * { visibility: hidden; }
          #boarding-pass-overlay, #boarding-pass-overlay * { visibility: visible; }
          #boarding-pass-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .print-dark-invert { background: white !important; color: black !important; border: 2px solid #ccc !important; }
          .print-text-invert { color: black !important; }
          .print-hide { display: none !important; }
        }
      `}</style>

      <section
        id="boarding-pass-overlay"
        className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(45,212,191,0.15),rgba(255,255,255,0))] py-12 px-4 flex flex-col items-center justify-center font-sans overflow-y-auto"
      >
        {/* Action Buttons */}
        <div className="relative z-10 w-full max-w-[420px] flex justify-between gap-4 mb-6 print-hide">
          <button
            onClick={copyVerificationLink}
            className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white backdrop-blur-md"
          >
            Copy Link
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 rounded-xl bg-teal-500/20 border border-teal-500/30 px-4 py-2.5 font-semibold text-teal-400 transition hover:bg-teal-500/30 hover:text-teal-300 backdrop-blur-md shadow-[0_0_15px_rgba(20,184,166,0.2)]"
          >
            Save / Print
          </button>
        </div>

        {/* Boarding Pass Container */}
        <div className="relative z-10 w-full max-w-[420px] rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-teal-900/20 border border-white/10 backdrop-blur-xl bg-slate-900/80 print-dark-invert">
          
          {/* Header */}
          <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 print-dark-invert">
            <img
              src="/codex-logo-white.svg"
              alt="CodeX Logo"
              className="w-20 object-contain drop-shadow-md print-hide"
              onError={(e) => {
                e.target.src = "/codex-logo.svg";
                e.target.className = "w-20 object-contain drop-shadow-md print-hide brightness-0 invert";
              }}
            />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400 print-text-invert">
              <Ticket className="w-3.5 h-3.5" /> Digital Pass
            </span>
          </div>

          {/* Event & Attendee Info */}
          <div className="p-6 md:p-8 flex flex-col gap-6 relative">
            {/* Background glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/20 rounded-full blur-[50px] pointer-events-none print-hide"></div>

            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2 print-text-invert">
                {boardingPass.eventName}
              </h1>
              <p className="text-teal-400/80 text-xs font-semibold uppercase tracking-wider print-text-invert">
                {boardingPass.eventDescription}
              </p>
            </div>

            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 text-center print-dark-invert">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 print-text-invert">Attendee</p>
              <h2 className="text-2xl font-bold text-white print-text-invert">
                {boardingPass.studentName}
              </h2>
              {boardingPass.citeNumber && (
                <div className="mt-4 inline-block bg-teal-500/20 border border-teal-500/30 px-4 py-1.5 rounded-lg print-dark-invert">
                  <p className="text-[10px] font-bold text-teal-400/80 uppercase tracking-widest print-text-invert">Cite Number</p>
                  <p className="text-lg font-black text-teal-400 print-text-invert">{boardingPass.citeNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="px-6 md:px-8 pb-6 grid grid-cols-2 gap-3 relative z-10 print-dark-invert">
            <div className="col-span-2 bg-black/40 border border-white/5 rounded-xl p-3 flex justify-between items-center print-dark-invert">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400 print-text-invert" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print-text-invert">QID</span>
              </div>
              <span className="font-mono text-sm text-white font-semibold print-text-invert">{boardingPass.qid}</span>
            </div>

            {(boardingPass.wifiUser || boardingPass.wifiPass) && (
              <div className="col-span-2 sm:col-span-1 bg-black/40 border border-white/5 rounded-xl p-3 print-dark-invert">
                <div className="flex items-center gap-1.5 mb-2 border-b border-white/10 pb-2">
                  <Wifi className="w-3.5 h-3.5 text-teal-500 print-text-invert" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest print-text-invert">Event WiFi</span>
                </div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-500 print-text-invert">ID</span>
                  <span className="text-white print-text-invert">{boardingPass.wifiUser || "-"}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 print-text-invert">PW</span>
                  <span className="text-white print-text-invert">{boardingPass.wifiPass || "-"}</span>
                </div>
              </div>
            )}

            {(boardingPass.loginUser || boardingPass.loginPass) && (
              <div className="col-span-2 sm:col-span-1 bg-black/40 border border-white/5 rounded-xl p-3 print-dark-invert">
                <div className="flex items-center gap-1.5 mb-2 border-b border-white/10 pb-2">
                  <KeyRound className="w-3.5 h-3.5 text-teal-500 print-text-invert" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest print-text-invert">Event Login</span>
                </div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-500 print-text-invert">ID</span>
                  <span className="text-white print-text-invert">{boardingPass.loginUser || "-"}</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500 print-text-invert">PW</span>
                  <span className="text-white print-text-invert">{boardingPass.loginPass || "-"}</span>
                </div>
              </div>
            )}
          </div>

          {/* QR Code Section (Bottom Stub) */}
          <div className="bg-white p-8 flex flex-col items-center text-center relative border-t-2 border-dashed border-slate-300 mt-2">
            {/* Cutouts */}
            <div className="absolute -left-4 -top-4 w-8 h-8 bg-slate-950 rounded-full print-hide"></div>
            <div className="absolute -right-4 -top-4 w-8 h-8 bg-slate-950 rounded-full print-hide"></div>

            <div className="bg-white p-3 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-slate-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  verificationURL
                )}`}
                alt="Boarding Pass QR Code"
                className="w-32 h-32"
              />
            </div>
            
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold flex items-center justify-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" /> Scan to Verify
            </p>
            
            <div className="w-full mt-6 pt-4 border-t border-slate-100">
              <p className="font-bold uppercase tracking-widest text-slate-400 text-[9px] mb-1">
                Pass ID
              </p>
              <p className="font-mono text-sm text-slate-800 font-semibold tracking-wider">
                {boardingPass.boardingPassId}
              </p>
            </div>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default VerifyBoardingPass;
