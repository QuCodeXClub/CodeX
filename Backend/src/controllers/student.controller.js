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
    acceptedTerms,
  } = req.body;
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

  // 1. Verify Bot Token
  if (!turnstileToken) {
    throw new ApiError(400, 'Bot verification token is missing');
  }

  const isHuman = await verifyTurnstileToken(turnstileToken, clientIp, 'register');
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

  if (acceptedTerms === false || acceptedTerms === 'false') {
    throw new ApiError(400, 'You must accept the Terms and Conditions to register');
  }

  // 3. Check for existing active registration with same transactionId or studentId (excluding REJECTED)
  const existingRegistration = await StudentRegistration.findOne({
    status: { $in: ['PENDING', 'APPROVED'] },
    $or: [{ transactionId }, { studentId }]
  });

  if (existingRegistration) {
    if (existingRegistration.studentId === studentId) {
      throw new ApiError(400, 'A registration with this Student ID (Q-ID) already exists');
    }
    if (existingRegistration.transactionId === transactionId) {
      throw new ApiError(400, 'A registration with this Transaction UTR already exists');
    }
  }

  // 4. Create Registration with high-concurrency race condition safety
  try {
    const registration = await StudentRegistration.create({
      name: name.trim(),
      fatherName: fatherName.trim(),
      course,
      year,
      semester,
      section: section.trim(),
      set: set.trim(),
      studentId: studentId.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      transactionId: transactionId.trim(),
    });

    return res.status(201).json(
      new ApiResponse(201, registration, 'Registration submitted successfully. Please wait for admin approval.')
    );
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      if (field === 'studentId') {
        throw new ApiError(400, 'A registration with this Student ID (Q-ID) is already registered.');
      }
      if (field === 'transactionId') {
        throw new ApiError(400, 'A registration with this Transaction UTR already exists.');
      }
      throw new ApiError(400, 'A duplicate registration already exists.');
    }
    throw error;
  }
});

export { registerStudent };
