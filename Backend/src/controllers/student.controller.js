import { StudentRegistration } from '../models/studentRegistration.model.js';
import { SpecialUtr } from '../models/specialUtr.model.js';
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

  const normalizedUtr = transactionId.toString().trim().toUpperCase();

  // 3. Check if Student ID (Q ID) is already registered
  const existingStudent = await StudentRegistration.findOne({ studentId });
  if (existingStudent) {
    throw new ApiError(400, 'Student ID (Q ID) is already registered');
  }

  // 4. Check if transactionId matches an unused Special UTR (Admin Fixed UTR)
  const specialUtrDoc = await SpecialUtr.findOne({
    code: normalizedUtr,
    isUsed: false,
  });

  let paymentMode = 'ONLINE';
  let initialStatus = 'PENDING';

  if (specialUtrDoc) {
    // Valid Special UTR provided by Admin
    paymentMode = 'SPECIAL';
    initialStatus = 'APPROVED'; // Special UTR entries are pre-verified via Cash
  } else {
    // Normal UTR check for duplicates
    const existingTx = await StudentRegistration.findOne({ transactionId: normalizedUtr });
    if (existingTx) {
      throw new ApiError(400, 'Transaction ID / UTR already used for another registration');
    }
  }

  // 5. Create Registration
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
    transactionId: normalizedUtr,
    paymentMode,
    status: initialStatus,
  });

  // 6. If Special UTR was used, mark it as used and link to registration
  if (specialUtrDoc) {
    specialUtrDoc.isUsed = true;
    specialUtrDoc.usedBy = registration._id;
    specialUtrDoc.usedAt = new Date();
    await specialUtrDoc.save();
  }

  const successMessage = paymentMode === 'SPECIAL'
    ? 'Special Registration completed and pre-approved successfully!'
    : 'Registration submitted successfully. Please wait for admin approval.';

  return res.status(201).json(
    new ApiResponse(201, registration, successMessage)
  );
});

export { registerStudent };
