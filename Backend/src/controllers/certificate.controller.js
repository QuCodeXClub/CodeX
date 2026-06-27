import { Certificate } from '../models/certificate.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { sendEmail } from '../utils/sendEmail.js';
import crypto from 'crypto';

const generateBulkCertificates = asyncHandler(async (req, res) => {
  const { eventName, eventDate, coordinatorName, studentsStr } = req.body;
  
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

  const signatureLocalPath = req.file?.path;
  if (!signatureLocalPath) {
    throw new ApiError(400, 'Signature image is required');
  }

  const signatureImage = await uploadOnCloudinary(signatureLocalPath);
  if (!signatureImage) {
    throw new ApiError(500, 'Error while uploading signature image');
  }

  const createdCertificates = [];

  for (const student of students) {
    if (!student.name || !student.email) continue;

    const certificateId = crypto.randomBytes(8).toString('hex'); // Generate unique ID

    const cert = await Certificate.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDate,
      coordinatorName,
      signatureImage: signatureImage.url,
      certificateId,
    });

    createdCertificates.push(cert);

    // Send email with certificate link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;
    
    const message = `
      <h2>Certificate of Participation</h2>
      <p>Dear ${student.name},</p>
      <p>Congratulations on participating in <strong>${eventName}</strong>.</p>
      <p>Your certificate is ready. You can view, download, and verify it using the link below:</p>
      <a href="${verificationLink}" style="display:inline-block;padding:10px 20px;background:#06b6d4;color:white;text-decoration:none;border-radius:5px;">View Certificate</a>
      <br /><br />
      <p>Or use this verification ID directly on our website: <strong>${certificateId}</strong></p>
      <p>Best regards,<br/>The CodeX Team</p>
    `;

    // Send async without blocking
    sendEmail({
      email: student.email,
      subject: `Your Certificate for ${eventName}`,
      message,
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

export { generateBulkCertificates, verifyCertificate };
