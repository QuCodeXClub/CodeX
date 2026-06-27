import { StudentRegistration } from '../models/studentRegistration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';

// Get all registrations (Admin only)
const getAllRegistrations = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

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
    const message = `
      <h2>Welcome to CodeX!</h2>
      <p>Dear ${registration.name},</p>
      <p>Your registration for CodeX has been <strong>approved</strong>.</p>
      <p>We are excited to have you onboard. Keep an eye out for upcoming events and announcements.</p>
      <br />
      <p>Best regards,<br/>The CodeX Team</p>
    `;
    
    // We send email asynchronously without blocking the response
    sendEmail({
      email: registration.email,
      subject: 'CodeX Registration Approved',
      message,
    }).catch(err => console.error("Failed to send approval email:", err));
  } else if (status === 'REJECTED') {
      const message = `
      <h2>CodeX Registration Update</h2>
      <p>Dear ${registration.name},</p>
      <p>We regret to inform you that your registration for CodeX could not be approved at this time.</p>
      <p>If you believe this is a mistake, please contact our support team.</p>
      <br />
      <p>Best regards,<br/>The CodeX Team</p>
    `;

    sendEmail({
      email: registration.email,
      subject: 'CodeX Registration Update',
      message,
    }).catch(err => console.error("Failed to send rejection email:", err));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, registration, `Registration ${status.toLowerCase()} successfully`));
});

export { getAllRegistrations, updateRegistrationStatus };
