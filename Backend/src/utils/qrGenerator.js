import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cachedLogoDataUri = null;

/**
 * Reads the logo from local assets and converts it to a Base64 Data URI.
 * Caches the result in memory to avoid repeated disk reads.
 * 
 * @returns {string} Base64 SVG Data URI
 */
const getLogoDataUri = () => {
  if (cachedLogoDataUri) {
    return cachedLogoDataUri;
  }

  try {
    const logoPath = path.join(__dirname, '../assets/codex-logo.svg');
    const logoBuffer = fs.readFileSync(logoPath);
    const base64 = logoBuffer.toString('base64');
    cachedLogoDataUri = `data:image/svg+xml;base64,${base64}`;
    return cachedLogoDataUri;
  } catch (error) {
    console.warn("Local logo not found or unreadable:", error.message);
    throw error;
  }
};

/**
 * Generates a highly reliable SVG QR Code and composites the CodeX logo in the center.
 * Implements best practices for digital QR codes.
 * Returns the final image as a Base64 Data URI to skip disk I/O.
 * 
 * @param {string} data - The data/URL to encode in the QR code.
 * @returns {Promise<string>} Base64 Data URI of the final SVG
 */
export const generateQRCodeWithLogo = async (data) => {
  if (!data) {
    throw new Error('Data is required to generate QR code.');
  }

  try {
    // 1. Generate the base QR Code as an SVG string.
    const svgString = await QRCode.toString(data, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      width: 400, // External display width
      margin: 4,  // Increased quiet zone for better scan reliability
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    let finalSvg = svgString;

    try {
      // 2. Retrieve the cached base64 logo
      const logoDataUri = getLogoDataUri();

      // 3. Dynamically calculate dimensions based on the SVG viewBox.
      const viewBoxMatch = svgString.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);

      if (viewBoxMatch) {
        const size = parseFloat(viewBoxMatch[1]);

        // 4. Calculate logo size and positioning
        const logoSize = size * 0.19;
        const logoOffset = (size - logoSize) / 2;

        // 5. Calculate white rounded rectangle padding and size
        const padding = logoSize * 0.125;
        const rectSize = logoSize + (padding * 2);
        const rectOffset = (size - rectSize) / 2;
        const rectRadius = rectSize * 0.15;

        // 6. Build the SVG overlay
        const logoOverlay = `
          <rect 
            x="${rectOffset.toFixed(2)}" 
            y="${rectOffset.toFixed(2)}" 
            width="${rectSize.toFixed(2)}" 
            height="${rectSize.toFixed(2)}" 
            rx="${rectRadius.toFixed(2)}" 
            ry="${rectRadius.toFixed(2)}" 
            fill="#ffffff" 
          />
          <image 
            x="${logoOffset.toFixed(2)}" 
            y="${logoOffset.toFixed(2)}" 
            width="${logoSize.toFixed(2)}" 
            height="${logoSize.toFixed(2)}" 
            href="${logoDataUri}" 
          />
        `;

        // 7. Inject the overlay just before the closing </svg> tag
        finalSvg = svgString.replace('</svg>', `${logoOverlay}</svg>`);
      } else {
        console.warn("Could not parse viewBox from generated QR code. Skipping logo overlay.");
      }
    } catch (logoError) {
      console.warn("Could not fetch or embed logo. Generating QR code without logo. Error:", logoError.message);
    }

    // 8. Return as Base64 Data URI directly
    const base64Svg = Buffer.from(finalSvg).toString('base64');
    return `data:image/svg+xml;base64,${base64Svg}`;

  } catch (error) {
    console.error("Critical error generating SVG QR code:", error);
    throw new Error(`QR Generation failed: ${error.message}`);
  }
};
