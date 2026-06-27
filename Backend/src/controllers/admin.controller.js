import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';

import { Session } from '../models/session.model.js';
import ms from 'ms';
import { UAParser } from 'ua-parser-js';

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
    throw new ApiError(500, 'Something went wrong while generating session');
  }
};

const loginAdmin = asyncHandler(async (req, res) => {
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

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  admin.otp = otp;
  admin.otpExpiry = otpExpiry;
  await admin.save({ validateBeforeSave: false });

  // Send OTP via Email
  const message = `
    <h2>CodeX Admin Login OTP</h2>
    <p>Your OTP for admin login is <strong>${otp}</strong>. It is valid for 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: admin.email,
      subject: 'CodeX Admin Login OTP',
      message,
    });
  } catch (error) {
    admin.otp = undefined;
    admin.otpExpiry = undefined;
    await admin.save({ validateBeforeSave: false });
    throw new ApiError(500, 'Error sending OTP email');
  }

  return res.status(200).json(
    new ApiResponse(200, {}, 'OTP sent successfully to admin email')
  );
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, 'Email and OTP are required');
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  if (admin.otp !== otp || admin.otpExpiry < Date.now()) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  // OTP is correct, clear it
  admin.otp = undefined;
  admin.otpExpiry = undefined;
  await admin.save({ validateBeforeSave: false });

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

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, 'Old password and new password are required');
  }

  const admin = await Admin.findById(req.admin._id);

  const isPasswordValid = await admin.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid old password');
  }

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

export { loginAdmin, verifyOtp, logoutAdmin, updateProfile, changePassword, getAdminSessions, killSession };
