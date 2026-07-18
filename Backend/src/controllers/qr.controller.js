import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/cloudinary.js';
import { generateQRCodeWithLogo } from '../utils/qrGenerator.js';
import { CustomQR } from '../models/customQR.model.js';
import crypto from 'crypto';
import path from 'path';
import os from 'os';

const generateCustomQR = asyncHandler(async (req, res) => {
  const { link } = req.body;

  if (!link) {
    throw new ApiError(400, 'Link is required to generate a QR code');
  }

  const uniqueId = crypto.randomBytes(8).toString('hex');
  const tempPath = path.join(os.tmpdir(), `custom-qr-${uniqueId}.svg`);

  try {
    await generateQRCodeWithLogo(link, tempPath);
    
    const uploadedImage = await uploadOnCloudinary(tempPath, 'CodeX/qrcodes');
    
    if (!uploadedImage) {
      throw new ApiError(500, 'Failed to upload QR code to Cloudinary');
    }

    const qrCodeUrl = uploadedImage.url;

    const customQr = await CustomQR.create({
      link,
      qrUrl: qrCodeUrl
    });

    return res.status(201).json(new ApiResponse(201, customQr, 'QR code generated and uploaded successfully'));
  } catch (error) {
    throw new ApiError(500, `Failed to generate QR code: ${error.message}`);
  }
});

const getCustomQRs = asyncHandler(async (req, res) => {
  const qrs = await CustomQR.find().sort({ createdAt: -1 }).limit(50);
  return res.status(200).json(new ApiResponse(200, qrs, 'Custom QR history fetched successfully'));
});

const deleteCustomQR = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const customQr = await CustomQR.findById(id);
  if (!customQr) {
    throw new ApiError(404, 'QR code not found');
  }

  // Delete from Cloudinary
  const publicId = getPublicIdFromUrl(customQr.qrUrl);
  if (publicId) {
    await deleteFromCloudinary(publicId);
  }

  // Delete from DB
  await CustomQR.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, 'QR code deleted successfully'));
});

export { generateCustomQR, getCustomQRs, deleteCustomQR };
