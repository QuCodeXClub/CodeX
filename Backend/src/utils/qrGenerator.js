import QRCode from 'qrcode';
import fs from 'fs';
import https from 'https';
import { LOGO_URL } from '../constants.js';

let cachedLogoDataUri = null;

/**
 * Downloads the logo and converts it to a Base64 Data URI.
 * Caches the result in memory to avoid repeated network requests.
 * 
 * @returns {Promise<string>} Base64 SVG Data URI
 */
const getLogoDataUri = () => {
  return new Promise((resolve, reject) => {
    // Return cached version if available
    if (cachedLogoDataUri) {
      return resolve(cachedLogoDataUri);
    }

    // Fetch from HTTPS
    https.get(LOGO_URL, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch logo: HTTP status ${res.statusCode}`));
      }

      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        const base64 = buffer.toString('base64');
        cachedLogoDataUri = `data:image/svg+xml;base64,${base64}`;
        resolve(cachedLogoDataUri);
      });
    }).on('error', err => reject(new Error(`Network error while fetching logo: ${err.message}`)));
  });
};

/**
 * Generates a highly reliable SVG QR Code and composites the CodeX logo in the center.
 * Implements best practices for digital QR codes (e.g. used by standard ticketing systems).
 * 
 * @param {string} data - The data/URL to encode in the QR code.
 * @param {string} tempFilePath - The local file path to save the generated SVG.
 * @returns {Promise<boolean>} True if successful.
 */
export const generateQRCodeWithLogo = async (data, tempFilePath) => {
  if (!data || !tempFilePath) {
    throw new Error('Data and tempFilePath are required to generate QR code.');
  }

  try {
    // 1. Generate the base QR Code as an SVG string.
    // - Error Correction Level 'H' allows up to 30% of the QR code to be covered/damaged.
    // - Margin 4 ensures a sufficient quiet zone for scanners (especially Google Lens/iOS).
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
      const logoDataUri = await getLogoDataUri();

      // 3. Dynamically calculate dimensions based on the SVG viewBox.
      // The viewBox defines the internal coordinate system (e.g., viewBox="0 0 45 45").
      const viewBoxMatch = svgString.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);

      if (viewBoxMatch) {
        const size = parseFloat(viewBoxMatch[1]);

        // 4. Calculate logo size and positioning
        // Requirement: Logo should cover ~18-20% of the QR width. We use 19%.
        // This easily prevents overlapping the finder patterns (which are 7 modules wide in the corners).
        const logoSize = size * 0.19;
        const logoOffset = (size - logoSize) / 2;

        // 5. Calculate white rounded rectangle padding and size
        // Requirement: 10-15% padding around the logo. We use 12.5% padding per side.
        const padding = logoSize * 0.125;
        const rectSize = logoSize + (padding * 2);
        const rectOffset = (size - rectSize) / 2;

        // Requirement: Rounded corners. We use 15% of the rect size for a smooth radius.
        const rectRadius = rectSize * 0.15;

        // 6. Build the SVG overlay
        // We inject a white `<rect>` for the background and an `<image>` for the logo.
        // SVG renders in order, so the white rect covers the QR paths, and the logo sits on top.
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
      // Graceful fallback: If logo fetching fails, we still generate a valid standard QR code.
      console.warn("Could not fetch or embed logo. Generating QR code without logo. Error:", logoError.message);
    }

    // 8. Write the final composite SVG to the temporary file synchronously
    fs.writeFileSync(tempFilePath, finalSvg, 'utf8');

    return true;
  } catch (error) {
    console.error("Critical error generating SVG QR code:", error);
    throw new Error(`QR Generation failed: ${error.message}`);
  }
};
