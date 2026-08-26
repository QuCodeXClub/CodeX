import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { boardingPassService } from "../services/boardingPassService";
import VerificationLayout from "../layout/VerificationLayout";
import BoardingPass from "../components/common/BoardingPass";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const VerifyBoardingPass = () => {
  const { boardingPassId } = useParams();

  const [loading, setLoading] = useState(true);
  const [boardingPass, setBoardingPass] = useState(null);
  const [error, setError] = useState("");

  const verificationURL = `${window.location.origin}/verify-boarding-pass/${boardingPassId}`;

  const fetchBoardingPass = useCallback(async () => {
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
  }, [boardingPassId]);

  useEffect(() => {
    fetchBoardingPass();
  }, [fetchBoardingPass]);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("boarding-pass-download-area");
    if (!element) {
      alert("Error: Boarding pass element not found.");
      return;
    }

    const safeStudentName = boardingPass?.studentName?.trim().replace(/\s+/g, "_") || "Attendee";
    const filename = `CodeX_BoardingPass_${safeStudentName}.pdf`;

    try {
      // Capture element width and height in points
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      // Capture the boarding pass element with identical configuration to the working Certificate
      const canvas = await html2canvas(element, {
        scale: 2.0, // High quality
        useCORS: true,
        logging: false,
        backgroundColor: "#020a11",
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("boarding-pass-download-area");
          if (clonedElement) {
            // Force clean layout dimensions for rendering
            clonedElement.style.width = `${width}px`;
            clonedElement.style.height = `${height}px`;
            clonedElement.style.maxWidth = "none";
            
            // Remove complex properties like backdrop-filter that crash html2canvas on some browsers
            const glassCards = clonedElement.querySelectorAll(".glass-card");
            glassCards.forEach(card => {
              card.style.backdropFilter = "none";
              card.style.webkitBackdropFilter = "none";
              card.style.background = "#020a11";
            });
          }
        }
      });

      // Create PDF with custom dimensions matching the exact physical layout size in points
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [width, height],
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      pdf.addImage(imgData, "JPEG", 0, 0, width, height, undefined, "FAST");
      pdf.save(filename);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Failed to generate PDF: " + err.message + "\n" + err.stack);
    }
  };

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!boardingPass && !loading ? "Boarding Pass not found." : null)}
      errorTitle="Invalid Boarding Pass"
      verificationURL={verificationURL}
      downloadText="Download PDF"
      onDownload={handleDownloadPDF}
    >
      {/* 
        Print specific styles to ensure backgrounds and colors are NOT stripped by the browser.
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
        <BoardingPass
          studentName={boardingPass.studentName}
          eventName={boardingPass.eventName}
          eventDescription={boardingPass.eventDescription}
          qrCodeImage={boardingPass.qrCodeImage}
          qid={boardingPass.qid}
          citeNumber={boardingPass.citeNumber}
          boardingPassId={boardingPassId}
          wifiUser={boardingPass.wifiUser}
          wifiPass={boardingPass.wifiPass}
          loginUser={boardingPass.loginUser}
          loginPass={boardingPass.loginPass}
          prizePool={boardingPass.prizePool}
          certificateType={boardingPass.certificateType}
          mode={boardingPass.mode}
          teamSize={boardingPass.teamSize}
        />
      )}
    </VerificationLayout>
  );
};

export default VerifyBoardingPass;