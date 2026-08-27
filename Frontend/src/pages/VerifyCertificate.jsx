import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { certificateService } from "../services/certificateService";
import VerificationLayout from "../layout/VerificationLayout";
import Certificate from "../components/common/Certificate";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const VerifyCertificate = () => {
  const { certificateId } = useParams();

  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

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
    fetchCertificate();
  }, [fetchCertificate]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("certificate-print-area");
    if (!element) return;

    const safeStudentName = certificate?.studentName?.trim().replace(/\s+/g, "_") || "Certificate";
    const filename = `CodeX_Certificate_${safeStudentName}.pdf`;

    try {
      // Capture the element at its native size of 1402px by 1122px using html2canvas.
      // This matches the exact aspect ratio of the background template (1.25) to avoid any stretching.
      const canvas = await html2canvas(element, {
        scale: 2.0, // High quality, keep file size reasonable
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("certificate-print-area");
          if (clonedElement) {
            clonedElement.style.width = "1402px";
            clonedElement.style.height = "1122px";
            clonedElement.style.maxWidth = "none";
            clonedElement.style.backgroundSize = "contain";
          }

          // Use the native design positions for 1402x1122 layout
          const clonedName = clonedDoc.getElementById("cert-name-wrapper");
          if (clonedName) {
            clonedName.style.top = "41.2%";
          }
          const clonedEvent = clonedDoc.getElementById("cert-event-wrapper");
          if (clonedEvent) {
            clonedEvent.style.top = "53.2%";
          }
          const clonedPosition = clonedDoc.getElementById("cert-position-wrapper");
          if (clonedPosition) {
            clonedPosition.style.top = "63.5%";
          }
          const clonedCoordinator = clonedDoc.getElementById("cert-coordinator-wrapper");
          if (clonedCoordinator) {
             clonedCoordinator.style.top = "78.7%";
          }
        }
      });

      // Create PDF with custom dimensions matching the 1402pt x 1122pt certificate aspect ratio
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [1402, 1122],
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      // Draw image across the full page (1402pt width by 1122pt height) with no margins
      pdf.addImage(imgData, "JPEG", 0, 0, 1402, 1122, undefined, "FAST");

      pdf.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  };

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!certificate && !loading ? "Certificate not found." : null)}
      errorTitle="Invalid Certificate"
      verificationURL={verificationURL}
      downloadText="Download PDF"
      onDownload={handleDownloadPDF}
    >
      {certificate && (
        <Certificate
          studentName={certificate.studentName}
          eventName={certificate.eventName}
          eventDate={certificate.eventDate}
          certificateId={certificate.certificateId}
          qrCodeImage={certificate.qrCodeImage}
          coordinatorName={certificate.coordinatorName}
          signatureImage={certificate.signatureImage}
          position={certificate.position}
        />
      )}
    </VerificationLayout>
  );
};

export default VerifyCertificate;