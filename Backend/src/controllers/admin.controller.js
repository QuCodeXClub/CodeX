import { Admin } from '../models/admin.model.js';
import { StudentRegistration } from '../models/studentRegistration.model.js';
import { Event } from '../models/event.model.js';
import { TeamMember } from '../models/teamMember.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { uploadOnCloudinary, updateOnCloudinary, getPublicIdFromUrl } from '../utils/cloudinary.js';
import { adminOtpEmail, passwordChangeOtpEmail, passwordChangedSuccessEmail } from '../utils/emailTemplates.js';
import { Session } from '../models/session.model.js';
import { Token } from '../models/token.model.js';
import ms from 'ms';
import { UAParser } from 'ua-parser-js';
import mongoSanitize from 'express-mongo-sanitize';
import crypto from 'crypto';

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
      ipAddress: req.ip || req.headers['x-forwarded-for'] || 'Unknown IP',
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

  const normalizedEmail = email ? email.toString().toLowerCase().trim() : '';
  const admin = await Admin.findOne({ email: normalizedEmail });

  if (!admin) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const existingOtp = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'AUTH_OTP',
  });
  if (existingOtp) {
    return res.status(200).json(
      new ApiResponse(200, {}, 'OTP already sent,Please check your email')
    );
  }
  // Generate OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Create new OTP token in the db
  await Token.create({
    userId: admin._id,
    userType: 'Admin',
    token: otp,
    type: 'AUTH_OTP',
    description: 'Auth OTP',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  // Send OTP via Email
  const { html, text } = adminOtpEmail(otp);

  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Admin Login OTP',
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

  const normalizedEmail = email ? email.toString().toLowerCase().trim() : '';
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

  const isOtpValid = await tokenDoc.isTokenCorrect(cleanedOtp);

  // Since MongoDB TTL thread runs every 60 seconds, we manually check the expiry as a fallback
  if (!isOtpValid || tokenDoc.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
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

  const rawSessions = await Session.find()
    .populate('adminId', 'name email profilePhoto')
    .sort({ createdAt: -1 });

  const sessions = rawSessions.map((session) => {
    const obj = session.toObject();
    obj.isCurrent = req.sessionId ? session._id.toString() === req.sessionId.toString() : false;
    return obj;
  });

  return res.status(200).json(new ApiResponse(200, sessions, 'Sessions fetched successfully'));
});

// @desc    Kill or delete a specific session across any admin account
// @route   DELETE /api/v1/admin/sessions/:id
// @access  Private/Admin
const killSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.sessionId && req.sessionId.toString() === id) {
    throw new ApiError(400, 'Cannot revoke your current active session. Use Logout instead.');
  }

  const session = await Session.findById(id);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  session.status = 'REVOKED';
  session.loggedOutAt = new Date();
  session.cleanupAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await session.save();

  await session.populate('adminId', 'name email profilePhoto');

  return res.status(200).json(new ApiResponse(200, session, 'Session revoked successfully'));
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

  const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
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
  const [pendingApps, totalApps, activeEvents, liveSessions, teamSize, recentLogs] = await Promise.all([
    StudentRegistration.countDocuments({ status: "PENDING" }),
    StudentRegistration.countDocuments(),
    Event.countDocuments(),
    Session.countDocuments({ status: "ACTIVE" }),
    TeamMember.countDocuments(),
    StudentRegistration.find().sort({ createdAt: -1 }).limit(5)
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      metrics: {
        pendingApps,
        totalApps,
        activeEvents,
        liveSessions,
        teamSize,
      },
      recentLogs
    }, 'Dashboard metrics fetched successfully')
  );
});

export { loginAdmin, verifyOtp, logoutAdmin, updateProfile, requestPasswordChange, changePassword, getAdminSessions, killSession, getCurrentAdmin, getDashboardMetrics };