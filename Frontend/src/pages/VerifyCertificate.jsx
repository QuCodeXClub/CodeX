import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError as setGlobalError, setSuccess as setGlobalSuccess } from "../context/messageSlice";
import { certificateService } from "../services/certificateService";
import VerificationLayout from "../layout/VerificationLayout";
import CodexCertificateSVG from "../components/certificate/CodexCertificateSVG";
import { exportCertificateAsPDF, exportCertificateAsImage, exportCertificateAsJPG, exportCertificateAsSVG } from "../utils/certificateExport";

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingJPG, setIsExportingJPG] = useState(false);
  const [isExportingSVG, setIsExportingSVG] = useState(false);

  const verificationURL = `${window.location.origin}/verify-certificate/${certificateId}`;

  const fetchCertificate = useCallback(async () => {
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
  }, [certificateId]);

  useEffect(() => {
    if (certificateId) {
      fetchCertificate();
    }
  }, [certificateId, fetchCertificate]);

  const handleExportPDF = async () => {
    if (!certificate) return;
    try {
      setIsExportingPDF(true);
      await exportCertificateAsPDF(
        "codex-certificate-svg",
        `Certificate-${certificate.certificateId || "Codex"}`
      );
      dispatch(setGlobalSuccess("Official certificate PDF downloaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export PDF. Please try again."));
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportImage = async () => {
    if (!certificate) return;
    try {
      setIsExportingImage(true);
      await exportCertificateAsImage(
        "codex-certificate-svg",
        `Certificate-${certificate.certificateId || "Codex"}`
      );
      dispatch(setGlobalSuccess("High-resolution certificate PNG downloaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export PNG image. Please try again."));
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportJPG = async () => {
    if (!certificate) return;
    try {
      setIsExportingJPG(true);
      await exportCertificateAsJPG(
        "codex-certificate-svg",
        `Certificate-${certificate.certificateId || "Codex"}`
      );
      dispatch(setGlobalSuccess("High-resolution certificate JPG downloaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export JPG image. Please try again."));
    } finally {
      setIsExportingJPG(false);
    }
  };

  const handleExportSVG = async () => {
    if (!certificate) return;
    try {
      setIsExportingSVG(true);
      await exportCertificateAsSVG(
        "codex-certificate-svg",
        `Certificate-${certificate.certificateId || "Codex"}`
      );
      dispatch(setGlobalSuccess("Vector SVG certificate downloaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export SVG file. Please try again."));
    } finally {
      setIsExportingSVG(false);
    }
  };

  const formattedDate = (() => {
    if (!certificate) return "August 21, 2026";
    const eventDate = certificate?.eventDate || certificate?.issuedAt || "2026-08-21";
    try {
      const d = new Date(eventDate);
      if (isNaN(d.getTime())) return "August 21, 2026";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "August 21, 2026";
    }
  })();

  const metadata = certificate
    ? [
        { label: "Issued To", value: certificate.studentName || "Pedro Fernandes" },
        { label: "Event", value: certificate.eventName || "Web Development Hackathon" },
        {
          label: "Category",
          value: certificate.position || "Participation",
          isBadge: true,
        },
        { label: "Certificate ID", value: certificate.certificateId || "CDX-2026-001", isMono: true },
        { label: "Date of Issue", value: formattedDate, hideOnMobile: true },
        { label: "Organization", value: "CodeX • Quantum University", hideOnMobile: true },
      ]
    : [];

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!certificate && !loading ? "Certificate not found." : null)}
      errorTitle="Invalid Certificate"
      verificationURL={verificationURL}
      metadata={metadata}
      badgeTitle="Verified Credential"
      badgeSubtitle="Authentic CodeX Certificate"
      onExportPDF={handleExportPDF}
      onExportImage={handleExportImage}
      onExportJPG={handleExportJPG}
      onExportSVG={handleExportSVG}
      isExportingPDF={isExportingPDF}
      isExportingImage={isExportingImage}
      isExportingJPG={isExportingJPG}
      isExportingSVG={isExportingSVG}
    >
      {certificate && (
        <div className="w-full h-full flex justify-center items-center p-1 sm:p-2 min-w-0 min-h-0 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center max-h-[96vh] drop-shadow-2xl">
            <CodexCertificateSVG
              certificate={certificate}
              id="codex-certificate-svg"
              className="w-full h-full object-contain max-h-[96vh] rounded-xl sm:rounded-2xl block"
              style={{ width: "100%", height: "100%", maxHeight: "96vh", display: "block" }}
            />
          </div>
        </div>
      )}
    </VerificationLayout>
  );
};

export default VerifyCertificate;