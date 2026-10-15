import { Admin } from '../models/admin.model.js';
import { StudentRegistration } from '../models/studentRegistration.model.js';
import { Event } from '../models/event.model.js';
import { TeamMember } from '../models/teamMember.model.js';
import { SystemSetting } from '../models/systemSetting.model.js';
import { CertificateBatch } from '../models/certificateBatch.model.js';
import { SystemLog } from '../models/log.model.js';

import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { uploadOnCloudinary, updateOnCloudinary, getPublicIdFromUrl } from '../utils/cloudinary.js';
import { adminOtpEmail, passwordChangeOtpEmail, passwordChangedSuccessEmail } from '../utils/emailTemplates.js';
import { Session } from '../models/session.model.js';
import { Token } from '../models/token.model.js';
import { UAParser } from 'ua-parser-js';
import mongoSanitize from 'express-mongo-sanitize';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getSuperAdminCredentials } from '../utils/superAdminHelper.js';

// Pre-computed dummy hash to prevent account enumeration via timing attacks
const DUMMY_HASH = "$2a$10$wT0lqGhy59hD2214K5H/r.R49m64F1m6F1h7x7D1i8l0m2n3o4p5q";

// Helper to detect client IP: backend-observed IP is the authoritative source of truth for security & sessions
const getClientIp = (req) => {
  // 1. Primary: Cloudflare / CDN connecting IP header
  const cfIp = req.headers['cf-connecting-ip'];
  if (cfIp && typeof cfIp === 'string' && cfIp.trim()) {
    return cfIp.trim();
  }

  // 2. Primary: Nginx / reverse proxy real IP header
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp && typeof xRealIp === 'string' && xRealIp.trim()) {
    return xRealIp.trim();
  }

  // 3. Primary: Standard X-Forwarded-For chain (original client is first in chain)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded && typeof forwarded === 'string' && forwarded.trim()) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp && firstIp.toLowerCase() !== 'unknown') return firstIp;
  }

  // 4. Express-resolved IP (with trust proxy enabled) or socket remote address
  const reqIp = req.ip || req.socket?.remoteAddress;
  if (reqIp && reqIp !== '::1' && !reqIp.includes('127.0.0.1')) {
    if (reqIp.startsWith('::ffff:')) {
      return reqIp.replace('::ffff:', '');
    }
    return reqIp;
  }

  // 5. Optional fallback: client-provided IP only if network-observed IP is local/unknown
  const bodyIp = req.body?.clientIp || req.body?.ipAddress || req.body?.ip || req.headers['x-client-ip'] || req.query?.clientIp;
  if (bodyIp && typeof bodyIp === 'string') {
    const trimmed = bodyIp.trim();
    if (trimmed && trimmed.length <= 45 && /^([0-9a-fA-F:.]+)$/.test(trimmed)) {
      return trimmed;
    }
  }

  if (reqIp) {
    if (reqIp.startsWith('::ffff:')) {
      return reqIp.replace('::ffff:', '');
    }
    return reqIp;
  }

  return 'Unknown IP';
};

const generateAuthSession = async (adminId, req) => {
  try {
    const admin = await Admin.findById(adminId);

    // Parse user agent
    const rawUserAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(rawUserAgent);
    const parsedUA = parser.getResult();

    const os = `${parsedUA.os.name || ''} ${parsedUA.os.version || ''}`.trim() || 'Unknown OS';
    const browser = `${parsedUA.browser.name || ''} ${parsedUA.browser.version || ''}`.trim() || 'Unknown Browser';
    const deviceType = parsedUA.device.type ?
      parsedUA.device.type.charAt(0).toUpperCase() + parsedUA.device.type.slice(1) : 'Desktop';

    // Detect client IP from req.body, custom header, or request socket/headers
    const ipAddress = getClientIp(req);

    // Create a new session with 10-day validity
    const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    let session = await Session.create({
      adminId,
      token: 'temp', // Placeholder
      expiresAt,
      cleanupAt: null,
      userAgent: rawUserAgent,
      os,
      browser,
      device: deviceType,
      ipAddress,
    });

    const token = admin.generateAuthToken(session._id);

    // Update session with the real token
    session.token = token;
    await session.save();

    return token;
  } catch (error) {
    console.error("Session Generation Error:", error);
    throw new ApiError(500, 'Something went wrong while generating session');
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  mongoSanitize.sanitize(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  // Prevent bcrypt Denial of Service via excessively large payloads
  if (typeof password !== 'string' || password.length > 128) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const normalizedEmail = email.toString().toLowerCase().trim();
  const { email: superAdminEmail, password: superAdminEnvPassword, name: superAdminName } = getSuperAdminCredentials();
  const isSuperAdminLogin = normalizedEmail === superAdminEmail;

  let admin = await Admin.findOne({ email: normalizedEmail });

  if (isSuperAdminLogin) {
    if (!admin) {
      admin = await Admin.create({
        name: superAdminName,
        email: superAdminEmail,
        password: superAdminEnvPassword,
        role: 'SuperAdmin',
      });
    } else if (admin.role !== 'SuperAdmin') {
      admin.role = 'SuperAdmin';
      await admin.save();
    }

    // Timing-safe byte comparison for direct environment variable match
    let isDirectMatch = false;
    if (typeof superAdminEnvPassword === 'string') {
      const bufA = Buffer.from(password);
      const bufB = Buffer.from(superAdminEnvPassword);
      if (bufA.length === bufB.length) {
        isDirectMatch = crypto.timingSafeEqual(bufA, bufB);
      }
    }

    const isHashedMatch = await admin.isPasswordCorrect(password);

    if (!isDirectMatch && !isHashedMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }
  } else {
    // If account doesn't exist, execute dummy bcrypt compare to prevent timing-based user enumeration
    if (!admin) {
      await bcrypt.compare(password, DUMMY_HASH);
      throw new ApiError(401, 'Invalid credentials');
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }
  }

  const existingOtp = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'AUTH_OTP',
  });
  if (existingOtp) {
    // Rate limit OTP generation: allow resending only after 60 seconds
    const secondsSinceIssued = (Date.now() - new Date(existingOtp.createdAt).getTime()) / 1000;
    if (secondsSinceIssued < 60) {
      const waitTime = Math.ceil(60 - secondsSinceIssued);
      return res.status(200).json(
        new ApiResponse(200, {}, `OTP already dispatched. Please wait ${waitTime}s before requesting a new code.`)
      );
    }
    // Stale OTP beyond 60s is refreshed
    await Token.deleteOne({ _id: existingOtp._id });
  }
  // Generate OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Create new OTP token in the db
  await Token.create({
    userId: admin._id,
    userType: 'Admin',
    token: otp,
    type: 'AUTH_OTP',
    attempts: 0,
    description: 'Auth OTP',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send OTP via Email
  const { html, text } = adminOtpEmail(otp);

  try {
    await sendEmail({
      email: admin.email,
      subject: `CodeX ${admin.role === 'SuperAdmin' ? 'Super Admin' : 'Admin'} Login OTP`,
      message: html,
      textMessage: text,
    });
  } catch (error) {
    // If email fails, delete the token we just created
    await Token.deleteMany({ userId: admin._id, userType: 'Admin', type: 'AUTH_OTP' });
    throw new ApiError(500, 'Error sending OTP email');
  }

  return res.status(200).json(
    new ApiResponse(200, {}, 'OTP sent successfully to admin email')
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  mongoSanitize.sanitize(req.body);

  const { email, otp } = req.body;
  const cleanedOtp = otp ? otp.toString().trim().replace(/\s+/g, '') : '';

  if (!email || !cleanedOtp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const normalizedEmail = email.toString().toLowerCase().trim();
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  const tokenDoc = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'AUTH_OTP',
  });

  if (!tokenDoc) {
    throw new ApiError(400, 'OTP not requested or has expired');
  }

  // Enforce brute-force attempt lockout (maximum 5 attempts)
  if ((tokenDoc.attempts || 0) >= 5) {
    await Token.deleteOne({ _id: tokenDoc._id });
    throw new ApiError(429, 'Maximum OTP attempts exceeded. Code has been permanently revoked for security. Please request a new OTP.');
  }

  const isOtpValid = await tokenDoc.isTokenCorrect(cleanedOtp);

  // Since MongoDB TTL thread runs every 60 seconds, we manually check the expiry as a fallback
  if (!isOtpValid || tokenDoc.expiresAt < new Date()) {
    tokenDoc.attempts = (tokenDoc.attempts || 0) + 1;
    if (tokenDoc.attempts >= 5) {
      await Token.deleteOne({ _id: tokenDoc._id });
      throw new ApiError(429, 'Maximum OTP verification attempts exceeded. Code has been revoked for security.');
    }
    await tokenDoc.save();
    const remaining = 5 - tokenDoc.attempts;
    throw new ApiError(400, `Invalid or expired OTP. ${remaining} attempt(s) remaining.`);
  }

  // OTP is correct, clear it
  await Token.deleteOne({ _id: tokenDoc._id });

  // Generate Session Token
  const token = await generateAuthSession(admin._id, req);

  const loggedInAdmin = await Admin.findById(admin._id).select('-password -otp -otpExpiry');

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  };

  return res
    .status(200)
    .cookie('accessToken', token, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          token,
        },
        'Admin logged in successfully'
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const cleanupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (req.sessionId) {
    await Session.findByIdAndUpdate(req.sessionId, {
      status: 'LOGGED_OUT',
      loggedOutAt: new Date(),
      cleanupAt: cleanupDate,
    });
  } else {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      await Session.findOneAndUpdate(
        { token },
        {
          status: 'LOGGED_OUT',
          loggedOutAt: new Date(),
          cleanupAt: cleanupDate,
        }
      );
    }
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'Admin logged out successfully'));
});

// @desc    Get all sessions for all admins with status tags
// @route   GET /api/v1/admin/sessions
// @access  Private/Admin
const getAdminSessions = asyncHandler(async (req, res) => {
  const cleanupDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Update expired active sessions with EXPIRED status and 7-day cleanupAt
  await Session.updateMany(
    { status: 'ACTIVE', expiresAt: { $lte: new Date() } },
    {
      $set: {
        status: 'EXPIRED',
        cleanupAt: cleanupDate,
      },
    }
  );

  // If current active session has localhost/unknown IP and request provides a valid client IP, update it
  if (req.sessionId) {
    const detectedIp = getClientIp(req);
    if (detectedIp && !['Unknown IP', '127.0.0.1', '::1', 'localhost'].includes(detectedIp)) {
      await Session.updateOne(
        {
          _id: req.sessionId,
          ipAddress: { $in: ['127.0.0.1', '::1', 'Unknown IP', 'localhost'] },
        },
        { $set: { ipAddress: detectedIp } }
      );
    }
  }

  // Role-based session visibility:
  // Regular Admin can only view their own sessions
  // Super Admin can view all sessions (their own and other admins')
  const sessionFilter = req.admin?.role === 'SuperAdmin' ? {} : { adminId: req.admin._id };

  const rawSessions = await Session.find(sessionFilter)
    .populate('adminId', 'name email profilePhoto role')
    .sort({ createdAt: -1 })
    .lean();

  const sessions = rawSessions.map((session) => ({
    ...session,
    isCurrent: req.sessionId ? session._id.toString() === req.sessionId.toString() : false,
  }));

  return res.status(200).json(new ApiResponse(200, sessions, 'Sessions fetched successfully'));
});

// @desc    Kill or delete a specific session across admin accounts
// @route   DELETE /api/v1/admin/sessions/:id
// @access  Private/Admin (Regular admins can only revoke their own sessions; Super Admin can revoke any session)
const killSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.sessionId && req.sessionId.toString() === id) {
    throw new ApiError(400, 'Cannot revoke your current active session. Use Logout instead.');
  }

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  // Authorization check:
  // Super Admin can revoke any session.
  // Regular Admin can only revoke sessions belonging to their own admin account.
  if (req.admin?.role !== 'SuperAdmin' && session.adminId?.toString() !== req.admin._id.toString()) {
    throw new ApiError(403, 'Access denied. You can only revoke your own active sessions.');
  }

  const updatedSession = await Session.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'REVOKED',
        loggedOutAt: new Date(),
        cleanupAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    },
    { new: true, runValidators: false }
  ).populate('adminId', 'name email profilePhoto role');

  return res.status(200).json(new ApiResponse(200, updatedSession, 'Session revoked successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobileNumber } = req.body;
  const admin = await Admin.findById(req.admin._id);

  let profilePhotoUrl = admin.profilePhoto;

  if (req.file) {
    if (admin.profilePhoto) {
      // Extract public ID and update
      const oldPublicId = getPublicIdFromUrl(admin.profilePhoto);
      const uploadedImage = await updateOnCloudinary(req.file.path, oldPublicId);
      if (!uploadedImage) throw new ApiError(500, 'Error updating profile photo');
      profilePhotoUrl = uploadedImage.url;
    } else {
      const uploadedImage = await uploadOnCloudinary(req.file.path, 'CodeX/profile');
      if (!uploadedImage) throw new ApiError(500, 'Error uploading profile photo');
      profilePhotoUrl = uploadedImage.url;
    }
  }

  if (!name && !mobileNumber && !req.file) {
    throw new ApiError(400, 'Please provide fields to update');
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        ...(name && { name }),
        ...(mobileNumber && { mobileNumber }),
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
      },
    },
    { new: true, runValidators: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAdmin, 'Admin profile updated successfully'));
});

const requestPasswordChange = asyncHandler(async (req, res) => {
  const { oldPassword } = req.body;

  if (!oldPassword) {
    throw new ApiError(400, 'Old password is required');
  }

  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  let isPasswordValid = await admin.isPasswordCorrect(oldPassword);

  // If Super Admin, allow matching against either the hashed DB password or .env ADMIN_PASSWORD
  if (!isPasswordValid && admin.role === 'SuperAdmin') {
    const { password: envPassword } = getSuperAdminCredentials();
    if (envPassword) {
      const bufA = Buffer.from(oldPassword);
      const bufB = Buffer.from(envPassword);
      if (bufA.length === bufB.length) {
        isPasswordValid = crypto.timingSafeEqual(bufA, bufB);
      }
    }
  }

  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid old password');
  }

  const existingOtp = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'RESET_PASSWORD',
  });
  if (existingOtp) {
    return res.status(200).json(
      new ApiResponse(200, {}, 'OTP already sent, please check your email')
    );
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  await Token.create({
    userId: admin._id,
    userType: 'Admin',
    token: otp,
    type: 'RESET_PASSWORD',
    description: 'Password Change OTP',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  const { html, text } = passwordChangeOtpEmail(otp);

  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Password Change OTP',
      message: html,
      textMessage: text,
    });
  } catch (error) {
    await Token.deleteMany({ userId: admin._id, userType: 'Admin', type: 'RESET_PASSWORD' });
    throw new ApiError(500, 'Error sending OTP email');
  }

  return res.status(200).json(
    new ApiResponse(200, {}, 'OTP sent successfully to admin email')
  );
});

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, otp } = req.body;
  const cleanedOtp = otp ? otp.toString().trim().replace(/\s+/g, '') : '';

  if (!newPassword || !cleanedOtp) {
    throw new ApiError(400, 'New password and OTP are required');
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(400, 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
  }

  const admin = await Admin.findById(req.admin._id);

  const tokenDoc = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'RESET_PASSWORD',
  });

  if (!tokenDoc) {
    throw new ApiError(400, 'OTP not requested or has expired');
  }

  const isOtpValid = await tokenDoc.isTokenCorrect(cleanedOtp);

  if (!isOtpValid || tokenDoc.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  await Token.deleteOne({ _id: tokenDoc._id });

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  const { html, text } = passwordChangedSuccessEmail();
  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Password Changed',
      message: html,
      textMessage: text,
    });
  } catch (error) {
    console.error("Failed to send password changed success email", error);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.admin, 'Current admin fetched successfully')
  );
});

const getDashboardMetrics = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.admin?.role === 'SuperAdmin';

  const [
    pendingApps,
    totalApps,
    activeEvents,
    liveSessions,
    teamSize,
    recentLogs,
    totalAdmins,
    pendingBatches,
    totalBatches,
    totalActivityLogs,
    totalAccessLogs,
    recentActivityLogs
  ] = await Promise.all([
    StudentRegistration.countDocuments({ status: "PENDING" }),
    StudentRegistration.countDocuments(),
    Event.countDocuments(),
    Session.countDocuments({ status: "ACTIVE", expiresAt: { $gt: new Date() } }),
    TeamMember.countDocuments(),
    StudentRegistration.find().sort({ createdAt: -1 }).limit(5).lean(),
    isSuperAdmin ? Admin.countDocuments({ role: { $ne: 'SuperAdmin' } }) : 0,
    isSuperAdmin ? CertificateBatch.countDocuments({ status: 'PENDING_APPROVAL' }) : 0,
    isSuperAdmin ? CertificateBatch.countDocuments() : 0,
    isSuperAdmin ? SystemLog.countDocuments({ type: 'ADMIN_ACTIVITY' }) : 0,
    isSuperAdmin ? SystemLog.countDocuments({ type: 'PUBLIC_ACCESS' }) : 0,
    isSuperAdmin
      ? SystemLog.find({ type: 'ADMIN_ACTIVITY' })
          .populate('adminId', 'name email role')
          .sort({ createdAt: -1 })
          .limit(6)
          .lean()
      : []
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      metrics: {
        pendingApps,
        totalApps,
        activeEvents,
        liveSessions,
        teamSize,
        // Super Admin metrics
        totalAdmins,
        pendingBatches,
        totalBatches,
        totalActivityLogs,
        totalAccessLogs,
      },
      recentLogs,
      recentActivityLogs,
    }, 'Dashboard metrics fetched successfully')
  );
});

const getAdminRegistrationStatus = asyncHandler(async (req, res) => {
  let setting = await SystemSetting.findOne({ key: 'registration' }).populate('updatedBy', 'fullName email');
  if (!setting) {
    setting = await SystemSetting.create({
      key: 'registration',
      isRegistrationOpen: true,
      closedMessage: 'Registrations are currently closed. Please check back later or contact the CodeX team.',
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      setting,
      'Registration status fetched successfully'
    )
  );
});

const updateAdminRegistrationStatus = asyncHandler(async (req, res) => {
  const { isRegistrationOpen, closedMessage } = req.body;

  let setting = await SystemSetting.findOne({ key: 'registration' });
  if (!setting) {
    setting = new SystemSetting({ key: 'registration' });
  }

  if (typeof isRegistrationOpen === 'boolean') {
    if (setting.isRegistrationOpen !== isRegistrationOpen) {
      if (isRegistrationOpen) {
        setting.openedAt = new Date();
      } else {
        setting.closedAt = new Date();
      }
    }
    setting.isRegistrationOpen = isRegistrationOpen;
  }

  if (typeof closedMessage === 'string' && closedMessage.trim() !== '') {
    setting.closedMessage = closedMessage.trim();
  }

  setting.updatedBy = req.admin?._id;
  await setting.save();

  const populatedSetting = await SystemSetting.findById(setting._id).populate('updatedBy', 'fullName email');

  return res.status(200).json(
    new ApiResponse(
      200,
      populatedSetting,
      `Registration portal is now ${setting.isRegistrationOpen ? 'OPEN' : 'CLOSED'}`
    )
  );
});

export {
  loginAdmin,
  verifyOtp,
  logoutAdmin,
  updateProfile,
  requestPasswordChange,
  changePassword,
  getAdminSessions,
  killSession,
  getCurrentAdmin,
  getDashboardMetrics,
  getAdminRegistrationStatus,
  updateAdminRegistrationStatus,
};
