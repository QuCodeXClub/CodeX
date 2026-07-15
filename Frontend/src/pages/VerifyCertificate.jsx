import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { certificateService } from "../services/certificateService";

const VerifyCertificate = () => {
  const { certificateId } = useParams();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  const verificationURL = `${window.location.origin}/verify-certificate/${certificateId}`;

  useEffect(() => {
    fetchCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await certificateService.verifyCertificate(certificateId);

      if (response.success) {
        setCertificate(response.data);
      } else {
        setError("Certificate not found.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Unable to verify this certificate."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-[6px] border-slate-200 border-t-cyan-500" />
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
  if (error || !certificate) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-2xl rounded-3xl border-2 border-red-200 bg-white p-12 text-center shadow-xl">
          <h1 className="mt-6 text-4xl font-black uppercase tracking-wider text-slate-800">
            Invalid Certificate
          </h1>
          <p className="mt-5 text-lg text-slate-500">{error}</p>
        </div>
      </section>
    );
  }

  /* ---------------- Main Certificate Page ---------------- */
  return (
    <>
      {/* Fixed Print-Specific CSS
       */}
      <style>{`
        @media print {
          @page { size: landscape; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important;
          }
          
          /* 1. Hide everything on the page without collapsing the layout completely */
          body * {
            visibility: hidden;
          }

          /* 2. Show only the certificate wrapper and its children */
          #certificate-overlay, #certificate-overlay * {
            visibility: visible;
          }

          /* 3. Pull the certificate to the absolute top-left corner of the paper */
          #certificate-overlay {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 20px !important; /* Small padding so it doesn't clip off printer edges */
            background: white !important;
          }
        }
      `}</style>

      <section
        id="certificate-overlay"
        className="min-h-screen bg-[#Faf9f6] py-8 px-4 flex flex-col items-center justify-center font-sans overflow-y-auto"
      >
        {/* Action Buttons */}
        <div className="relative z-10 w-full max-w-[1000px] flex flex-wrap justify-end gap-4 mb-6 print:hidden">
          <button
            onClick={handlePrint}
            className="rounded-lg bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:bg-slate-700 shadow-md"
          >
            Download PDF
          </button>
          <button
            onClick={copyVerificationLink}
            className="rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 shadow-sm"
          >
            Copy Link
          </button>
        </div>

        {/* Certificate Container */}
        <div className="relative z-10 w-full max-w-[1000px] bg-white shadow-2xl print:shadow-none print:w-full print:h-full print:max-w-none md:aspect-[1.414/1] flex flex-col p-3 md:p-5 border-[10px] border-[#e5e7eb] border-double rounded-sm">
          {/* Inner Border container */}
          <div className="relative border-4 border-[#d1d5db] flex-1 w-full p-4 md:p-8 flex flex-col justify-between text-center bg-[#fffdf9] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-start w-full shrink-0">
              <img
                src="/university-logo.svg"
                alt="University Logo"
                className="w-16 md:w-28 object-contain"
              />

              <div className="flex flex-col items-center px-2 md:px-4">
                <span className="inline-flex rounded-full border border-emerald-400/50 bg-emerald-50 px-3 py-1 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] text-emerald-700 mb-2 md:mb-4 shadow-sm">
                  ✔ Verified Authentic
                </span>
                <h1 className="text-2xl md:text-5xl font-serif font-black uppercase tracking-[0.15em] text-slate-800">
                  Certificate
                </h1>
                <h2 className="text-sm md:text-2xl font-serif tracking-widest text-slate-500 mt-1">
                  of Achievement
                </h2>
              </div>

              <img
                src="/codex-logo.svg"
                alt="CodeX Logo"
                className="w-16 md:w-28 object-contain"
              />
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col justify-center py-4 md:py-6">
              <p className="text-xs md:text-base text-slate-500 uppercase tracking-widest mb-2 md:mb-4">
                This is proudly presented to
              </p>

              <h2 className="text-3xl md:text-6xl font-serif italic text-slate-900 border-b-2 border-slate-300 pb-2 mx-auto inline-block px-4 md:px-16">
                {certificate.studentName}
              </h2>

              <p className="text-xs md:text-base text-slate-500 mt-4 md:mt-8 uppercase tracking-widest">
                For successfully participating in
              </p>

              <h3 className="mt-2 text-xl md:text-4xl font-serif text-slate-800">
                {certificate.eventName}
              </h3>

              <div className="mt-4 md:mt-6">
                <span className="inline-flex bg-slate-800 px-4 py-1.5 md:px-6 md:py-2 rounded-sm text-[10px] md:text-sm font-semibold uppercase tracking-[0.25em] text-white">
                  {certificate.position}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-3 items-end text-left w-full gap-2 md:gap-4 shrink-0">
              {/* Left: Metadata */}
              <div className="flex flex-col gap-2 md:gap-4 text-[8px] md:text-xs text-slate-600 pb-1">
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Certificate ID
                  </p>
                  <p className="font-mono font-semibold text-slate-800 break-all">
                    {certificate.certificateId}
                  </p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Issued On
                  </p>
                  <p className="font-semibold text-slate-800">
                    {formatDate(certificate.issuedAt)}
                  </p>
                </div>
              </div>

              {/* Center: QR Code */}
              <div className="flex flex-col items-center justify-end pb-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                    verificationURL
                  )}`}
                  alt="Verification QR Code"
                  className="w-14 h-14 md:w-20 md:h-20 shadow-sm border border-slate-200"
                />
                <p className="mt-2 text-[7px] md:text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  Scan to Verify
                </p>
              </div>

              {/* Right: Signature */}
              <div className="flex flex-col items-center justify-end text-center pb-1">
                {certificate.signatureImage ? (
                  <img
                    src={certificate.signatureImage}
                    alt="Coordinator Signature"
                    className="max-h-12 md:max-h-16 object-contain mb-2"
                  />
                ) : (
                  <div className="h-12 md:h-16 mb-2"></div> /* Spacer */
                )}

                <div className="w-full border-t border-slate-400 pt-1.5 md:pt-2">
                  <p className="font-bold text-[9px] md:text-sm text-slate-800 line-clamp-1">
                    {certificate.coordinatorName}
                  </p>
                  <p className="text-[7px] md:text-[10px] text-slate-500 uppercase tracking-wider mt-0.5 md:mt-1">
                    Coordinator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VerifyCertificate;
