import jsPDF from "jspdf";

/**
 * Sanitize output download filename
 */
const sanitizeFilename = (name) => {
  return (name || "boarding_pass")
    .replace(/[^a-z0-9_-]/gi, "_")
    .toLowerCase()
    .slice(0, 50);
};

/**
 * Convert any image URL (remote or local) to Base64 Data URL
 */
export const convertUrlToBase64 = async (url) => {
  if (!url || typeof url !== "string") return "";
  if (url.startsWith("data:")) return url;

  // Try direct fetch first
  try {
    const response = await fetch(url, { mode: "cors" });
    if (response.ok) {
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (e) {
    console.warn("Direct fetch for image conversion failed, attempting Image canvas fallback:", e);
  }

  // Fallback: load Image with crossOrigin and draw to offscreen canvas
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 400;
        canvas.height = img.naturalHeight || img.height || 400;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (canvasErr) {
        console.warn("Canvas export fallback failed:", canvasErr);
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
};

/**
 * Replace all external <image> URLs with inline Base64 data URIs
 */
export const inlineSvgImages = async (svgElement) => {
  const images = svgElement.querySelectorAll("image");
  const promises = Array.from(images).map(async (imgEl) => {
    const href =
      imgEl.getAttribute("href") ||
      imgEl.getAttribute("xlink:href") ||
      imgEl.getAttribute("xlinkHref");
    if (href && !href.startsWith("data:") && !href.startsWith("#")) {
      const resolvedHref = new URL(href, document.baseURI).href;
      const base64 = await convertUrlToBase64(resolvedHref);
      if (base64 && base64.startsWith("data:")) {
        imgEl.setAttribute("href", base64);
        imgEl.setAttribute("xlink:href", base64);
        imgEl.removeAttribute("xlinkHref");
      }
    }
  });
  await Promise.all(promises);
};

const inlineSvgFonts = async (svgElement) => {
  const styleElements = Array.from(svgElement.querySelectorAll("style"));
  await Promise.all(styleElements.map(async (styleElement) => {
    const css = styleElement.textContent || "";
    const importMatches = [...css.matchAll(/@import\s+url\(['"]?([^'")]+)['"]?\);?/g)];
    const fontUrlMatches = [...css.matchAll(/url\((['"]?)([^'")]+)\1\)/g)];
    if (importMatches.length === 0 && fontUrlMatches.length === 0) return;

    let embeddedCss = css;
    for (const match of importMatches) {
      try {
        const stylesheetUrl = new URL(match[1], document.baseURI).href;
        const response = await fetch(stylesheetUrl, { mode: "cors" });
        if (!response.ok) continue;
        let fontCss = await response.text();
        const fontUrls = [...fontCss.matchAll(/url\((['"]?)([^'")]+)\1\)/g)];
        for (const fontMatch of fontUrls) {
          const fontUrl = new URL(fontMatch[2], stylesheetUrl).href;
          const fontData = await convertUrlToBase64(fontUrl);
          if (typeof fontData === "string" && fontData.startsWith("data:")) {
            fontCss = fontCss.replace(fontMatch[0], `url(${fontData})`);
          }
        }
        embeddedCss = embeddedCss.replace(match[0], fontCss);
      } catch (fontError) {
        console.warn("Font embedding failed; exporting with fallback font:", fontError);
      }
    }
    for (const fontMatch of fontUrlMatches) {
      if (fontMatch[2].startsWith("data:")) continue;
      try {
        const fontUrl = new URL(fontMatch[2], document.baseURI).href;
        const fontData = await convertUrlToBase64(fontUrl);
        if (typeof fontData === "string" && fontData.startsWith("data:")) {
          embeddedCss = embeddedCss.replace(fontMatch[0], `url(${fontData})`);
        }
      } catch (fontError) {
        console.warn("Local font embedding failed; exporting with fallback font:", fontError);
      }
    }
    styleElement.textContent = embeddedCss;
  }));
};

const getRenderedSvgXml = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Boarding pass element #${elementId} not found.`);
  }

  const svgEl =
    element.tagName.toLowerCase() === "svg" ? element : element.querySelector("svg");
  if (!svgEl) {
    throw new Error(`SVG element inside #${elementId} not found.`);
  }

  const clonedSvg = svgEl.cloneNode(true);
  clonedSvg.setAttribute("width", "612");
  clonedSvg.setAttribute("height", "198");
  clonedSvg.setAttribute("viewBox", "0 0 612 198");
  await inlineSvgImages(clonedSvg);
  await inlineSvgFonts(clonedSvg);

  const serializer = new XMLSerializer();
  let svgXml = serializer.serializeToString(clonedSvg);
  if (!svgXml.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgXml = svgXml.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  }
  if (!svgXml.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    svgXml = svgXml.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  }
  return svgXml;
};

/**
 * Direct SVG-to-Canvas Conversion Engine for Boarding Pass
 */
export const boardingPassSvgToCanvas = async (
  elementId = "codex-boarding-pass-front-svg",
  scale = 3
) => {
  // 1. Ensure all custom web fonts in document are loaded
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if font ready check fails
    }
  }

  // 2. Clone the currently rendered JSX and inline every image for a portable export.
  const svgXml = await getRenderedSvgXml(elementId);

  // 5. Create Blob and rasterize onto Canvas
  const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to rasterize Boarding Pass SVG onto canvas."));
    };
    img.src = blobUrl;
  });

  const targetWidth = 612 * scale;
  const targetHeight = 198 * scale;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#0c0c0e";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  URL.revokeObjectURL(blobUrl);
  return canvas;
};

/**
 * Export Boarding Pass as High-Resolution PNG (3x Retina)
 */
export const exportBoardingPassAsImage = async (
  elementId = "codex-boarding-pass-front-svg",
  filename = "boarding_pass",
  scale = 3
) => {
  const canvas = await boardingPassSvgToCanvas(elementId, scale);

  const imgData = canvas.toDataURL("image/png", 1.0);
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.png`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

const exportCanvasAsDownload = (canvas, extension, filename, quality = 1) => {
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.${extension}`;
  link.href = canvas.toDataURL(`image/${extension}`, quality);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const boardingPassFacesToCanvas = async (frontElementId, backElementId, scale) => {
  const [frontCanvas, backCanvas] = await Promise.all([
    boardingPassSvgToCanvas(frontElementId, scale),
    boardingPassSvgToCanvas(backElementId, scale),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = frontCanvas.width;
  canvas.height = frontCanvas.height + backCanvas.height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#0c0c0e";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(frontCanvas, 0, 0);
  context.drawImage(backCanvas, 0, frontCanvas.height);
  return canvas;
};

export const exportBoardingPassFacesAsImage = async (
  frontElementId = "codex-boarding-pass-front-svg",
  backElementId = "codex-boarding-pass-back-svg",
  filename = "boarding_pass",
  scale = 3
) => {
  const canvas = await boardingPassFacesToCanvas(frontElementId, backElementId, scale);
  exportCanvasAsDownload(canvas, "png", filename);
  return true;
};

/**
 * Export Boarding Pass as High-Resolution JPG
 */
export const exportBoardingPassAsJPG = async (
  elementId = "codex-boarding-pass-front-svg",
  filename = "boarding_pass",
  quality = 0.95,
  scale = 3
) => {
  const canvas = await boardingPassSvgToCanvas(elementId, scale);

  const imgData = canvas.toDataURL("image/jpeg", quality);
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.jpg`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

export const exportBoardingPassFacesAsJPG = async (
  frontElementId = "codex-boarding-pass-front-svg",
  backElementId = "codex-boarding-pass-back-svg",
  filename = "boarding_pass",
  quality = 0.95,
  scale = 3
) => {
  const canvas = await boardingPassFacesToCanvas(frontElementId, backElementId, scale);
  exportCanvasAsDownload(canvas, "jpeg", filename, quality);
  return true;
};

/**
 * Export Boarding Pass as PDF (Supports single side or multi-page Front & Back)
 */
export const exportBoardingPassAsPDF = async (
  frontElementId = "codex-boarding-pass-front-svg",
  backElementId = "codex-boarding-pass-back-svg",
  filename = "boarding_pass"
) => {
  const frontCanvas = await boardingPassSvgToCanvas(frontElementId, 3);
  const frontImg = frontCanvas.toDataURL("image/jpeg", 0.98);

  // Standard Boarding Pass Aspect Ratio (200mm x 64.7mm)
  const pdfWidth = 210;
  const pdfHeight = (210 * 198) / 612; // approx 67.94 mm

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [pdfWidth, pdfHeight],
    compress: true,
  });

  // Page 1: Front
  pdf.addImage(frontImg, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");

  // Page 2: Back (if back element exists in DOM)
  const backEl = document.getElementById(backElementId);
  if (backEl) {
    try {
      const backCanvas = await boardingPassSvgToCanvas(backElementId, 3);
      const backImg = backCanvas.toDataURL("image/jpeg", 0.98);
      pdf.addPage([pdfWidth, pdfHeight], "landscape");
      pdf.addImage(backImg, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    } catch (backErr) {
      console.warn("Back side export for PDF skipped:", backErr);
    }
  }

  pdf.save(`${sanitizeFilename(filename)}.pdf`);
  return true;
};

/**
 * Export Boarding Pass as Raw Vector SVG
 */
export const exportBoardingPassAsSVG = async (
  elementId = "codex-boarding-pass-front-svg",
  filename = "boarding_pass"
) => {
  const svgXml = await getRenderedSvgXml(elementId);

  const blob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.svg`;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);

  return true;
};

export const exportBoardingPassFacesAsSVG = async (
  frontElementId = "codex-boarding-pass-front-svg",
  backElementId = "codex-boarding-pass-back-svg",
  filename = "boarding_pass"
) => {
  const [frontXml, backXml] = await Promise.all([
    getRenderedSvgXml(frontElementId),
    getRenderedSvgXml(backElementId),
  ]);
  const parser = new DOMParser();
  const frontDocument = parser.parseFromString(frontXml, "image/svg+xml");
  const backDocument = parser.parseFromString(backXml, "image/svg+xml");
  const combinedXml = [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="612" height="396" viewBox="0 0 612 396">',
    `<svg x="0" y="0" width="612" height="198" viewBox="0 0 612 198">${frontDocument.documentElement.innerHTML}</svg>`,
    `<svg x="0" y="198" width="612" height="198" viewBox="0 0 612 198">${backDocument.documentElement.innerHTML}</svg>`,
    "</svg>",
  ].join("");
  const blob = new Blob([combinedXml], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.svg`;
  link.href = blobUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
  return true;
};
