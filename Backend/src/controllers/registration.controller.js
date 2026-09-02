import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { StudentRegistration } from '../models/studentRegistration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { registrationApprovedEmail, registrationRejectedEmail } from '../utils/emailTemplates.js';

const tempUploadDir = path.resolve('public/temp');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const toSafeQueryString = (value, maxLength = 50) => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
};

const inAllowedSet = (value, allowedValues) => allowedValues.includes(value);

const resolveSafeTempFilePath = (filePath) => {
  if (!filePath || typeof filePath !== 'string') {
    throw new ApiError(400, 'Invalid file path');
  }

  const absolutePath = path.resolve(filePath);
  const relativePath = path.relative(tempUploadDir, absolutePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new ApiError(400, 'Invalid uploaded file path');
  }

  return absolutePath;
};

const removeTempFile = (absolutePath) => {
  if (!absolutePath) return;
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
};

// Get all registrations (Admin only)
const getAllRegistrations = asyncHandler(async (req, res) => {
  const defaultLimit = process.env.NODE_ENV === 'development' ? 10 : 100;
  const { status, search, academicYear, paymentMode, course, page = 1, limit = defaultLimit, since } = req.query;

  const safeStatus = toSafeQueryString(status);
  const safeCourse = toSafeQueryString(course);
  const safePaymentMode = toSafeQueryString(paymentMode);

  const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
  const allowedPaymentModes = ['CASH', 'ONLINE', 'UPI', 'CARD', 'BANK_TRANSFER'];

  const query = {};
  if (safeStatus && inAllowedSet(safeStatus, allowedStatuses)) query.status = safeStatus;
  if (safeCourse && safeCourse !== 'ALL') query.course = safeCourse;
  if (search) {
    const escapedSearch = escapeRegExp(String(search).trim()).slice(0, 100);
    query.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } },
      { studentId: { $regex: escapedSearch, $options: 'i' } },
      { transactionId: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  if (safePaymentMode && safePaymentMode !== 'ALL' && inAllowedSet(safePaymentMode, allowedPaymentModes)) {
    if (safePaymentMode === 'ONLINE') {
      query.paymentMode = { $ne: 'CASH' };
    } else {
      query.paymentMode = safePaymentMode;
    }
  }

  if (academicYear && academicYear !== 'ALL') {
    const [startYear] = academicYear.split("-");
    const startDate = new Date(`${startYear}-06-01T00:00:00.000Z`);
    const endDate = new Date(`${parseInt(startYear) + 1}-06-01T00:00:00.000Z`);
    query.createdAt = {
      $gte: startDate,
      $lt: endDate
    };
  }

  const baseQuery = { ...query };

  if (since) {
    const sinceDate = new Date(since);
    if (!isNaN(sinceDate.getTime())) {
      if (query.createdAt) {
        query.createdAt = { ...query.createdAt, $gt: sinceDate };
      } else {
        query.createdAt = { $gt: sinceDate };
      }
    }
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const skip = (options.page - 1) * options.limit;

  const registrations = await StudentRegistration.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(options.limit);

  const total = await StudentRegistration.countDocuments(baseQuery);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        registrations,
        total,
        page: options.page,
        totalPages: Math.ceil(total / options.limit),
        newCount: since ? registrations.length : undefined,
      },
      'Registrations fetched successfully'
    )
  );
});

// Update registration status (Admin only)
const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason, rejectionReason } = req.body;
  const finalReason = rejectionReason || reason || '';

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const registration = await StudentRegistration.findById(id);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status === status && status !== 'REJECTED') {
    throw new ApiError(400, `Registration is already ${status}`);
  }

  registration.status = status;
  if (status === 'REJECTED' && finalReason) {
    registration.rejectionReason = finalReason;
  }
  await registration.save();

  // Send email notification
  if (status === 'APPROVED') {
    const { html, text } = registrationApprovedEmail(registration.name);

    // Send email (async)
    sendEmail({
      email: registration.email,
      subject: 'Welcome to CodeX - Registration Approved',
      message: html,
      textMessage: text,
    }).catch(err => console.error("Failed to send approval email:", err));
  } else if (status === 'REJECTED') {
    const { html, text } = registrationRejectedEmail(registration.name, finalReason);
    // Send email (async)
    sendEmail({
      email: registration.email,
      subject: 'CodeX Registration Update - Application Rejected',
      message: html,
      textMessage: text,
    }).catch(err => console.error("Failed to send rejection email:", err));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, registration, `Registration ${status.toLowerCase()} successfully`));
});

// Update registration details (Admin only)
const updateRegistrationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
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
    paymentMode,
    status,
    rejectionReason,
  } = req.body;

  const registration = await StudentRegistration.findById(id);
  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (name !== undefined) registration.name = String(name).trim();
  if (fatherName !== undefined) registration.fatherName = String(fatherName).trim();
  if (course !== undefined) registration.course = course;
  if (year !== undefined) registration.year = year;
  if (semester !== undefined) registration.semester = semester;
  if (section !== undefined) registration.section = String(section).trim();
  if (set !== undefined) registration.set = String(set).trim();
  if (email !== undefined) registration.email = String(email).trim().toLowerCase();
  if (phone !== undefined) registration.phone = String(phone).trim();
  if (paymentMode !== undefined) registration.paymentMode = paymentMode;

  if (status !== undefined) {
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      throw new ApiError(400, 'Invalid status value');
    }
    registration.status = status;
    if (status === 'REJECTED') {
      registration.rejectionReason = rejectionReason || registration.rejectionReason || '';
    } else {
      registration.rejectionReason = '';
    }
  }

  // If studentId changed, check for conflict with other active registrations
  if (studentId !== undefined && studentId.trim() !== registration.studentId) {
    const trimmedId = studentId.trim();
    const existing = await StudentRegistration.findOne({
      _id: { $ne: id },
      studentId: trimmedId,
      status: { $in: ['PENDING', 'APPROVED'] },
    });
    if (existing) {
      throw new ApiError(400, `Student ID (Q-ID) ${trimmedId} is already registered to another active applicant`);
    }
    registration.studentId = trimmedId;
  }

  // If transactionId changed, check for conflict with other active registrations
  if (transactionId !== undefined && transactionId.trim() !== registration.transactionId) {
    const trimmedTx = transactionId.trim();
    const existing = await StudentRegistration.findOne({
      _id: { $ne: id },
      transactionId: trimmedTx,
      status: { $in: ['PENDING', 'APPROVED'] },
    });
    if (existing) {
      throw new ApiError(400, `Transaction ID ${trimmedTx} is already registered to another active applicant`);
    }
    registration.transactionId = trimmedTx;
  }

  await registration.save();

  return res
    .status(200)
    .json(new ApiResponse(200, registration, 'Registration details updated successfully'));
});

// Add Manual Registration (Admin only)
const addManualRegistration = asyncHandler(async (req, res) => {
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
  } = req.body;

  if (
    [name, fatherName, course, year, semester, section, set, studentId, email, phone].some(
      (field) => !field || field.toString().trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check if studentId already exists (excluding REJECTED)
  const existingRegistration = await StudentRegistration.findOne({
    studentId: { $eq: studentId },
    status: { $in: ['PENDING', 'APPROVED'] },
  });
  if (existingRegistration) {
    throw new ApiError(400, `Student ID (Q ID) is already registered (${existingRegistration.status.toLowerCase()})`);
  }

  // Generate a mock transaction ID for cash
  const transactionId = `CASH-${Date.now()}`;

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
    paymentMode: 'CASH',
    status: 'APPROVED', // Default to approved since it's manual admin entry
  });

  // Optional: Send welcome email for manual registration here if desired
  const { html, text } = registrationApprovedEmail(registration.name);
  sendEmail({
    email: registration.email,
    subject: 'Welcome to CodeX - Registration Approved (Cash)',
    message: html,
    textMessage: text,
  }).catch(err => console.error("Failed to send approval email:", err));

  return res.status(201).json(
    new ApiResponse(201, registration, 'Manual registration added successfully')
  );
});


// Add Bulk Registration (Admin only)
const bulkRegistration = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload a CSV file");
  }

  const results = [];
  const errors = [];
  let rowCount = 0;
  const tempFilePath = resolveSafeTempFilePath(req.file.path);

  fs.createReadStream(tempFilePath)
    .pipe(csv())
    .on('data', (data) => {
      rowCount++;
      // Clean up keys and values
      const cleanData = {};
      for (const [key, value] of Object.entries(data)) {
        cleanData[key.trim()] = value.trim();
      }

      const { name, fatherName, course, year, semester, section, set, studentId, email, phone } = cleanData;

      if (!name || !fatherName || !course || !year || !semester || !section || !set || !studentId || !email || !phone) {
        errors.push(`Row ${rowCount}: Missing required fields.`);
        return;
      }

      results.push({
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
        transactionId: cleanData.transactionId || `CASH-${Date.now()}-${rowCount}`,
        paymentMode: cleanData.paymentMode || 'CASH',
        status: 'APPROVED'
      });
    })
    .on('end', async () => {
      removeTempFile(tempFilePath);

      if (results.length === 0) {
        return res.status(400).json(
          new ApiResponse(400, { errors }, "No valid rows found to import")
        );
      }

      const emails = results.map(r => r.email);
      const studentIds = results.map(r => r.studentId);

      const existingStudents = await StudentRegistration.find({
        $or: [
          { email: { $in: emails } },
          { studentId: { $in: studentIds } }
        ]
      });

      const existingEmails = new Set(existingStudents.map(s => s.email));
      const existingStudentIds = new Set(existingStudents.map(s => s.studentId));

      const uniqueResults = [];
      const seenEmails = new Set();
      const seenStudentIds = new Set();

      for (const row of results) {
        if (!seenEmails.has(row.email) && !seenStudentIds.has(row.studentId)) {
          uniqueResults.push(row);
          seenEmails.add(row.email);
          seenStudentIds.add(row.studentId);
        } else {
          errors.push(`Duplicate inside CSV skipped: ${row.email} or ${row.studentId}`);
        }
      }

      const newStudents = [];
      for (const s of uniqueResults) {
        if (existingStudentIds.has(s.studentId)) {
          errors.push(`Skipped: Student ID (Q ID) ${s.studentId} is already registered.`);
        } else if (existingEmails.has(s.email)) {
          errors.push(`Skipped: Email ${s.email} is already registered.`);
        } else {
          newStudents.push(s);
        }
      }

      const skippedCount = results.length - newStudents.length;

      if (newStudents.length > 0) {
        await StudentRegistration.insertMany(newStudents);
      }

      return res.status(200).json(
        new ApiResponse(200, {
          importedCount: newStudents.length,
          skippedCount,
          errors
        }, `Successfully imported ${newStudents.length} students. Skipped ${skippedCount} duplicates.`)
      );
    })
    .on('error', (error) => {
      removeTempFile(tempFilePath);
      res.status(500).json(new ApiResponse(500, null, "Error parsing CSV file"));
    });
});

export {
  getAllRegistrations,
  updateRegistrationStatus,
  updateRegistrationDetails,
  addManualRegistration,
  bulkRegistration,
};
