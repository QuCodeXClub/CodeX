import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setError as setGlobalError, setSuccess as setGlobalSuccess } from "../context/messageSlice";
import { boardingPassService } from "../services/boardingPassService";
import VerificationLayout from "../layout/VerificationLayout";
import CodexBoardingPassCard from "../components/boardingPass/CodexBoardingPassCard";
import {
  exportBoardingPassAsPDF,
  exportBoardingPassFacesAsImage,
  exportBoardingPassFacesAsJPG,
  exportBoardingPassFacesAsSVG,
} from "../utils/boardingPassExport";

const VerifyBoardingPass = () => {
  const { boardingPassId } = useParams();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [boardingPass, setBoardingPass] = useState(null);
  const [error, setError] = useState("");
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingJPG, setIsExportingJPG] = useState(false);
  const [isExportingSVG, setIsExportingSVG] = useState(false);

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
    if (boardingPassId) {
      fetchBoardingPass();
    }
  }, [boardingPassId, fetchBoardingPass]);

  const handleExportPDF = async () => {
    if (!boardingPass) return;
    try {
      setIsExportingPDF(true);
      await exportBoardingPassAsPDF(
        "codex-boarding-pass-front-svg",
        "codex-boarding-pass-back-svg",
        `BoardingPass-${boardingPass.boardingPassId || "CodeX"}`
      );
      dispatch(setGlobalSuccess("Official 2-Page Boarding Pass PDF downloaded successfully."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export PDF. Please try again."));
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportImage = async () => {
    if (!boardingPass) return;
    try {
      setIsExportingImage(true);
      await exportBoardingPassFacesAsImage(
        "codex-boarding-pass-front-svg",
        "codex-boarding-pass-back-svg",
        `BoardingPass-${boardingPass.boardingPassId || "CodeX"}`
      );
      dispatch(setGlobalSuccess("High-resolution front and back PNG downloaded."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export PNG image. Please try again."));
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleExportJPG = async () => {
    if (!boardingPass) return;
    try {
      setIsExportingJPG(true);
      await exportBoardingPassFacesAsJPG(
        "codex-boarding-pass-front-svg",
        "codex-boarding-pass-back-svg",
        `BoardingPass-${boardingPass.boardingPassId || "CodeX"}`
      );
      dispatch(setGlobalSuccess("High-resolution front and back JPG downloaded."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export JPG image. Please try again."));
    } finally {
      setIsExportingJPG(false);
    }
  };

  const handleExportSVG = async () => {
    if (!boardingPass) return;
    try {
      setIsExportingSVG(true);
      await exportBoardingPassFacesAsSVG(
        "codex-boarding-pass-front-svg",
        "codex-boarding-pass-back-svg",
        `BoardingPass-${boardingPass.boardingPassId || "CodeX"}`
      );
      dispatch(setGlobalSuccess("Vector SVG with front and back downloaded."));
    } catch (err) {
      console.error(err);
      dispatch(setGlobalError("Failed to export SVG file. Please try again."));
    } finally {
      setIsExportingSVG(false);
    }
  };

  const formattedDate = (() => {
    if (!boardingPass) return "August 08, 2026";
    const eventDate = boardingPass?.eventDate || boardingPass?.issuedAt || "2026-08-08";
    try {
      const d = new Date(eventDate);
      if (isNaN(d.getTime())) return "August 08, 2026";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "August 08, 2026";
    }
  })();

  const metadata = boardingPass
    ? [
        { label: "Attendee", value: boardingPass.studentName || "Attendee" },
        ...(boardingPass.teamName ? [{ label: "Team", value: boardingPass.teamName }] : []),
        { label: "Event", value: boardingPass.eventName || "CodeX Event" },
        { label: "Pass ID", value: boardingPass.boardingPassId || "BP-2026", isMono: true },
        { label: "Status", value: "Verified Entry", isBadge: true },
        
      ]
    : [];

  return (
    <VerificationLayout
      isLoading={loading}
      error={error || (!boardingPass && !loading ? "Boarding Pass not found." : null)}
      errorTitle="Invalid Boarding Pass"
      verificationURL={verificationURL}
      metadata={metadata}
      badgeTitle="Verified Pass"
      badgeSubtitle="Authentic CodeX Boarding Pass"
      onExportPDF={handleExportPDF}
      onExportImage={handleExportImage}
      onExportJPG={handleExportJPG}
      onExportSVG={handleExportSVG}
      isExportingPDF={isExportingPDF}
      isExportingImage={isExportingImage}
      isExportingJPG={isExportingJPG}
      isExportingSVG={isExportingSVG}
    >
      {boardingPass && (
        <div className="w-full h-full flex flex-col justify-center items-center p-1 sm:p-2 min-w-0 min-h-0 overflow-hidden">
          <CodexBoardingPassCard
            boardingPass={boardingPass}
            className="w-full max-w-250 my-auto"
          />
        </div>
      )}
    </VerificationLayout>
  );
};

export default VerifyBoardingPass;