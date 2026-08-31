import React, { memo } from "react";
import {
  CERTIFICATE_MASK_F,
  CERTIFICATE_MASK_H,
  CERTIFICATE_MASK_O,
  CERTIFICATE_MASK_R,
  CERTIFICATE_IMAGE_E,
  CERTIFICATE_IMAGE_G,
  CERTIFICATE_IMAGE_M,
  CERTIFICATE_IMAGE_Q,
} from "./certificateAssets";
import { CERTIFICATE_FONTS_CSS } from "./certificateFonts";

/**
 * CodexCertificateSVG
 * High-performance, self-contained SVG certificate component with embedded Base64 fonts
 * and dynamic text layout sizing for all 7 standard positions.
 */
const CodexCertificateSVG = memo(({ certificate = {}, ...props }) => {
  const studentName = (certificate?.studentName || "Pedro Fernandes").trim();
  const eventName = (certificate?.eventName || "Web Development Hackathon").trim();
  const coordinatorName = (certificate?.coordinatorName || "Event Incharge").trim();
  const certificateId = (certificate?.certificateId || "CDX-2026-001").trim();

  const ensureSecureUrl = (url) => {
    if (!url || typeof url !== "string") return null;
    return url.replace(/^http:\/\//i, "https://");
  };

  const signatureImage = ensureSecureUrl(certificate?.signatureImage);
  const qrCodeImage = ensureSecureUrl(certificate?.qrCodeImage);

  // Format date
  const eventDate = certificate?.eventDate || certificate?.issuedAt || "2026-08-21";
  const formattedDate = (() => {
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

  // Determine certificate text based strictly on the 7 supported positions
  const resolveCertificateData = () => {
    const rawPos = (certificate?.position || "Participant").trim().toLowerCase();

    // 1. Winner
    if (rawPos === "winner" || rawPos.includes("winner")) {
      return {
        header: "ACHIEVEMENT",
        line1: `for securing Winner in ${eventName} on ${formattedDate}`,
        line2: "in recognition of outstanding performance, dedication, and achievement.",
      };
    }

    // 2. 1st Runner-up
    if (
      rawPos === "1st runner-up" ||
      rawPos === "1st runner up" ||
      rawPos.includes("1st runner")
    ) {
      return {
        header: "ACHIEVEMENT",
        line1: `for securing 1st Runner-up in ${eventName} on ${formattedDate}`,
        line2: "in recognition of outstanding performance, dedication, and achievement.",
      };
    }

    // 3. 2nd Runner-up
    if (
      rawPos === "2nd runner-up" ||
      rawPos === "2nd runner up" ||
      rawPos.includes("2nd runner")
    ) {
      return {
        header: "ACHIEVEMENT",
        line1: `for securing 2nd Runner-up in ${eventName} on ${formattedDate}`,
        line2: "in recognition of outstanding performance, dedication, and achievement.",
      };
    }

    // 4. Runner Up
    if (
      rawPos === "runner up" ||
      rawPos === "runner-up" ||
      rawPos.includes("runner up") ||
      rawPos.includes("runner-up")
    ) {
      return {
        header: "ACHIEVEMENT",
        line1: `for securing Runner Up in ${eventName} on ${formattedDate}`,
        line2: "in recognition of exceptional performance, dedication, and achievement.",
      };
    }

    // 5. Volunteer
    if (rawPos === "volunteer" || rawPos.includes("volunteer")) {
      return {
        header: "APPRECIATION",
        line1: `for serving as a Volunteer at ${eventName} on ${formattedDate}`,
        line2: "in recognition of valuable contribution, dedication, and support towards the successful execution of the event.",
      };
    }

    // 6. Organizer
    if (
      rawPos === "organizer" ||
      rawPos.includes("organizer") ||
      rawPos.includes("organiser")
    ) {
      return {
        header: "APPRECIATION",
        line1: `for serving as an Organizer of ${eventName} on ${formattedDate}`,
        line2: "in recognition of exceptional coordination, leadership, dedication, and contribution towards the successful execution of the event.",
      };
    }

    // 7. Participant (Default)
    return {
      header: "PARTICIPATION",
      line1: `for active participation in ${eventName} as a Participant on ${formattedDate}`,
      line2: "In recognition of enthusiastic participation and dedication demonstrated during the event.",
    };
  };

  const certData = resolveCertificateData();
  const certificateCategory = certData.header;

  // Determine Gold vs Silver Theme: Silver for Participant & Volunteer, Gold for Winners & Organizers
  const rawPos = (certificate?.position || "Participant").trim().toLowerCase();
  const isSilver =
    rawPos === "participant" ||
    rawPos.includes("participant") ||
    rawPos === "volunteer" ||
    rawPos.includes("volunteer");

  // Responsive font size for student name so long names never overflow
  const studentFontSize = (() => {
    const len = studentName.length;
    if (len > 30) return 36;
    if (len > 24) return 42;
    if (len > 18) return 48;
    return 54;
  })();

  // Responsive font size for line1 if event name is extra long
  const line1FontSize = (() => {
    const len = certData.line1.length;
    if (len > 80) return 12.5;
    if (len > 65) return 13.5;
    return 15;
  })();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 842.25 595.5"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <defs>
        <style>{CERTIFICATE_FONTS_CSS}</style>
        
        {/* Optimized Clip Paths */}
        <clipPath id="canvas-bounds">
          <path d="M0 0h842.25v595.5H0Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="clip-logo-left">
          <path d="M59.55 33.15h71.277v71.277H59.55Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="clip-logo-right">
          <path d="M472.407 36.494h120.045v67.525H472.407Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="clip-seal-poly">
          <path d="M782.655 231V0H616.243v231l83.206 83.207L782.655 231Z" />
        </clipPath>
        <clipPath id="clip-watermark">
          <path d="M266.4 117.84h326.64v360.48H266.4Z" clipRule="evenodd" />
        </clipPath>
        <clipPath id="clip-badge-accent">
          <path d="M619.848 34.027h159.06v202.577h-159.06Z" clipRule="evenodd" />
        </clipPath>

        {/* Embedded Masks */}
        <mask id="mask-logo-left">
          <image
            href={CERTIFICATE_MASK_F}
            xlinkHref={CERTIFICATE_MASK_F}
            width={350}
            height={350}
            transform="matrix(.20365 0 0 .20365 59.55 33.15)"
          />
        </mask>
        <mask id="mask-logo-right">
          <image
            href={CERTIFICATE_MASK_H}
            xlinkHref={CERTIFICATE_MASK_H}
            width={578}
            height={325}
            transform="matrix(.2077 0 0 .20777 472.407 36.494)"
          />
        </mask>
        <mask id="mask-watermark">
          <image
            href={CERTIFICATE_MASK_O}
            xlinkHref={CERTIFICATE_MASK_O}
            width={216}
            height={238}
            transform="matrix(1.51099 0 0 1.51002 266.563 118.047)"
          />
        </mask>
        <mask id="mask-badge-accent">
          <image
            href={CERTIFICATE_MASK_R}
            xlinkHref={CERTIFICATE_MASK_R}
            width={1035}
            height={1317}
            transform="matrix(.15368 0 0 .15382 619.848 34.027)"
          />
        </mask>

        {/* Silver Metallic Filter for Participant & Volunteer */}
        <filter id="silver-filter" colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.08" intercept="0.08" />
            <feFuncG type="linear" slope="1.08" intercept="0.08" />
            <feFuncB type="linear" slope="1.15" intercept="0.12" />
          </feComponentTransfer>
        </filter>

        {/* Silver & Gold Ribbon Gradients */}
        <linearGradient id="silver-ribbon-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#718096" />
          <stop offset="50%" stopColor="#a0aec0" />
          <stop offset="100%" stopColor="#4a5568" />
        </linearGradient>
      </defs>

      {/* Main Background Layer */}
      <g clipPath="url(#canvas-bounds)">
        <path fill="#ffffff" d="M0 0h842.25v595.5H0Z" />

        {/* Left Organization Logo */}
        <g clipPath="url(#clip-logo-left)" mask="url(#mask-logo-left)">
          <image
            href={CERTIFICATE_IMAGE_E}
            xlinkHref={CERTIFICATE_IMAGE_E}
            width={350}
            height={350}
            transform="matrix(.20365 0 0 .20365 59.55 33.15)"
          />
        </g>

        {/* Right Partner Logo (QU Logo - Shifted right towards ribbon) */}
        <g transform="translate(25, 0)">
          <g clipPath="url(#clip-logo-right)" mask="url(#mask-logo-right)">
            <image
              href={CERTIFICATE_IMAGE_G}
              xlinkHref={CERTIFICATE_IMAGE_G}
              width={578}
              height={325}
              transform="matrix(.2077 0 0 .20777 472.407 36.494)"
            />
          </g>
        </g>

        {/* Top Right Cyan Banner Ribbons (Scaled to 85% for refined proportions) */}
        <g transform="translate(842.25, 0) scale(0.85) translate(-842.25, 0)">
          <g clipPath="url(#clip-seal-poly)">
            <path fill="#2fb7c4" d="M782.655 0v313.973H616.243V0Z" />
          </g>
        </g>

        {/* Background Watermark Crest */}
        <g clipPath="url(#clip-watermark)" opacity={0.18}>
          <g mask="url(#mask-watermark)">
            <image
              href={CERTIFICATE_IMAGE_M}
              xlinkHref={CERTIFICATE_IMAGE_M}
              width={216}
              height={238}
              transform="matrix(1.51099 0 0 1.51002 266.563 118.047)"
            />
          </g>
        </g>

        {/* Header Titles */}
        <g fill="#0c1839" fontFamily="'Cinzel', 'Lora', serif" fontWeight="bold">
          <text x={59.55} y={145} fontSize={36} letterSpacing={2}>
            CERTIFICATE OF
          </text>
          <text x={59.55} y={190} fontSize={36} letterSpacing={2.5} fill="#0c1839">
            {certificateCategory}
          </text>
        </g>

        {/* Presentation Subtitle */}
        <text
          x={59.55}
          y={238}
          fill="#0c1839"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={13.5}
          fontWeight="500"
          letterSpacing={0.5}
        >
          This certificate is proudly presented to
        </text>

        {/* Dynamic Recipient Name */}
        <text
          x={59.55}
          y={292}
          fill="#0c1839"
          fontFamily="'Pinyon Script', 'Great Vibes', cursive"
          fontSize={studentFontSize}
        >
          {studentName}
        </text>

        {/* Separator Lines (Gold for Winner/Organizer, Silver for Participant/Volunteer) */}
        <path
          fill="none"
          stroke={isSilver ? "#94a3b8" : "#eebd47"}
          strokeWidth={0.75}
          d="M59.55 314.207h421.596M59.55 514h155.04M627.66 514h155.04"
        />

        {/* Dynamic Event & Position Statement (Line 1) */}
        <text
          x={59.55}
          y={345}
          fill="#0c1839"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={line1FontSize}
          fontWeight="600"
        >
          {certData.line1}
        </text>

        {/* Recognition Description (Line 2) */}
        <text
          x={59.55}
          y={372}
          fill="#475569"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={11.5}
          fontWeight="400"
        >
          {certData.line2}
        </text>

        {/* ================= LEFT: Event Coordinator Name & Title ================= */}
        {/* Name Above Yellow Line */}
        <text
          x={137.07}
          y={504}
          textAnchor="middle"
          fill="#0c1839"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={12.5}
          fontWeight="bold"
        >
          {coordinatorName}
        </text>
        {/* Title Below Yellow Line */}
        <text
          x={137.07}
          y={532}
          textAnchor="middle"
          fill="#64748b"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={10.5}
          fontWeight="500"
          letterSpacing={0.8}
        >
          Event Coordinator
        </text>

        {/* ================= CENTER: Smaller QR Code & Central ID ================= */}
        {qrCodeImage ? (
          <image
            href={qrCodeImage}
            xlinkHref={qrCodeImage}
            crossOrigin="anonymous"
            x={388.625}
            y={442}
            width={65}
            height={65}
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <g transform="translate(388.625, 442) scale(0.1625)">
            <rect width={400} height={388} fill="#ffffff" rx={8} />
            <rect x={30} y={30} width={100} height={100} fill="none" stroke="#0c1839" strokeWidth={16} rx={8} />
            <rect x={60} y={60} width={40} height={40} fill="#0c1839" />
            <rect x={270} y={30} width={100} height={100} fill="none" stroke="#0c1839" strokeWidth={16} rx={8} />
            <rect x={300} y={60} width={40} height={40} fill="#0c1839" />
            <rect x={30} y={258} width={100} height={100} fill="none" stroke="#0c1839" strokeWidth={16} rx={8} />
            <rect x={60} y={288} width={40} height={40} fill="#0c1839" />
            <rect x={180} y={50} width={40} height={40} fill="#0c1839" />
            <rect x={180} y={140} width={40} height={110} fill="#0c1839" />
            <rect x={270} y={180} width={100} height={40} fill="#0c1839" />
            <rect x={180} y={290} width={90} height={40} fill="#0c1839" />
            <rect x={310} y={260} width={60} height={70} fill="#0c1839" />
          </g>
        )}

        {/* Certificate ID & Verification (Centered Directly Below QR) */}
        <g transform="translate(421.125, 524)">
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fill="#475569"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={9}
            fontWeight="600"
          >
            ID: {certificateId}
          </text>
          <text
            x={0}
            y={12}
            textAnchor="middle"
            fill="#0284c7"
            fontFamily="Poppins, Montserrat, sans-serif"
            fontSize={8}
            fontWeight="600"
            letterSpacing={0.5}
          >
            VERIFIED • qucodex.com
          </text>
        </g>

        {/* ================= RIGHT: Vice Chancellor Signature & Title ================= */}
        {signatureImage ? (
          <image
            href={signatureImage}
            xlinkHref={signatureImage}
            crossOrigin="anonymous"
            x={627.66}
            y={456}
            width={155.04}
            height={52}
            preserveAspectRatio="xMidYMax meet"
          />
        ) : (
          <text
            x={705.18}
            y={502}
            textAnchor="middle"
            fill="#0c1839"
            fontFamily="'Pinyon Script', 'Great Vibes', cursive"
            fontSize={28}
            fontStyle="italic"
            opacity={0.92}
          >
            Vice Chancellor
          </text>
        )}
        <text
          x={705.18}
          y={532}
          textAnchor="middle"
          fill="#64748b"
          fontFamily="Poppins, Montserrat, sans-serif"
          fontSize={10.5}
          fontWeight="500"
          letterSpacing={0.8}
        >
          Vice Chancellor
        </text>

        {/* Badge Ribbon Overlay Artwork (Scaled to 85% with Gold/Silver theme) */}
        <g transform="translate(842.25, 0) scale(0.85) translate(-842.25, 0)">
          <g
            clipPath="url(#clip-badge-accent)"
            mask="url(#mask-badge-accent)"
            filter={isSilver ? "url(#silver-filter)" : undefined}
          >
            <image
              href={CERTIFICATE_IMAGE_Q}
              xlinkHref={CERTIFICATE_IMAGE_Q}
              width={1035}
              height={1317}
              transform="matrix(.15368 0 0 .15382 619.848 34.027)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
});

CodexCertificateSVG.displayName = "CodexCertificateSVG";

export default CodexCertificateSVG;
