import jsPDF from "jspdf";

/**
 * Sanitize output download filename
 */
const sanitizeFilename = (name) => {
  return (name || "certificate")
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
    if (href && (href.startsWith("http://") || href.startsWith("https://"))) {
      const base64 = await convertUrlToBase64(href);
      if (base64 && base64.startsWith("data:")) {
        imgEl.setAttribute("href", base64);
        imgEl.setAttribute("xlink:href", base64);
        imgEl.removeAttribute("xlinkHref");
      }
    }
  });
  await Promise.all(promises);
};

/**
 * Direct SVG-to-Canvas Conversion Engine
 * Renders the fully embedded self-contained SVG directly to High-DPI HTML5 Canvas
 */
export const svgToCanvas = async (
  elementId = "codex-certificate-svg",
  scale = 3
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Certificate element #${elementId} not found.`);
  }

  const svgEl =
    element.tagName.toLowerCase() === "svg" ? element : element.querySelector("svg");
  if (!svgEl) {
    throw new Error(`SVG element inside #${elementId} not found.`);
  }

  // 1. Ensure all custom web fonts in document are loaded
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch {
      // Continue if font ready check fails
    }
  }

  // 2. Deep clone the SVG and enforce standard dimensions
  const clonedSvg = svgEl.cloneNode(true);
  clonedSvg.setAttribute("width", "842.25");
  clonedSvg.setAttribute("height", "595.5");
  clonedSvg.setAttribute("viewBox", "0 0 842.25 595.5");

  // 3. Inline all remote images (signatures, QR codes) as Base64 data URIs
  await inlineSvgImages(clonedSvg);

  // 4. Serialize to XML string
  const serializer = new XMLSerializer();
  let svgXml = serializer.serializeToString(clonedSvg);

  if (!svgXml.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgXml = svgXml.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  }
  if (!svgXml.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    svgXml = svgXml.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  }

  // 5. Create Blob and rasterize onto Canvas
  const svgBlob = new Blob([svgXml], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.crossOrigin = "anonymous";

  await new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      reject(new Error("Failed to rasterize certificate SVG onto canvas."));
    };
    img.src = blobUrl;
  });

  const targetWidth = 842.25 * scale;
  const targetHeight = 595.5 * scale;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  URL.revokeObjectURL(blobUrl);
  return canvas;
};

/**
 * Export certificate as High-Resolution PNG (3x Retina 300DPI)
 */
export const exportCertificateAsImage = async (
  elementId = "codex-certificate-svg",
  filename = "certificate",
  scale = 3
) => {
  const canvas = await svgToCanvas(elementId, scale);

  const imgData = canvas.toDataURL("image/png", 1.0);
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.png`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

/**
 * Export certificate as High-Resolution JPG (3x Retina 300DPI)
 */
export const exportCertificateAsJPG = async (
  elementId = "codex-certificate-svg",
  filename = "certificate",
  quality = 0.95,
  scale = 3
) => {
  const canvas = await svgToCanvas(elementId, scale);

  const imgData = canvas.toDataURL("image/jpeg", quality);
  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.jpg`;
  link.href = imgData;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
};

/**
 * Export certificate as Official A4 Landscape PDF
 */
export const exportCertificateAsPDF = async (
  elementId = "codex-certificate-svg",
  filename = "certificate"
) => {
  const canvas = await svgToCanvas(elementId, 3);
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  // Standard A4 Landscape (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Full-bleed fit to A4 landscape page
  pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
  pdf.save(`${sanitizeFilename(filename)}.pdf`);

  return true;
};

/**
 * Export certificate as Raw Vector SVG with embedded assets & fonts
 */
export const exportCertificateAsSVG = async (
  elementId = "codex-certificate-svg",
  filename = "certificate"
) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element #${elementId} not found.`);
  }

  const svgEl =
    element.tagName.toLowerCase() === "svg" ? element : element.querySelector("svg");
  if (!svgEl) {
    throw new Error(`SVG element #${elementId} not found.`);
  }

  const clonedSvg = svgEl.cloneNode(true);
  await inlineSvgImages(clonedSvg);

  const serializer = new XMLSerializer();
  let svgString = serializer.serializeToString(clonedSvg);

  if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svgString = svgString.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  }
  if (!svgString.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
    svgString = svgString.replace("<svg ", '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');
  }

  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.download = `${sanitizeFilename(filename)}.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};
