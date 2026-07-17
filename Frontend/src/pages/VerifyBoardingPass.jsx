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
          
          body * {
            visibility: hidden;
          }

          #boarding-pass-overlay, #boarding-pass-overlay * {
            visibility: visible;
          }

          #boarding-pass-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
          }
        }
      `}</style>

      <section
        id="boarding-pass-overlay"
        className="min-h-screen bg-[#Faf9f6] py-8 px-4 flex flex-col items-center justify-center font-sans overflow-y-auto"
      >
        {/* Action Buttons */}
        <div className="relative z-10 w-full max-w-[800px] flex flex-wrap justify-end gap-4 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700 shadow-md"
          >
            Download PDF
          </button>
          <button
            onClick={copyVerificationLink}
            className="rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-600 shadow-sm"
          >
            Copy Link
          </button>
        </div>

        {/* Boarding Pass Container */}
        <div className="relative z-10 w-full max-w-[800px] bg-white shadow-2xl print:shadow-none print:w-full print:h-auto rounded-3xl overflow-hidden border border-slate-200 flex flex-col md:flex-row">
          
          {/* Left/Top Section (Main Info) */}
          <div className="flex-1 bg-white p-8 md:p-10 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <img
                src="/university-logo.svg"
                alt="University Logo"
                className="w-20 md:w-24 object-contain"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/50 bg-teal-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700 shadow-sm">
                <Ticket className="w-3.5 h-3.5" /> Boarding Pass
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 mb-1">
                {boardingPass.eventName}
              </h1>
              <p className="text-slate-500 text-sm">{boardingPass.eventDescription}</p>
            </div>

            <div className="mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attendee Name</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                {boardingPass.studentName}
              </h2>
            </div>

            {/* Grid for QID and Wifi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto border-t border-slate-100 pt-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> QID
                </p>
                <p className="font-mono text-lg text-slate-700 font-semibold">{boardingPass.qid}</p>
              </div>

              {(boardingPass.wifiUser || boardingPass.wifiPass) && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5" /> Event WiFi
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 font-mono text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">ID:</span>
                      <span className="font-semibold text-slate-800">{boardingPass.wifiUser || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PW:</span>
                      <span className="font-semibold text-slate-800">{boardingPass.wifiPass || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}

              {(boardingPass.loginUser || boardingPass.loginPass) && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" /> Event Login
                  </p>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 font-mono text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500">ID:</span>
                      <span className="font-semibold text-slate-800">{boardingPass.loginUser || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PW:</span>
                      <span className="font-semibold text-slate-800">{boardingPass.loginPass || "N/A"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right/Bottom Section (Stub) */}
          <div className="w-full md:w-[250px] bg-slate-900 p-8 flex flex-col justify-between items-center text-center relative border-t md:border-t-0 md:border-l border-dashed border-slate-700">
            {/* Cutout circles for realism */}
            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#Faf9f6] rounded-full"></div>
            
            <div className="w-full">
              <img
                src="/codex-logo-white.svg"
                alt="CodeX Logo"
                className="w-16 md:w-20 object-contain mx-auto mb-6 opacity-90"
                onError={(e) => {
                  // Fallback if white logo doesn't exist
                  e.target.src = "/codex-logo.svg";
                  e.target.className = "w-16 md:w-20 object-contain mx-auto mb-6 brightness-0 invert opacity-90";
                }}
              />
              
              <div className="bg-white p-3 rounded-xl shadow-inner inline-block">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    verificationURL
                  )}`}
                  alt="Boarding Pass QR Code"
                  className="w-24 h-24 md:w-32 md:h-32"
                />
              </div>
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" /> Scan to Verify
              </p>
            </div>

            <div className="w-full mt-8 pt-6 border-t border-slate-800">
              <p className="font-bold uppercase tracking-widest text-slate-500 text-[10px] mb-1">
                Pass ID
              </p>
              <p className="font-mono text-xs text-white truncate px-2">
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
