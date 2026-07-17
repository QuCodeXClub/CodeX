import { BoardingPass } from '../models/boardingPass.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { boardingPassEmail } from '../utils/emailTemplates.js';
import crypto from 'crypto';

const generateBulkBoardingPasses = asyncHandler(async (req, res) => {
  const { eventName, eventDescription, qid, wifiUser, wifiPass, loginUser, loginPass, studentsStr } = req.body;
  
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

    const pass = await BoardingPass.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDescription,
      qid,
      wifiUser,
      wifiPass,
      loginUser,
      loginPass,
      boardingPassId,
    });

    createdBoardingPasses.push(pass);

    // Send email with boarding pass link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-boarding-pass/${boardingPassId}`;
    
    const { html, text } = boardingPassEmail({
      studentName: student.name,
      eventName,
      eventDescription,
      qid,
      boardingPassId,
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
