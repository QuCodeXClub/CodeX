import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import { adminOtpEmail, passwordChangeOtpEmail, passwordChangedSuccessEmail } from '../utils/emailTemplates.js';
import { Session } from '../models/session.model.js';
import { Token } from '../models/token.model.js';
import ms from 'ms';
import { UAParser } from 'ua-parser-js';
import mongoSanitize from 'express-mongo-sanitize';

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

    // Create a new session to get an ID
    let session = await Session.create({
      adminId,
      token: 'temp', // Placeholder
      expiresAt: new Date(Date.now() + ms(process.env.ACCESS_TOKEN_EXPIRY || '1d')),
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
    throw new ApiError(500, `Something went wrong while generating session: ${error.message}`);
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
  mongoSanitize.sanitize(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, 'Admin does not exist');
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
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

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
  const message = adminOtpEmail(otp);

  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Admin Login OTP',
      message,
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

  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  const tokenDoc = await Token.findOne({
    userId: admin._id,
    userType: 'Admin',
    type: 'AUTH_OTP',
  });

  if (!tokenDoc) {
    throw new ApiError(400, 'OTP not requested or has expired');
  }

  const isOtpValid = await tokenDoc.isTokenCorrect(otp);

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
    secure: process.env.NODE_ENV === 'production',
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
  if (req.sessionId) {
    await Session.findByIdAndDelete(req.sessionId);
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'Admin logged out'));
});

// @desc    Get all active sessions for current admin
// @route   GET /api/v1/admin/sessions
// @access  Private/Admin
const getAdminSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ adminId: req.admin._id }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, sessions, 'Active sessions fetched successfully'));
});

// @desc    Kill a specific session
// @route   DELETE /api/v1/admin/sessions/:id
// @access  Private/Admin
const killSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Ensure they don't accidentally kill their current active session using this endpoint
  // (though they could just logout instead)
  if (req.sessionId.toString() === id) {
    throw new ApiError(400, "Cannot kill your current active session from this endpoint. Please use logout instead.");
  }

  const session = await Session.findOneAndDelete({ _id: id, adminId: req.admin._id });

  if (!session) {
    throw new ApiError(404, 'Session not found or already deleted');
  }

  return res.status(200).json(new ApiResponse(200, {}, 'Session killed successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, mobileNumber } = req.body;
  // Note: profilePhoto upload will be handled later if needed via cloudinary middleware

  if (!name && !mobileNumber) {
    throw new ApiError(400, 'Please provide fields to update');
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        ...(name && { name }),
        ...(mobileNumber && { mobileNumber }),
      },
    },
    { new: true, runValidators: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, admin, 'Admin profile updated successfully'));
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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Token.create({
    userId: admin._id,
    userType: 'Admin',
    token: otp,
    type: 'RESET_PASSWORD',
    description: 'Password Change OTP',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  const message = passwordChangeOtpEmail(otp);

  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Password Change OTP',
      message,
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

  if (!newPassword || !otp) {
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

  const isOtpValid = await tokenDoc.isTokenCorrect(otp);
  
  if (!isOtpValid || tokenDoc.expiresAt < new Date()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  await Token.deleteOne({ _id: tokenDoc._id });

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });
  
  const successMessage = passwordChangedSuccessEmail();
  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Password Changed',
      message: successMessage,
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

export { loginAdmin, verifyOtp, logoutAdmin, updateProfile, requestPasswordChange, changePassword, getAdminSessions, killSession, getCurrentAdmin };