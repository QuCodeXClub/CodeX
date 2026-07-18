import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { certificateService } from "../services/certificateService";
import VerificationLayout from "../layout/VerificationLayout"; // <-- Import the new layout

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
      const response = await certificateService.verifyCertificate(certificateId);

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

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!certificate && !loading ? "Certificate not found." : null)}
      errorTitle="Invalid Certificate"
      verificationURL={verificationURL}
      downloadText="Download PDF"
    >
      {/* Certificate UI inside the layout */}
      {certificate && (
        <div className="relative z-10 w-full max-w-[1000px] min-h-[600px] md:min-h-[700px] bg-white shadow-[0_18px_60px_rgba(13,13,13,0.15)] print:shadow-none print:w-full print:h-full print:max-w-none flex flex-col p-3 md:p-5 border-[10px] border-[#e5e7eb] border-double rounded-sm text-[#111111]">
          <div className="relative border-4 border-[#d1d5db] flex-1 w-full p-4 md:p-8 flex flex-col justify-between text-center bg-[#fffdf9]">
            {/* Header */}
            <div className="flex justify-between items-start w-full shrink-0">
              <img src="/university-logo.svg" alt="University Logo" className="w-16 md:w-28 object-contain" />
              <div className="flex flex-col items-center px-2 md:px-4">
                <span className="inline-flex rounded-full border border-[#34d399] bg-[#ecfdf5] px-3 py-1 text-[8px] md:text-xs font-bold font-mono uppercase tracking-[0.2em] text-[#047857] mb-2 md:mb-4 shadow-sm">
                  ✔ Verified Authentic
                </span>
                <h1 className="text-3xl md:text-6xl font-sans font-bold uppercase tracking-[0.15em] text-[#111111] leading-none">
                  Certificate
                </h1>
                <h2 className="text-sm md:text-2xl font-serif tracking-widest text-[#555555] mt-2 italic">
                  of Achievement
                </h2>
              </div>
              <img src="/codex-logo.svg" alt="CodeX Logo" className="w-16 md:w-28 object-contain" />
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col justify-center py-6 md:py-8">
              <p className="text-xs md:text-sm font-mono text-[#666666] uppercase tracking-widest mb-4">
                This is proudly presented to
              </p>
              <h2 className="text-3xl md:text-7xl font-serif italic text-[#111111] border-b-[3px] border-[#d1d5db] pb-3 mx-auto inline-block px-8 md:px-20 leading-tight">
                {certificate.studentName}
              </h2>
              <p className="text-xs md:text-sm font-mono text-[#666666] mt-6 md:mt-10 uppercase tracking-widest">
                For successfully participating in
              </p>
              <h3 className="mt-3 text-xl md:text-4xl font-sans font-medium uppercase tracking-wide text-[#111111]">
                {certificate.eventName}
              </h3>
              <div className="mt-6 md:mt-8">
                <span className="inline-flex bg-[#111111] px-5 py-2 md:px-8 md:py-3 rounded-none text-[10px] md:text-sm font-sans font-bold uppercase tracking-[0.25em] text-white">
                  {certificate.position}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="grid grid-cols-3 items-end text-left w-full gap-2 md:gap-4 shrink-0 font-mono">
              <div className="flex flex-col gap-3 md:gap-5 text-[8px] md:text-xs text-[#666666] pb-1">
                <div>
                  <p className="font-bold uppercase tracking-wider mb-1 text-[#888888]">Certificate ID</p>
                  <p className="font-semibold text-[#111111] break-all">{certificate.certificateId}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider mb-1 text-[#888888]">Issued On</p>
                  <p className="font-semibold text-[#111111]">{formatDate(certificate.issuedAt)}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-end pb-1">
                <img
                  src={certificate.qrCodeImage}
                  alt="Verification QR Code"
                  className="w-16 h-16 md:w-24 md:h-24 shadow-sm border border-[#e5e7eb] p-1 bg-white"
                />
                <p className="mt-3 text-[7px] md:text-[10px] uppercase tracking-[0.2em] text-[#666666] font-bold">
                  Scan to Verify
                </p>
              </div>

              <div className="flex flex-col items-center justify-end text-center pb-1">
                {certificate.signatureImage ? (
                  <img
                    src={certificate.signatureImage}
                    alt="Coordinator Signature"
                    className="max-h-12 md:max-h-20 object-contain mb-3 mix-blend-multiply"
                  />
                ) : (
                  <div className="h-12 md:h-20 mb-3"></div>
                )}
                <div className="w-full border-t-[2px] border-[#d1d5db] pt-2 md:pt-3">
                  <p className="font-bold text-[9px] md:text-sm text-[#111111] line-clamp-1 uppercase tracking-wide">
                    {certificate.coordinatorName}
                  </p>
                  <p className="text-[7px] md:text-[10px] text-[#888888] uppercase tracking-widest mt-1">
                    Coordinator
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </VerificationLayout>
  );
};

export default VerifyCertificate;