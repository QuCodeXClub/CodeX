import { SystemLog } from "../models/log.model.js";
import { Admin } from "../models/admin.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Get Admin Activity Logs
// @route   GET /api/v1/admin/logs/activity
// @access  Private (Admin & Super Admin)
export const getActivityLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const skip = (page - 1) * limit;

  const isSuperAdmin = req.admin?.role === 'SuperAdmin';

  // Base query: all activity logs
  let query = { type: 'ADMIN_ACTIVITY' };

  // If requesting user is NOT Super Admin, filter out all Super Admin logs so Admins cannot see them
  if (!isSuperAdmin) {
    const superAdmins = await Admin.find({ role: 'SuperAdmin' }).select('_id').lean();
    const superAdminIds = superAdmins.map((sa) => sa._id);

    query = {
      type: 'ADMIN_ACTIVITY',
      adminRole: { $ne: 'SuperAdmin' },
      adminId: { $nin: superAdminIds },
      adminName: { $not: /super\s*admin/i },
      action: { $not: /^super\s*admin/i },
    };
  }

  const [logs, totalLogs] = await Promise.all([
    SystemLog.find(query)
      .populate('adminId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SystemLog.countDocuments(query),
  ]);

  res.status(200).json(
    new ApiResponse(200, {
      logs,
      totalPages: Math.ceil(totalLogs / limit) || 1,
      currentPage: page,
      totalLogs
    }, "Activity logs fetched successfully")
  );
});

// @desc    Get Public Access Logs
// @route   GET /api/v1/admin/logs/access
// @access  Private (Admin)
export const getAccessLogs = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const skip = (page - 1) * limit;

  const [logs, totalLogs] = await Promise.all([
    SystemLog.find({ type: 'PUBLIC_ACCESS' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SystemLog.countDocuments({ type: 'PUBLIC_ACCESS' }),
  ]);

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
// @access  Private (Super Admin)
export const clearActivityLogs = asyncHandler(async (req, res) => {
  if (req.admin?.role !== 'SuperAdmin') {
    throw new ApiError(403, 'Access denied. Only Super Admin can clear system activity logs.');
  }

  await SystemLog.deleteMany({ type: 'ADMIN_ACTIVITY' });
  
  if (req.admin) {
    await SystemLog.create({
      type: 'ADMIN_ACTIVITY',
      adminId: req.admin._id,
      adminName: req.admin.name || 'Super Admin',
      adminRole: 'SuperAdmin',
      action: 'Super Admin cleared all activity logs',
      details: { ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress }
    });
  }

  res.status(200).json(new ApiResponse(200, null, "Activity logs cleared successfully"));
});

// @desc    Clear Public Access Logs
// @route   DELETE /api/v1/admin/logs/access
// @access  Private (Super Admin)
export const clearAccessLogs = asyncHandler(async (req, res) => {
  if (req.admin?.role !== 'SuperAdmin') {
    throw new ApiError(403, 'Access denied. Only Super Admin can clear system access logs.');
  }

  await SystemLog.deleteMany({ type: 'PUBLIC_ACCESS' });
  
  if (req.admin) {
    await SystemLog.create({
      type: 'ADMIN_ACTIVITY',
      adminId: req.admin._id,
      adminName: req.admin.name || 'Super Admin',
      adminRole: 'SuperAdmin',
      action: 'Super Admin cleared all public access logs',
      details: { ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress }
    });
  }

  res.status(200).json(new ApiResponse(200, null, "Access logs cleared successfully"));
});
