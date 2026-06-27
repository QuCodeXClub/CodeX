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

    const session = await Session.findById(decodedToken.sessionId);

    if (!session || session.token !== token) {
      throw new ApiError(401, 'Session expired or invalid');
    }

    const admin = await Admin.findById(decodedToken?._id).select('-password');

    if (!admin) {
      throw new ApiError(401, 'Invalid Access Token');
    }

    req.admin = admin;
    req.sessionId = session._id;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid access token');
  }
});
