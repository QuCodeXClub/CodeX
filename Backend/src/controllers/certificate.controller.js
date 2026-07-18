import { Certificate } from '../models/certificate.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { sendEmail } from '../utils/sendEmail.js';
import { certificateEmail } from '../utils/emailTemplates.js';
import crypto from 'crypto';
import { generateQRCodeWithLogo } from '../utils/qrGenerator.js';
import path from 'path';
import os from 'os';

const generateBulkCertificates = asyncHandler(async (req, res) => {
  const { eventName, eventDate, coordinatorName, studentsStr, signatureImageUrl } = req.body;
  
  if (!eventName || !eventDate || !coordinatorName || !studentsStr) {
    throw new ApiError(400, 'All fields are required');
  }

  let students;
  try {
    students = JSON.parse(studentsStr);
  } catch (e) {
    throw new ApiError(400, 'Invalid students data format');
  }

  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiError(400, 'Students array is required');
  }

  let finalSignatureUrl = signatureImageUrl;

  if (!finalSignatureUrl) {
    const signatureLocalPath = req.file?.path;
    if (!signatureLocalPath) {
      throw new ApiError(400, 'Signature image is required');
    }

    const signatureImage = await uploadOnCloudinary(signatureLocalPath, 'CodeX/certificate');
    if (!signatureImage) {
      throw new ApiError(500, 'Error while uploading signature image');
    }
    finalSignatureUrl = signatureImage.url;
  }

  const createdCertificates = [];

  for (const student of students) {
    if (!student.name || !student.email) continue;

    const certificateId = crypto.randomBytes(8).toString('hex'); // Generate unique ID

    // Send email with certificate link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;
    
    // Generate QR Code
    let qrCodeUrl = '';
    try {
      const dataUri = await generateQRCodeWithLogo(verificationLink);
      const qrUpload = await uploadOnCloudinary(dataUri, 'CodeX/certificate');
      if (qrUpload) {
        qrCodeUrl = qrUpload.url;
      }
    } catch (qrError) {
      console.error("Failed to generate/upload QR code:", qrError);
    }

    const cert = await Certificate.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDate,
      coordinatorName,
      signatureImage: finalSignatureUrl,
      certificateId,
      position: student.position || 'Participant',
      qrCodeImage: qrCodeUrl,
    });

    createdCertificates.push(cert);
    
    const { html, text } = certificateEmail({
      studentName: student.name,
      eventName,
      certificateId,
      verificationLink,
      position: student.position || 'Participant',
    });

    // Send async without blocking
    sendEmail({
      email: student.email,
      subject: `Your Certificate for ${eventName}`,
      message: html,
      textMessage: text,
    }).catch(err => console.error("Failed to send certificate email to", student.email, ":", err));
  }

  return res.status(201).json(new ApiResponse(201, { count: createdCertificates.length }, 'Certificates generated and emails sent successfully'));
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  if (!certificateId) {
    throw new ApiError(400, 'Certificate ID is required');
  }

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    throw new ApiError(404, 'Invalid Certificate ID');
  }

  return res.status(200).json(new ApiResponse(200, certificate, 'Certificate verified successfully'));
});

const getLatestSignature = asyncHandler(async (req, res) => {
  const latestCertificate = await Certificate.findOne().sort({ createdAt: -1 });
  
  if (!latestCertificate || !latestCertificate.signatureImage) {
    return res.status(200).json(new ApiResponse(200, { signatureUrl: null }, 'No previous signature found'));
  }

  return res.status(200).json(new ApiResponse(200, { signatureUrl: latestCertificate.signatureImage }, 'Latest signature fetched successfully'));
});

export { generateBulkCertificates, verifyCertificate, getLatestSignature };
