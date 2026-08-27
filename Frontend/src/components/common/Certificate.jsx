import React, { useState, useEffect } from "react";


const processSignatureImage = (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate relative brightness
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        // Convert paper background (brightness > 195) to transparent
        if (brightness > 195) {
          data[i + 3] = 0; // alpha = 0
        } else {
          // Increase signature ink darkness/contrast slightly
          data[i] = Math.max(0, r - 45);
          data[i + 1] = Math.max(0, g - 45);
          data[i + 2] = Math.max(0, b - 15);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
};

// Utility to bake the apple-touch-icon.png logo inside the QR code on a single canvas.
// This outputs a single image so that html2pdf renders it with no CSS overlay shift.
const generateQrWithLogo = (qrUrl, logoUrl) => {
  return new Promise((resolve) => {
    const qrImg = new Image();
    if (qrUrl && (qrUrl.startsWith("http://") || qrUrl.startsWith("https://"))) {
      qrImg.crossOrigin = "anonymous";
    }
    qrImg.onload = () => {
      const logoImg = new Image();
      if (logoUrl && (logoUrl.startsWith("http://") || logoUrl.startsWith("https://"))) {
        logoImg.crossOrigin = "anonymous";
      }
      logoImg.onload = () => {
        const canvas = document.createElement("canvas");
        // Use a nice high-resolution canvas size
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");

        // 1. Draw the base QR Code
        ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height);

        // 2. Define logo size (about 22% of QR width is standard for scannability)
        const logoSize = Math.floor(canvas.width * 0.22);
        const x = (canvas.width - logoSize) / 2;
        const y = (canvas.height - logoSize) / 2;

        // 3. Draw a clean white background behind the logo with a small padding
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);

        // 4. Draw the logo in the center
        ctx.drawImage(logoImg, x, y, logoSize, logoSize);

        resolve(canvas.toDataURL("image/png"));
      };
      logoImg.onerror = () => resolve(qrUrl);
      logoImg.src = logoUrl;
    };
    qrImg.onerror = () => resolve(qrUrl);
    qrImg.src = qrUrl;
  });
};

const Certificate = ({
  studentName,
  eventName,
  eventDate,
  certificateId,
  qrCodeImage,
  coordinatorName,
  signatureImage,
  position,
}) => {
  const [processedSignature, setProcessedSignature] = useState("");
  const [processedQr, setProcessedQr] = useState("");

  useEffect(() => {
    // Process local signature on mount so it's ready transparent for rendering & PDF export.
    // If a dynamic signatureImage is provided via props, use it; otherwise fallback to the local /signature.jpg.
    // We ignore the mock wikipedia/wikimedia URL from the service mock.
    const isMockSig = signatureImage && (
      signatureImage.includes("wikipedia") ||
      signatureImage.includes("wikimedia") ||
      signatureImage.includes("Signature_Mock")
    );
    const sigUrl = (signatureImage && !isMockSig) ? signatureImage : "/signature.jpg";
    processSignatureImage(sigUrl).then((res) => {
      setProcessedSignature(res);
    });
  }, [signatureImage]);

  useEffect(() => {
    if (qrCodeImage) {
      // Bake the apple-touch-icon logo directly inside the QR Code image
      generateQrWithLogo(qrCodeImage, "/apple-touch-icon.png").then((res) => {
        setProcessedQr(res);
      });
    }
  }, [qrCodeImage]);

  const formatDisplayDate = (date) => {
    if (!date) return "-";

    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime()) && (date.toString().includes("T") || date.toString().includes("-") || date.toString().includes("/"))) {
      const formatted = dateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
      return formatted.replace(/[\u200e\u200f\u202a-\u202e]/g, "").replace(/\s+/g, " ").trim();
    }
    return String(date).replace(/[\u200e\u200f\u202a-\u202e]/g, "").trim().toUpperCase();
  };

  // Automatically scale font size for unusually long recipient names
  const nameLength = studentName?.length || 0;
  const baseNameSize = 4.1;
  const nameFontSize = nameLength > 18
    ? `${Math.max(2.8, baseNameSize * (18 / nameLength))}cqw`
    : `${baseNameSize}cqw`;

  return (
    <div
      id="certificate-print-area"
      className="relative z-10 w-full max-w-[1000px] aspect-[1402/1122] bg-white shadow-[0_18px_60px_rgba(13,13,13,0.15)] print:shadow-none print:w-full print:h-full print:max-w-none flex flex-col mx-auto overflow-hidden @container select-none"
      style={{
        backgroundImage: `url(${window.location.origin}/my-template.png)`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Load Google Font dynamically */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Charm:wght@400;700&display=swap');
        .charm-regular {
          font-family: "Charm", cursive;
          font-weight: 400;
          font-style: normal;
        }
        .charm-bold {
          font-family: "Charm", cursive;
          font-weight: 700;
          font-style: normal;
        }
      `}</style>

      {/* DYNAMIC FIELD 1 — recipientName */}
      <div id="cert-name-wrapper" className="absolute top-[42.2%] left-0 w-full text-center flex flex-col items-center">
        <h2
          className="text-[#0a192f] charm-bold leading-[1.2]"
          style={{ fontSize: nameFontSize }}
        >
          {studentName}
        </h2>
      </div>

      {/* DYNAMIC FIELD 2 — eventName */}
      <div id="cert-event-wrapper" className="absolute top-[55.2%] left-0 w-full text-center">
        <h3 className="text-[2.6cqw] font-sans font-bold uppercase tracking-[0.15em] text-[#0a192f] leading-normal px-[10cqw]">
          {eventName}
        </h3>
      </div>

      {/* DYNAMIC FIELD - Position (Inside the dark blue pill shape) */}
      <div id="cert-position-wrapper" className="absolute top-[64.3%] left-0 w-full text-center flex justify-center">
        <h3 className="text-[2.2cqw] font-sans font-black uppercase tracking-[0.2em] text-white leading-[1.2]">
          {position || "PARTICIPANT"}
        </h3>
      </div>

      {/* DYNAMIC FIELD 5 — qrCode (Centered using direct percentage offset instead of -translate-x-1/2) */}
      <div
        className="absolute top-[71.9%] left-[45.2%] w-[9.6cqw] h-[9.6cqw] bg-white p-[0.8cqw] shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-sm flex items-center justify-center"
      >
        <img
          src={processedQr || qrCodeImage}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      </div>

      {/* DYNAMIC FIELD 4 — certificateId (Metadata left) */}
      <div className="absolute top-[74.2%] left-[14.5%] text-left w-[24cqw]">
        <p className="font-mono text-[1.1cqw] font-bold text-[#0a192f] leading-normal break-all">
          {certificateId}
        </p>
      </div>

      {/* DYNAMIC FIELD 3 — issueDate (Metadata left) */}
      <div className="absolute top-[84.2%] left-[14.5%] text-left w-[24cqw]">
        <p className="font-mono text-[1.1cqw] font-bold text-[#0a192f] leading-normal">
          {formatDisplayDate(eventDate)}
        </p>
      </div>

      {/* DYNAMIC FIELD 6 — coordinatorName */}
      {coordinatorName && (
        <div id="cert-coordinator-wrapper" className="absolute top-[79.5%] right-[11.5%] w-[18cqw] text-center flex justify-center">
          <p
            className="font-serif font-bold uppercase tracking-wider text-[#0a192f] text-center w-full"
            style={{ fontSize: "1.7cqw", fontFamily: "'Times New Roman', Times, serif" }}
          >
            {coordinatorName}
          </p>
        </div>
      )}

      {/* STATIC - Coordinator Signature Overlay */}
      <div className="absolute top-[70.5%] right-[13.5%] w-[18cqw] h-[8cqw] flex items-end justify-center">
        {processedSignature && (
          <img
            src={processedSignature}
            alt="Coordinator Signature"
            className="max-w-full max-h-full object-contain"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}
      </div>
    </div>
  );
};

export default Certificate;
