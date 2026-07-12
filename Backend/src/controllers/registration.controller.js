import { StudentRegistration } from '../models/studentRegistration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { registrationApprovedEmail, registrationRejectedEmail } from '../utils/emailTemplates.js';

// Get all registrations (Admin only)
const getAllRegistrations = asyncHandler(async (req, res) => {
  const { status, search, academicYear, paymentMode, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { transactionId: { $regex: search, $options: 'i' } },
    ];
  }
  
  if (paymentMode && paymentMode !== 'ALL') {
    if (paymentMode === 'ONLINE') {
        query.paymentMode = { $ne: 'CASH' };
    } else {
        query.paymentMode = paymentMode;
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

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const skip = (options.page - 1) * options.limit;

  const registrations = await StudentRegistration.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(options.limit);

  const total = await StudentRegistration.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        registrations,
        total,
        page: options.page,
        totalPages: Math.ceil(total / options.limit),
      },
      'Registrations fetched successfully'
    )
  );
});

// Update registration status (Admin only)
const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    throw new ApiError(400, 'Invalid status');
  }

  const registration = await StudentRegistration.findById(id);

  if (!registration) {
    throw new ApiError(404, 'Registration not found');
  }

  if (registration.status === status) {
    throw new ApiError(400, `Registration is already ${status}`);
  }

  registration.status = status;
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
    const { html, text } = registrationRejectedEmail(registration.name);
    // Send email (async)
    sendEmail({
      email: registration.email,
      subject: 'CodeX Registration Update',
      message: html,
      textMessage: text,
    }).catch(err => console.error("Failed to send rejection email:", err));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, registration, `Registration ${status.toLowerCase()} successfully`));
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

export { getAllRegistrations, updateRegistrationStatus, addManualRegistration };
