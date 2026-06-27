import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens');
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

  // Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

  const loggedInAdmin = await Admin.findById(admin._id).select('-password -otp -otpExpiry');

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          admin: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        'Admin logged in successfully'
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'Admin logged out'));
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

export { loginAdmin, verifyOtp, logoutAdmin, updateProfile, changePassword };
