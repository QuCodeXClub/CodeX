import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { boardingPassService } from "../services/boardingPassService";
import VerificationLayout from "../layout/VerificationLayout";

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

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!boardingPass && !loading ? "Boarding Pass not found." : null)}
      errorTitle="Invalid Boarding Pass"
      verificationURL={verificationURL}
      downloadText="Save / Print"
    >
      {/* 
        Print specific styles to ensure backgrounds and colors are NOT stripped by the browser.
        This forces the printer to output the dark theme exactly as seen on screen.
      */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hide { display: none !important; }
        }
      `}</style>

      {boardingPass && (
        <div 
          className="relative z-10 w-full max-w-[1100px] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(46,197,212,0.12)] border border-[#2EC5D4]/20 bg-[#121212]"
        >
          {/* 
            ====================================================
            LEFT STUB SECTION
            ====================================================
          */}
          <div className="w-full md:w-[32%] bg-[#181818] flex flex-col md:flex-row relative border-b-2 md:border-b-0 md:border-r-2 border-dashed border-[#444444]">
            
            {/* Bottom Cutouts for the Dashed Line */}
            <div className="absolute -right-3 -bottom-3 md:-bottom-4 md:-right-4 w-6 h-6 md:w-8 md:h-8 bg-bg-soft rounded-full z-20 print-hide shadow-inner"></div>

            {/* Vertical Edge Text */}
            <div className="hidden md:flex items-center justify-center w-12 border-r border-[#333333]">
              <span 
                className="transform -rotate-180 whitespace-nowrap text-[#666666] font-mono text-[10px] tracking-[0.4em] uppercase" 
                style={{ writingMode: 'vertical-rl' }}
              >
                Boarding Pass : {boardingPass.eventName}
              </span>
            </div>

            {/* Stub Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:py-12 gap-6 relative z-10">
              <img
                src="/codex-logo.svg"
                alt="CodeX Logo"
                className="w-28 md:w-36 object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.src = "/codex-logo.svg";
                  e.target.className = "w-28 md:w-36 object-contain drop-shadow-md brightness-0 invert";
                }}
              />

              {/* QR Code */}
              <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(46,197,212,0.2)]">
                <img
                  src={boardingPass.qrCodeImage}
                  alt="Verification QR Code"
                  className="w-32 h-32 md:w-40 md:h-40"
                />
              </div>
              
              <div className="text-center">
                <span className="font-mono text-[#2EC5D4] text-xs uppercase tracking-widest font-bold">
                  Scan to Verify
                </span>
                <p className="text-[#888888] font-mono text-[9px] uppercase tracking-wider mt-2">
                  qucodex.com
                </p>
              </div>
            </div>
          </div>

          {/* 
            ====================================================
            RIGHT MAIN SECTION
            ====================================================
          */}
          <div className="w-full md:w-[68%] p-8 md:p-12 flex flex-col relative overflow-hidden bg-[#121212]">
            
            {/* Tech Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2EC5D4]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'linear-gradient(#2EC5D4 1px, transparent 1px), linear-gradient(90deg, #2EC5D4 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>

            {/* Header / Meta */}
            <div className="relative z-10 flex flex-wrap justify-between items-start border-b border-[#333333] pb-4 mb-6 md:mb-8 gap-4">
              <div className="flex items-center gap-3">
                
                <span className="font-mono text-[10px] md:text-xs text-[#AAAAAA] uppercase tracking-widest">
                  CodeX Event Administration
                </span>
              </div>
              <span className="font-mono text-[10px] md:text-xs text-[#2EC5D4] tracking-[0.2em]">
                QID: {boardingPass.qid}
              </span>
            </div>

            {/* Attendee Name */}
            <div className="relative z-10 mb-8 md:mb-12">
              <h1 className="text-5xl md:text-7xl font-sans font-bold uppercase text-[#F5F5F5] leading-none mb-2 tracking-wide">
                {boardingPass.studentName}
              </h1>
            </div>

            {/* Information Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
              
              {/* Event Info */}
              <div className="sm:col-span-2">
                <p className="font-mono text-[10px] text-[#2EC5D4] uppercase tracking-[0.2em] mb-1">
                  Event
                </p>
                <p className="font-sans text-xl md:text-2xl font-bold uppercase text-[#F5F5F5] tracking-wide">
                  {boardingPass.eventName}
                </p>
                <p className="font-mono text-[11px] text-[#888888] uppercase tracking-wider mt-1.5">
                  {boardingPass.eventDescription}
                </p>
              </div>

              {/* Cite Number */}
              <div>
                <p className="font-mono text-[10px] text-[#2EC5D4] uppercase tracking-[0.2em] mb-1">
                  Cite / Number
                </p>
                <p className="font-sans text-2xl font-bold uppercase text-[#F5F5F5]">
                  {boardingPass.citeNumber || "TBD"}
                </p>
              </div>

              {/* Boarding Pass ID */}
              <div>
                <p className="font-mono text-[10px] text-[#2EC5D4] uppercase tracking-[0.2em] mb-1">
                  Boarding Pass ID
                </p>
                <p className="font-mono text-lg font-bold text-[#F5F5F5]">
                  {boardingPass.boardingPassId.split('-')[0]} 
                </p>
              </div>

              {/* Conditional Event Credentials */}
              {(boardingPass.wifiUser || boardingPass.wifiPass || boardingPass.loginUser || boardingPass.loginPass) && (
                <div className="sm:col-span-2 grid grid-cols-2 gap-6 pt-6 border-t border-[#333333] mt-2">
                  
                  {/* WiFi Credentials */}
                  {(boardingPass.wifiUser || boardingPass.wifiPass) && (
                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2EC5D4]/20">
                      <p className="font-mono text-[9px] text-[#2EC5D4] uppercase tracking-widest mb-3 border-b border-[#333333] pb-2">
                        Network Access
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] text-[#666666] uppercase">SSID</span>
                        <span className="font-mono text-xs text-[#F5F5F5] font-bold">{boardingPass.wifiUser || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-[#666666] uppercase">PASS</span>
                        <span className="font-mono text-xs text-[#F5F5F5] font-bold">{boardingPass.wifiPass || "-"}</span>
                      </div>
                    </div>
                  )}

                  {/* Login Credentials */}
                  {(boardingPass.loginUser || boardingPass.loginPass) && (
                    <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2EC5D4]/20">
                      <p className="font-mono text-[9px] text-[#2EC5D4] uppercase tracking-widest mb-3 border-b border-[#333333] pb-2">
                        System Login
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-[10px] text-[#666666] uppercase">USER</span>
                        <span className="font-mono text-xs text-[#F5F5F5] font-bold">{boardingPass.loginUser || "-"}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] text-[#666666] uppercase">KEY</span>
                        <span className="font-mono text-xs text-[#F5F5F5] font-bold">{boardingPass.loginPass || "-"}</span>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
          
        </div>
      )}
    </VerificationLayout>
  );
};

export default VerifyBoardingPass;