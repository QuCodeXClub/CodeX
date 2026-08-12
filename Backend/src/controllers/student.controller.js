import { StudentRegistration } from '../models/studentRegistration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { verifyTurnstileToken } from '../utils/turnstile.js';

const registerStudent = asyncHandler(async (req, res) => {
  const {
    name,
    fatherName,
    course,
    year,
    semester,
    section,
    set,
    studentId,
    email,
    phone,
    transactionId,
    turnstileToken,
  } = req.body;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

  // 1. Verify Bot Token
  if (!turnstileToken) {
    throw new ApiError(400, 'Bot verification token is missing');
  }

  const isHuman = await verifyTurnstileToken(turnstileToken, clientIp);
  if (!isHuman) {
    throw new ApiError(400, 'Bot verification failed. Please try again.');
  }

  // 2. Validate Required Fields
  if (
    [name, fatherName, course, year, semester, section, set, studentId, email, phone, transactionId].some(
      (field) => !field || field.toString().trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // 3. Check for existing registration with same transactionId or studentId
  const existingRegistration = await StudentRegistration.findOne({
    $or: [{ transactionId }, { studentId }]
  });

  if (existingRegistration) {
    if (existingRegistration.studentId === studentId) {
      throw new ApiError(400, 'Student ID (Q ID) is already registered');
    }
    if (existingRegistration.transactionId === transactionId) {
      throw new ApiError(400, 'Transaction ID already used for another registration');
    }
  }

  // 4. Create Registration
  const registration = await StudentRegistration.create({
    name,
    fatherName,
    course,
    year,
    semester,
    section,
    set,
    studentId,
    email,
    phone,
    transactionId,
  });

  return res.status(201).json(
    new ApiResponse(201, registration, 'Registration submitted successfully. Please wait for admin approval.')
  );
});

export { registerStudent };
