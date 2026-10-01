import { SystemLog } from "../models/log.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// @desc    Get Admin Activity Logs
// @route   GET /api/v1/admin/logs/activity
// @access  Private (Admin)
export const getActivityLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const logs = await SystemLog.find({ type: 'ADMIN_ACTIVITY' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalLogs = await SystemLog.countDocuments({ type: 'ADMIN_ACTIVITY' });

  res.status(200).json(
    new ApiResponse(200, {
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      totalLogs
    }, "Activity logs fetched successfully")
  );
});

// @desc    Get Public Access Logs
// @route   GET /api/v1/admin/logs/access
// @access  Private (Admin)
export const getAccessLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const skip = (page - 1) * limit;

  const logs = await SystemLog.find({ type: 'PUBLIC_ACCESS' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalLogs = await SystemLog.countDocuments({ type: 'PUBLIC_ACCESS' });

  res.status(200).json(
    new ApiResponse(200, {
      logs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page,
      totalLogs
    }, "Access logs fetched successfully")
  );
});

// @desc    Clear Admin Activity Logs
// @route   DELETE /api/v1/admin/logs/activity
// @access  Private (Admin)
export const clearActivityLogs = asyncHandler(async (req, res) => {
  await SystemLog.deleteMany({ type: 'ADMIN_ACTIVITY' });
  
  if (req.admin) {
    await SystemLog.create({
      type: 'ADMIN_ACTIVITY',
      adminId: req.admin._id,
      adminName: req.admin.name || 'Admin',
      action: 'Cleared all admin activity logs',
      details: { ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress }
    });
  }

  res.status(200).json(new ApiResponse(200, null, "Activity logs cleared successfully"));
});

// @desc    Clear Public Access Logs
// @route   DELETE /api/v1/admin/logs/access
// @access  Private (Admin)
export const clearAccessLogs = asyncHandler(async (req, res) => {
  await SystemLog.deleteMany({ type: 'PUBLIC_ACCESS' });
  
  if (req.admin) {
    await SystemLog.create({
      type: 'ADMIN_ACTIVITY',
      adminId: req.admin._id,
      adminName: req.admin.name || 'Admin',
      action: 'Cleared all public access logs',
      details: { ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress }
    });
  }

  res.status(200).json(new ApiResponse(200, null, "Access logs cleared successfully"));
});
