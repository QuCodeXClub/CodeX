import { EmailBlocklist } from '../models/emailBlocklist.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Get paginated list of blocked emails with search & filtering
 */
const getBlocklist = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';
  const type = req.query.type || '';

  const query = {};

  if (search) {
    query.email = { $regex: search.trim(), $options: 'i' };
  }

  if (type) {
    query.type = type;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    EmailBlocklist.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('addedBy', 'name email'),
    EmailBlocklist.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Blocklist fetched successfully'
    )
  );
});

/**
 * Get blocklist statistics summary
 */
const getBlocklistStats = asyncHandler(async (req, res) => {
  const [total, bounceCount, complaintCount, manualCount] = await Promise.all([
    EmailBlocklist.countDocuments(),
    EmailBlocklist.countDocuments({ type: 'BOUNCE' }),
    EmailBlocklist.countDocuments({ type: 'COMPLAINT' }),
    EmailBlocklist.countDocuments({ type: 'MANUAL' }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        bounceCount,
        complaintCount,
        manualCount,
      },
      'Blocklist statistics fetched successfully'
    )
  );
});

/**
 * Manually add an email address to blocklist
 */
const addBlockedEmail = asyncHandler(async (req, res) => {
  const { email, reason, type } = req.body;

  if (!email) {
    throw new ApiError(400, 'Email address is required');
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await EmailBlocklist.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(400, 'Email address is already in the blocklist');
  }

  const blocked = await EmailBlocklist.create({
    email: normalizedEmail,
    reason: reason || 'Manually added by Administrator',
    type: type || 'MANUAL',
    addedBy: req.user?._id || null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, blocked, 'Email address added to blocklist successfully'));
});

/**
 * Remove an email address from blocklist (Unblock)
 */
const removeBlockedEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await EmailBlocklist.findByIdAndDelete(id);

  if (!item) {
    throw new ApiError(404, 'Blocklist record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, item, 'Email address removed from blocklist successfully'));
});

export { getBlocklist, getBlocklistStats, addBlockedEmail, removeBlockedEmail };
