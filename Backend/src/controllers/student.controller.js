import { StudentRegistration } from '../models/studentRegistration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const verifyTurnstileToken = async (token) => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn('TURNSTILE_SECRET_KEY is not defined in env. Skipping bot check for dev.');
    return true; 
  }

  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
};

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

  // 1. Verify Bot Token
  if (!turnstileToken) {
    throw new ApiError(400, 'Bot verification token is missing');
  }

  const isHuman = await verifyTurnstileToken(turnstileToken);
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

  // 3. Check for existing registration with same transactionId
  const existingTx = await StudentRegistration.findOne({ transactionId });
  if (existingTx) {
    throw new ApiError(400, 'Transaction ID already used for another registration');
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
