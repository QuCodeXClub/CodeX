import { Admin } from '../models/admin.model.js';
import { Session } from '../models/session.model.js';
import { Token } from '../models/token.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoSanitize from 'express-mongo-sanitize';
import { getSuperAdminCredentials } from '../utils/superAdminHelper.js';

// @desc    Get all admin accounts with active session counts
// @route   GET /api/v1/superAdmin/admins
// @access  Private (Super Admin)
export const getAllAdmins = asyncHandler(async (req, res) => {
  const { email: superAdminEmail } = getSuperAdminCredentials();

  const [admins, activeSessionCounts] = await Promise.all([
    Admin.find({
      role: { $ne: 'SuperAdmin' },
      email: { $ne: superAdminEmail },
    })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean(),
    Session.aggregate([
      {
        $match: {
          status: 'ACTIVE',
          expiresAt: { $gt: new Date() },
        },
      },
      {
        $group: {
          _id: '$adminId',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const sessionCountMap = new Map();
  activeSessionCounts.forEach((item) => {
    sessionCountMap.set(item._id.toString(), item.count);
  });

  const adminsWithStats = admins.map((adminDoc) => ({
    ...adminDoc,
    activeSessionsCount: sessionCountMap.get(adminDoc._id.toString()) || 0,
    isSuperAdmin: false,
  }));

  return res.status(200).json(
    new ApiResponse(200, adminsWithStats, 'Admins retrieved successfully')
  );
});

// @desc    Create a new admin account
// @route   POST /api/v1/superAdmin/admins
// @access  Private (Super Admin)
export const createAdmin = asyncHandler(async (req, res) => {
  mongoSanitize.sanitize(req.body);
  const { name, email, password, mobileNumber } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  const normalizedEmail = email.toString().toLowerCase().trim();
  const { email: superAdminEmail } = getSuperAdminCredentials();

  if (normalizedEmail === superAdminEmail) {
    throw new ApiError(400, 'Cannot create an admin using the Super Admin email address');
  }

  const existingAdmin = await Admin.findOne({ email: normalizedEmail });
  if (existingAdmin) {
    throw new ApiError(409, 'An admin with this email address already exists');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    );
  }

  const newAdmin = await Admin.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    mobileNumber: mobileNumber?.trim() || '',
    role: 'Admin',
  });

  const createdAdmin = await Admin.findById(newAdmin._id).select('-password');

  return res.status(201).json(
    new ApiResponse(201, createdAdmin, 'Admin account created successfully')
  );
});

// @desc    Update an admin account (credentials & profile info)
// @route   PATCH /api/v1/superAdmin/admins/:id
// @access  Private (Super Admin)
export const updateAdmin = asyncHandler(async (req, res) => {
  mongoSanitize.sanitize(req.body);
  const { id } = req.params;
  const { name, email, password, mobileNumber } = req.body;

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new ApiError(404, 'Admin account not found');
  }

  const { email: superAdminEmail } = getSuperAdminCredentials();

  if (admin.role === 'SuperAdmin' || admin.email.toLowerCase() === superAdminEmail) {
    throw new ApiError(403, 'Super Admin credentials cannot be modified via Admin Management. Please use your Profile settings.');
  }

  if (email) {
    const normalizedEmail = email.toString().toLowerCase().trim();
    if (normalizedEmail === superAdminEmail) {
      throw new ApiError(400, 'Cannot assign the Super Admin email address to a regular admin');
    }

    if (normalizedEmail !== admin.email) {
      const emailExists = await Admin.findOne({ email: normalizedEmail });
      if (emailExists) {
        throw new ApiError(409, 'An admin with this email address already exists');
      }
      admin.email = normalizedEmail;
    }
  }

  if (name && name.trim()) {
    admin.name = name.trim();
  }

  if (mobileNumber !== undefined) {
    admin.mobileNumber = mobileNumber.trim();
  }

  let passwordChanged = false;
  if (password && password.trim()) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new ApiError(
        400,
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
      );
    }
    admin.password = password; // Trigger pre('save') to hash
    passwordChanged = true;
  }

  await admin.save();

  // If password was updated, revoke active sessions so the admin must re-authenticate
  if (passwordChanged) {
    const cleanupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.updateMany(
      { adminId: admin._id, status: 'ACTIVE' },
      { $set: { status: 'REVOKED', loggedOutAt: new Date(), cleanupAt: cleanupDate } }
    );
  }

  const updatedAdmin = await Admin.findById(admin._id).select('-password');

  return res.status(200).json(
    new ApiResponse(200, updatedAdmin, 'Admin account updated successfully')
  );
});

// @desc    Remove an admin account
// @route   DELETE /api/v1/superAdmin/admins/:id
// @access  Private (Super Admin)
export const deleteAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findById(id);
  if (!admin) {
    throw new ApiError(404, 'Admin account not found');
  }

  const { email: superAdminEmail } = getSuperAdminCredentials();

  if (admin.role === 'SuperAdmin' || admin.email.toLowerCase() === superAdminEmail) {
    throw new ApiError(403, 'The Super Admin account cannot be removed');
  }

  if (req.admin && req.admin._id.toString() === id) {
    throw new ApiError(400, 'Cannot delete your own active session account');
  }

  // Revoke all sessions for this admin
  const cleanupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.updateMany(
    { adminId: admin._id },
    { $set: { status: 'REVOKED', loggedOutAt: new Date(), cleanupAt: cleanupDate } }
  );

  // Delete pending tokens
  await Token.deleteMany({ userId: admin._id });

  // Delete admin document
  await Admin.findByIdAndDelete(admin._id);

  return res.status(200).json(
    new ApiResponse(200, { deletedId: id, name: admin.name, email: admin.email }, 'Admin account removed successfully')
  );
});
