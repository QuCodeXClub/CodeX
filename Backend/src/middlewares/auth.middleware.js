import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model.js';
import { Session } from '../models/session.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?.sessionId) {
      throw new ApiError(401, 'Invalid session token format');
    }

    if (decodedToken?.role !== 'Admin') {
      throw new ApiError(403, 'Access denied. Admin resources only.');
    }

    const session = await Session.findById(decodedToken.sessionId);

    if (!session) {
      throw new ApiError(401, 'Session does not exist');
    }

    // Check if session has been logged out, revoked, or expired
    if (session.status !== 'ACTIVE') {
      const statusMessage = session.status.toLowerCase().replace('_', ' ');
      throw new ApiError(401, `Session is ${statusMessage}`);
    }

    // Check expiration date
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      session.status = 'EXPIRED';
      await session.save();
      throw new ApiError(401, 'Session has expired');
    }

    const admin = await Admin.findById(decodedToken?._id).select('-password');

    if (!admin) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    // Access granted! Attach admin and sessionId to request
    req.admin = admin;
    req.sessionId = session._id;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
