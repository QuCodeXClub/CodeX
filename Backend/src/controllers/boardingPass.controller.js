import { BoardingPass } from '../models/boardingPass.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { boardingPassEmail } from '../utils/emailTemplates.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import crypto from 'crypto';
import { generateQRCodeWithLogo } from '../utils/qrGenerator.js';
import path from 'path';
import os from 'os';
const generateBulkBoardingPasses = asyncHandler(async (req, res) => {
  const { eventName, eventDescription, qid, studentsStr } = req.body;
  
  if (!eventName || !eventDescription || !qid || !studentsStr) {
    throw new ApiError(400, 'Event Name, Event Description, QID, and students data are required');
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

  const createdBoardingPasses = [];

  for (const student of students) {
    if (!student.name || !student.email) continue;

    const boardingPassId = crypto.randomBytes(8).toString('hex'); // Generate unique ID

    // Send email with boarding pass link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-boarding-pass/${boardingPassId}`;
    
    // Generate QR Code
    let qrCodeUrl = '';
    try {
      const dataUri = await generateQRCodeWithLogo(verificationLink);
      const qrUpload = await uploadOnCloudinary(dataUri, 'CodeX/pass');
      if (qrUpload) {
        qrCodeUrl = qrUpload.url;
      }
    } catch (qrError) {
      console.error("Failed to generate/upload QR code for boarding pass:", qrError);
    }

    const pass = await BoardingPass.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDescription,
      qid,
      wifiUser: student.wifiUser,
      wifiPass: student.wifiPass,
      loginUser: student.loginUser,
      loginPass: student.loginPass,
      citeNumber: student.citeNumber,
      boardingPassId,
      qrCodeImage: qrCodeUrl,
    });

    createdBoardingPasses.push(pass);
    
    const { html, text } = boardingPassEmail({
      studentName: student.name,
      eventName,
      eventDescription,
      qid,
      boardingPassId,
      citeNumber: student.citeNumber,
      verificationLink,
    });

    // Send async without blocking
    sendEmail({
      email: student.email,
      subject: `Your Boarding Pass for ${eventName}`,
      message: html,
      textMessage: text,
    }).catch(err => console.error("Failed to send boarding pass email to", student.email, ":", err));
  }

  return res.status(201).json(new ApiResponse(201, { count: createdBoardingPasses.length }, 'Boarding passes generated and emails sent successfully'));
});

const verifyBoardingPass = asyncHandler(async (req, res) => {
  const { boardingPassId } = req.params;

  if (!boardingPassId) {
    throw new ApiError(400, 'Boarding Pass ID is required');
  }

  const boardingPass = await BoardingPass.findOne({ boardingPassId });

  if (!boardingPass) {
    throw new ApiError(404, 'Invalid Boarding Pass ID');
  }

  return res.status(200).json(new ApiResponse(200, boardingPass, 'Boarding pass verified successfully'));
});

export { generateBulkBoardingPasses, verifyBoardingPass };
