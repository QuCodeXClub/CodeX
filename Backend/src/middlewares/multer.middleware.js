import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";

// Ensure the temp directory exists
const tempDir = path.resolve("public/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const randomHex = crypto.randomBytes(8).toString("hex");
    const sanitizedExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/gi, '');
    const cleanFieldName = file.fieldname.replace(/[^a-z0-9_-]/gi, '');
    cb(null, `${cleanFieldName}-${Date.now()}-${randomHex}${sanitizedExt}`);
  },
});

// Allowed MIME types & extensions for production security
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/csv',
  'application/vnd.ms-excel',
  'text/plain',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.svg',
  '.pdf',
  '.csv',
]);

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(mime)) {
    return cb(
      new ApiError(
        400,
        `File type "${ext || mime}" is not permitted. Allowed formats: JPG, PNG, WEBP, SVG, PDF, CSV.`
      ),
      false
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum per file
    files: 5, // Maximum 5 files per request
  },
});

