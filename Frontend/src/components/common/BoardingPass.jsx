import React, { useState, useEffect } from "react";

// 1. Barcode Component
const Barcode = ({ value }) => {
  if (!value) return null;
  const generateBars = (str) => {
    const hash = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const bars = [];
    for (let i = 0; i < 35; i++) {
      const width = ((hash + i * 13) % 3) + 1;
      const space = ((hash + i * 19) % 3) + 1;
      bars.push({ width, space });
    }
    return bars;
  };
  const bars = generateBars(value);
  return (
    <div className="flex flex-col items-center justify-center select-none w-full max-w-[180px] mx-auto">
      <div className="relative h-6 flex items-end overflow-hidden w-full opacity-80 hover:opacity-100 transition-opacity duration-300">
        <svg className="w-full h-full text-white" viewBox="0 0 160 30" fill="currentColor" preserveAspectRatio="none">
          {(() => {
            let x = 0;
            return bars.map((bar, idx) => {
              const rect = <rect key={idx} x={x} y="0" width={bar.width} height="30" />;
              x += bar.width + bar.space;
              return rect;
            });
          })()}
        </svg>
        <div data-html2canvas-ignore="true" className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#00f0ff]/20 to-transparent animate-[barcode-sweep_3s_infinite_linear]"></div>
      </div>
      <span className="font-mono text-[7px] tracking-[0.25em] text-slate-400 mt-1 uppercase">{value}</span>
    </div>
  );
};

// 2. CX Cleared Stamp Component
const BoardingStamp = () => {
  return (
    <div className="border-2 border-emerald-500/30 text-emerald-500/70 px-2.5 py-0.5 rounded font-display text-center select-none pointer-events-none transform rotate-[-8deg] backdrop-blur-[1px] animate-[stamp-in_1.2s_ease-out_0.5s_both] shadow-[0_0_8px_rgba(16,185,129,0.05)]">
      <div className="text-[7px] tracking-[0.25em] font-bold">CODEX</div>
      <div className="text-[10px] font-black tracking-widest leading-none my-0.5">CLEARED</div>
      <div className="text-[6px] tracking-[0.15em] opacity-80 uppercase font-mono">FOR INNOVATION // 2026</div>
    </div>
  );
};

// 3. Passenger Details Component
const PassengerInfo = ({ name }) => {
  return (
    <div className="space-y-0.5 text-left">
      <span className="font-mono text-[9px] text-[#2EC5D4] tracking-[0.25em] block font-bold">ATTENDEE</span>
      <h2 className="font-display font-extrabold text-2.5xl md:text-3.5xl text-slate-900 tracking-tight uppercase leading-none truncate">
        {name}
      </h2>
    </div>
  );
};

// 4. Verification QR Code Section
const QRCodeSection = ({ embeddedQr }) => {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/80 bg-white relative group w-full max-w-[125px] mx-auto hover:border-[#2EC5D4]/40 transition-all duration-300">
      {/* Corner Brackets */}
      <div className="absolute -top-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-t-2 border-l-2 border-[#2EC5D4]"></div>
      <div className="absolute -top-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-t-2 border-r-2 border-[#2EC5D4]"></div>
      <div className="absolute -bottom-[1.5px] -left-[1.5px] w-2.5 h-2.5 border-b-2 border-l-2 border-[#2EC5D4]"></div>
      <div className="absolute -bottom-[1.5px] -right-[1.5px] w-2.5 h-2.5 border-b-2 border-r-2 border-[#2EC5D4]"></div>

      <div className="relative w-20 h-20 flex items-center justify-center bg-white">
        <img src={embeddedQr} alt="Verify QR" className="w-full h-full object-contain" />
        <div data-html2canvas-ignore="true" className="absolute left-0 w-full h-[1.5px] bg-[#2EC5D4] shadow-[0_0_6px_#2EC5D4] animate-[qr-sweep_2.5s_infinite_linear] pointer-events-none"></div>
      </div>
      <div className="mt-2 text-center select-none">
        <span className="font-mono text-[8px] text-[#2EC5D4] tracking-widest font-bold uppercase block">
          SCAN TO VERIFY
        </span>
        <span className="font-mono text-[7px] text-slate-400 tracking-wider block mt-0.5">
          qucodex.com/verify
        </span>
      </div>
    </div>
  );
};

// 5. SVG Custom Icons
const ChairIcon = () => (
  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V10a2 2 0 00-2-2H7a2 2 0 00-2 2v11m14 0H5m14 0h-2m-8 0H5m4 0v-4m6 0v-4m-6 4h6" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PinIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SeatIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6a3 3 0 11-6 0 3 3 0 016 0zm6 12a3 3 0 01-3 3H6a3 3 0 01-3-3v-3a3 3 0 013-3h12a3 3 0 013 3v3z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const CertificateIcon = () => (
  <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MonitorIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BoardingPass = ({
  studentName,
  recipientName, // support both prop names for compatibility
  eventName,
  eventDescription,
  qrCodeImage,
  qrCode, // support both prop names for compatibility
  qid,
  citeNumber,
  boardingPassId,
  certificateId, // support both prop names for compatibility
  wifiUser,
  wifiPass,
  loginUser,
  loginPass,
  prizePool = "₹20,000",
  certificateType = "FOR EVERY VALID SUBMISSION",
  mode = "100% ONLINE",
  teamSize = "SOLO / TEAM (UP TO 3)",
  signature = "Let's Build the Future.",
}) => {
  // Normalize dynamic properties
  const displayName = studentName || recipientName || "Attendee Name";
  const displayEvent = eventName || "CodeX Hackathon 2026";
  const displayQr = qrCodeImage || qrCode || "/favicon.svg";
  const displayQid = qid || "QID-9876";
  const displayPassId = boardingPassId || certificateId || "TEST-ID";
  const displayDesk = citeNumber || "Desk 42";

  const [copiedField, setCopiedField] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Dynamic QR Code Canvas Logo Embedder
  const [embeddedQr, setEmbeddedQr] = useState(displayQr);

  useEffect(() => {
    if (!displayQr) return;

    const qrImg = new Image();
    if (displayQr.startsWith("http://") || displayQr.startsWith("https://")) {
      qrImg.crossOrigin = "anonymous";
    }
    qrImg.src = displayQr;

    qrImg.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");

      // Draw the QR Code base
      ctx.drawImage(qrImg, 0, 0, 300, 300);

      // Load the CodeX logo
      const logoImg = new Image();
      logoImg.src = "/apple-touch-icon.png";

      logoImg.onload = () => {
        const logoSize = 65;
        const x = (300 - logoSize) / 2;
        const y = (300 - logoSize) / 2;

        // Solid dark background for the logo
        ctx.fillStyle = "#0a0f18";
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 10);
        } else {
          ctx.rect(x - 5, y - 5, logoSize + 10, logoSize + 10);
        }
        ctx.fill();

        // Neon cyan border around the logo backing
        ctx.strokeStyle = "#2EC5D4";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw the branding logo in the center of the QR
        ctx.drawImage(logoImg, x, y, logoSize, logoSize);

        setEmbeddedQr(canvas.toDataURL("image/png"));
      };

      logoImg.onerror = () => {
        setEmbeddedQr(canvas.toDataURL("image/png"));
      };
    };

    qrImg.onerror = () => {
      setEmbeddedQr(displayQr);
    };
  }, [displayQr]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full max-w-[980px] mx-auto select-none print:shadow-none print:border-0 p-1 md:p-3">
      {/* Custom Styles Injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Charm:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;700&display=swap');

        .font-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .charm-bold {
          font-family: 'Charm', cursive;
          font-weight: 700;
        }

        /* Continuous subtle float animation for the ticket */
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float-card 6s ease-in-out infinite;
        }

        /* QR Sweep scanline */
        @keyframes qr-sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }

        /* Barcode Sweep */
        @keyframes barcode-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Stamp animation */
        @keyframes stamp-in {
          0% { transform: scale(3.5) rotate(-35deg); opacity: 0; }
          70% { transform: scale(0.95) rotate(-10deg); opacity: 1; }
          100% { transform: scale(1) rotate(-8deg); opacity: 1; }
        }
      `}</style>

      {/* Main Unified Boarding Pass Shell */}
      <div
        id="boarding-pass-download-area"
        className={`w-full rounded-[24px] border border-slate-300/80 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden transition-all duration-700 ease-out hover:shadow-[0_25px_60px_rgba(0,0,0,0.22)] animate-float ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex flex-col lg:flex-row items-stretch w-full relative z-10">
          
          {/* ====================================================
              1. LEFT-MOST VERTICAL PANEL (White Sidebar)
              ==================================================== */}
          <div className="hidden sm:flex flex-col items-center justify-between border-r border-slate-200/80 bg-white w-12 shrink-0 pt-20 pb-6 relative z-0">
            {/* Vertical Barcode Lines */}
            <div className="flex flex-col gap-[2px] items-center opacity-75">
              {[2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2].map((h, i) => (
                <div key={i} className="bg-slate-900 w-4" style={{ height: `${h}px` }}></div>
              ))}
            </div>

            {/* Vertical Sidebar Rotated Text */}
            <span className="font-mono text-[8px] tracking-[0.25em] text-slate-500 uppercase whitespace-nowrap rotate-[-90deg] origin-center my-12">
              CODEX // DIGITAL ACCESS
            </span>

            {/* Cyan Diagonal Slashing Stripes */}
            <div className="flex flex-col gap-1 w-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="h-1 bg-[#2EC5D4] transform -skew-y-12"></div>
              ))}
            </div>
          </div>

          {/* ==========================================
              2. MAIN BOARDING TICKET SECTION (Light 63%)
              ========================================== */}
          <div className="flex-1 p-6 md:p-7 flex flex-col justify-between gap-5 relative bg-[#f8fafc] overflow-hidden">
            {/* Subtle Grid Watermark Overlay */}
            <div className="absolute inset-0 bg-size-[24px_24px] bg-[linear-gradient(to_right,rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.035)_1px,transparent_1px)] pointer-events-none z-0"></div>

            {/* Dotted Network Nodes Graph Watermark */}
            <svg className="absolute right-36 top-6 w-56 h-36 text-slate-300 opacity-[0.18] pointer-events-none z-0" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="0.5">
              <circle cx="20" cy="30" r="1" fill="currentColor" />
              <circle cx="80" cy="20" r="1" fill="currentColor" />
              <circle cx="140" cy="40" r="1" fill="currentColor" />
              <circle cx="180" cy="20" r="1" fill="currentColor" />
              <circle cx="110" cy="70" r="1" fill="currentColor" />
              <line x1="20" y1="30" x2="80" y2="20" />
              <line x1="80" y1="20" x2="140" y2="40" />
              <line x1="140" y1="40" x2="180" y2="20" />
              <line x1="80" y1="20" x2="110" y2="70" />
              <line x1="110" y1="70" x2="140" y2="40" />
            </svg>

            {/* Chamfered Brand Header (Absolute Top Left) */}
            <div 
              className="absolute top-0 left-0 bg-[#0c1322] text-white flex flex-col justify-center pl-4 w-36 h-[58px] z-10 select-none border-b border-r border-slate-800"
              style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 82% 100%, 0 100%)" }}
            >
              <div className="flex items-center gap-1.5">
                {/* Mini Hexagon logo */}
                <div className="relative w-5 h-5 flex items-center justify-center text-[7px] text-[#2EC5D4] font-bold">
                  <svg className="absolute inset-0 w-full h-full text-[#2EC5D4]/20" viewBox="0 0 100 100" fill="currentColor">
                    <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                  </svg>
                  <span className="relative z-10 text-[7px] font-display font-extrabold text-[#2EC5D4]">CX</span>
                </div>
                <span className="font-display font-extrabold text-[14px] tracking-widest text-white leading-none">CODEX</span>
              </div>
              <span className="text-[6px] tracking-[0.15em] text-slate-400 uppercase font-mono mt-1">
                BUILD • CODE • INNOVATE
              </span>
            </div>

            {/* Desktop-only Boarding Stamp overlay */}
            <div className="hidden sm:block absolute right-44 top-14 z-20">
              <BoardingStamp />
            </div>

            {/* Inner Content Block */}
            <div className="flex flex-col md:flex-row gap-5 items-stretch relative z-10 pt-8 md:pt-4">
              
              {/* Main Ticket Info (Left) */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                
                {/* Header row */}
                <div className="flex items-center justify-between pl-32">
                  <span className="font-mono text-[9px] text-[#2EC5D4] tracking-[0.2em] font-bold">
                    BOARDING PASS // ACCESS GRANTED
                  </span>
                  {/* Subtle airplane icon */}
                  <span className="text-slate-400 text-xs transform rotate-45">✈</span>
                </div>

                {/* Passenger Info & Stamp on Mobile */}
                <div className="flex justify-between items-start">
                  <PassengerInfo name={displayName} />
                  <div className="block sm:hidden shrink-0 mt-1">
                    <BoardingStamp />
                  </div>
                </div>

                {/* Event Row & Info blocks */}
                <div className="grid grid-cols-12 gap-3.5 my-1">
                  <div className="col-span-12 md:col-span-7">
                    <span className="font-mono text-[8px] text-[#2EC5D4] tracking-[0.2em] block font-bold">EVENT</span>
                    <h3 className="font-display font-bold text-[15px] text-slate-900 uppercase tracking-wide leading-none mt-0.5">
                      {displayEvent}
                    </h3>
                    <p className="font-sans text-[10px] text-slate-500 font-semibold tracking-wider leading-relaxed mt-1 uppercase">
                      {eventDescription || "A 24-HOUR CODING MARATHON \nBUILD. INNOVATE. IMPACT."}
                    </p>
                  </div>
                  
                  {/* Desk Info block */}
                  <div className="col-span-6 md:col-span-2.5 flex items-start gap-1.5 border-l border-slate-200 pl-3">
                    <ChairIcon />
                    <div>
                      <span className="font-mono text-[8px] text-[#2EC5D4] tracking-[0.15em] block font-bold">DESK</span>
                      <span className="font-display font-bold text-xs text-slate-900 block mt-0.5 truncate leading-none">D-{displayDesk}</span>
                    </div>
                  </div>

                  {/* Pass ID Info block */}
                  <div className="col-span-6 md:col-span-2.5 flex items-start gap-1.5 border-l border-slate-200 pl-3">
                    <ClipboardIcon />
                    <div>
                      <span className="font-mono text-[8px] text-[#2EC5D4] tracking-[0.15em] block font-bold">PASS ID</span>
                      <span className="font-display font-bold text-xs text-slate-900 block mt-0.5 truncate leading-none">{displayPassId}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Verification QR Code (Right) */}
              <div className="w-full md:w-36 shrink-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-5">
                <QRCodeSection embeddedQr={embeddedQr} />
              </div>
            </div>

            {/* Technical Flight Grid Details Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-dashed border-slate-200/80 py-2.5 my-0.5 font-mono text-[10px] relative z-10">
              {/* Date Column */}
              <div className="flex items-center gap-2">
                <div className="p-1 bg-slate-100 rounded text-slate-500"><CalendarIcon /></div>
                <div>
                  <span className="text-[7.5px] text-[#2EC5D4] tracking-wider block font-bold">DATE</span>
                  <span className="text-slate-900 font-bold block leading-none">7 AUG 2026</span>
                  <span className="text-slate-400 text-[7px] block mt-0.5">8:00 PM IST</span>
                </div>
              </div>

              {/* Duration Column */}
              <div className="flex items-center gap-2 border-l border-slate-200/80 pl-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-500"><ClockIcon /></div>
                <div>
                  <span className="text-[7.5px] text-[#2EC5D4] tracking-wider block font-bold">DURATION</span>
                  <span className="text-slate-900 font-bold block leading-none font-sans">48 HOURS</span>
                  <span className="text-slate-400 text-[7px] block mt-0.5">NON-STOP CODE</span>
                </div>
              </div>

              {/* Destination Column */}
              <div className="flex items-center gap-2 border-l border-slate-200/80 pl-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-500"><PinIcon /></div>
                <div>
                  <span className="text-[7.5px] text-[#2EC5D4] tracking-wider block font-bold">DESTINATION</span>
                  <span className="text-slate-900 font-bold block leading-none font-sans">INNOVATION</span>
                  <span className="text-slate-400 text-[7px] block mt-0.5">+ IMPACT</span>
                </div>
              </div>

              {/* Seat Column */}
              <div className="flex items-center gap-2 border-l border-slate-200/80 pl-2.5">
                <div className="p-1 bg-slate-100 rounded text-slate-500"><SeatIcon /></div>
                <div>
                  <span className="text-[7.5px] text-[#2EC5D4] tracking-wider block font-bold">SEAT</span>
                  <span className="text-slate-900 font-bold block leading-none">AI-01</span>
                  <span className="text-slate-400 text-[7px] block mt-0.5">BUILDER</span>
                </div>
              </div>
            </div>

            {/* Bottom Row Credentials strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1.5 relative z-10">
              
              {/* Network Credentials Strip */}
              <div className="bg-slate-100/50 border border-slate-200/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-200/40">
                  <span className="text-[#2EC5D4] text-xs">📡</span>
                  <span className="font-mono text-[8px] font-bold text-slate-600 tracking-wider">NETWORK ACCESS</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">SSID</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{wifiUser || "codex_dev1"}</span>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onClick={() => handleCopy(wifiUser || "codex_dev1", "ssid")}
                        className="bg-[#2EC5D4]/10 text-[#2EC5D4] hover:bg-[#2EC5D4]/20 border border-[#2EC5D4]/20 rounded px-1.5 py-0.5 text-[8px] font-bold cursor-pointer font-sans"
                      >
                        {copiedField === "ssid" ? "✓" : "COPY"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PASSWORD</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{wifiPass || "D@rshan@adm"}</span>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onClick={() => handleCopy(wifiPass || "D@rsh@n@adm", "pass")}
                        className="bg-[#2EC5D4]/10 text-[#2EC5D4] hover:bg-[#2EC5D4]/20 border border-[#2EC5D4]/20 rounded px-1.5 py-0.5 text-[8px] font-bold cursor-pointer font-sans"
                      >
                        {copiedField === "pass" ? "✓" : "COPY"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ENCRYPTION</span>
                    <span className="font-bold text-slate-800">WPA3-ENTERPRISE</span>
                  </div>
                </div>
              </div>

              {/* System Login Strip */}
              <div className="bg-slate-100/50 border border-slate-200/60 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-200/40">
                  <span className="text-[#2EC5D4] text-xs">👤</span>
                  <span className="font-mono text-[8px] font-bold text-slate-600 tracking-wider">SYSTEM LOGIN</span>
                </div>
                <div className="space-y-1 font-mono text-[9px] text-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">USER</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 truncate max-w-[80px]">{loginUser || "Darshan Kumar"}</span>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onClick={() => handleCopy(loginUser || "Darshan Kumar", "user")}
                        className="bg-[#2EC5D4]/10 text-[#2EC5D4] hover:bg-[#2EC5D4]/20 border border-[#2EC5D4]/20 rounded px-1.5 py-0.5 text-[8px] font-bold cursor-pointer font-sans"
                      >
                        {copiedField === "user" ? "✓" : "COPY"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">ACCESS KEY</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800">{loginPass || "MKC5236"}</span>
                      <button
                        type="button"
                        data-html2canvas-ignore="true"
                        onClick={() => handleCopy(loginPass || "MKC5236", "key")}
                        className="bg-[#2EC5D4]/10 text-[#2EC5D4] hover:bg-[#2EC5D4]/20 border border-[#2EC5D4]/20 rounded px-1.5 py-0.5 text-[8px] font-bold cursor-pointer font-sans"
                      >
                        {copiedField === "key" ? "✓" : "COPY"}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ROLE</span>
                    <span className="font-bold text-slate-800 font-sans text-[8px] bg-slate-200 px-1 rounded uppercase">ATTENDEE</span>
                  </div>
                </div>
              </div>

              {/* Verified Shield Badge strip */}
              <div className="bg-gradient-to-b from-[#2EC5D4]/10 to-[#2EC5D4]/5 border border-[#2EC5D4]/20 rounded-xl p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Dotted Globe Watermark Background */}
                <svg className="absolute -bottom-6 -right-6 w-20 h-20 text-[#2EC5D4] opacity-[0.06] pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
                  <circle cx="50" cy="50" r="45" />
                  <circle cx="50" cy="50" r="30" />
                  <ellipse cx="50" cy="50" rx="45" ry="15" />
                  <ellipse cx="50" cy="50" rx="15" ry="45" />
                  <line x1="50" y1="5" x2="50" y2="95" />
                  <line x1="5" y1="50" x2="95" y2="50" />
                </svg>

                {/* Shield Icon with Star */}
                <svg className="w-6 h-6 text-[#2EC5D4] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>

                <span className="font-mono text-[8px] text-[#2EC5D4] tracking-[0.15em] font-bold uppercase mt-1 relative z-10">
                  VERIFIED ACCESS
                </span>
                <span className="font-mono text-[7px] text-slate-400 tracking-wider block relative z-10">
                  ALL SYSTEMS GO
                </span>
              </div>
            </div>
          </div>

          {/* ==========================================
              3. PERFORATION LINE WITH NOTCHES
              ========================================== */}
          <div className="relative flex lg:flex-col items-center justify-center py-4 lg:py-0 select-none bg-[#f8fafc] lg:bg-transparent">
            {/* Desktop notches & vertical line */}
            <div className="hidden lg:block absolute top-0 -translate-y-1/2 w-6 h-6 rounded-full bg-bg border-b border-slate-300 z-20"></div>
            <div className="hidden lg:block absolute bottom-0 translate-y-1/2 w-6 h-6 rounded-full bg-bg border-t border-slate-300 z-20"></div>
            <div className="hidden lg:block h-full border-l-2 border-dotted border-slate-300"></div>

            {/* Mobile notches & horizontal line */}
            <div className="block lg:hidden absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full bg-bg border-r border-slate-300 z-20"></div>
            <div className="block lg:hidden absolute right-0 translate-x-1/2 w-6 h-6 rounded-full bg-bg border-l border-slate-300 z-20"></div>
            <div className="block lg:hidden w-full border-t-2 border-dotted border-slate-300"></div>
          </div>

          {/* ==========================================
              4. TICKET STUB SECTION (Dark 25%)
              ========================================== */}
          <div className="w-full lg:w-[25%] p-6 flex flex-col justify-between gap-5 bg-[#0a0f18] text-white relative">
            {/* Slash pattern top right */}
            <div className="absolute top-2 right-4 flex gap-0.5 text-[#2EC5D4]/30 text-[10px] pointer-events-none select-none tracking-widest">
              ///////
            </div>

            {/* Stub Header brand */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="relative w-5 h-5 flex items-center justify-center text-[7px] text-[#2EC5D4] font-bold">
                <svg className="absolute inset-0 w-full h-full text-[#2EC5D4]/20" viewBox="0 0 100 100" fill="currentColor">
                  <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
                </svg>
                <span className="relative z-10 text-[7px] font-display font-extrabold text-[#2EC5D4]">CX</span>
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider leading-none">
                  {displayEvent}
                </h4>
                <span className="font-mono text-[7px] text-[#2EC5D4] tracking-widest uppercase block mt-0.5">
                  AI • BUILD • INNOVATE
                </span>
              </div>
            </div>

            {/* Vertical Ticket Specifications list */}
            <div className="space-y-3.5 my-1 text-left font-mono text-[9px]">
              {/* Prize Pool */}
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-slate-900 border border-slate-800 rounded select-none">
                  <TrophyIcon />
                </div>
                <div>
                  <span className="text-[7px] text-slate-500 block uppercase tracking-wider">PRIZE POOL</span>
                  <span className="text-white text-[10px] font-bold block">{prizePool}</span>
                </div>
              </div>

              {/* Certificate */}
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-slate-900 border border-slate-800 rounded select-none">
                  <CertificateIcon />
                </div>
                <div>
                  <span className="text-[7px] text-slate-500 block uppercase tracking-wider">CERTIFICATE</span>
                  <span className="text-white text-[9px] font-bold block uppercase leading-tight">{certificateType}</span>
                </div>
              </div>

              {/* Mode */}
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-slate-900 border border-slate-800 rounded select-none">
                  <MonitorIcon />
                </div>
                <div>
                  <span className="text-[7px] text-slate-500 block uppercase tracking-wider">MODE</span>
                  <span className="text-white text-[10px] font-bold block">{mode}</span>
                </div>
              </div>

              {/* Team Size */}
              <div className="flex items-center gap-2.5">
                <div className="p-1 bg-slate-900 border border-slate-800 rounded select-none">
                  <UsersIcon />
                </div>
                <div>
                  <span className="text-[7px] text-slate-500 block uppercase tracking-wider">TEAM SIZE</span>
                  <span className="text-white text-[10px] font-bold block uppercase">{teamSize}</span>
                </div>
              </div>
            </div>

            {/* Handwritten Signature Script */}
            <div className="flex items-center justify-between text-left my-1 pr-2">
              <span className="charm-bold text-[#2EC5D4] text-[15px] select-none leading-none rotate-[-4deg]">
                {signature}
              </span>
              <span className="text-[#2EC5D4] text-xs transform rotate-45 select-none animate-[pulse_3s_infinite]">
                ✈
              </span>
            </div>

            {/* Barcode & Community label */}
            <div className="border-t border-slate-800/80 pt-3">
              <Barcode value={displayPassId} />
              <span className="font-mono text-[7px] tracking-[0.25em] text-[#2EC5D4] uppercase block mt-1">
                CODEX COMMUNITY
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardingPass;
