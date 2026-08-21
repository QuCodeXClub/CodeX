import { BackgroundJob } from '../models/backgroundJob.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Get paginated list of background jobs with filtering & search
 */
const getBackgroundJobs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const rawStatus = typeof req.query.status === 'string' ? req.query.status.trim() : '';
  const rawType = typeof req.query.type === 'string' ? req.query.type.trim() : '';
  const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const query = {};

  const allowedStatuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'SUPPRESSED'];
  if (rawStatus && allowedStatuses.includes(rawStatus)) {
    query.status = rawStatus;
  }

  const allowedTypes = ['EMAIL_SEND', 'CERTIFICATE_BULK', 'BOARDING_PASS_BULK', 'ANNOUNCEMENT_BULK'];
  if (rawType && allowedTypes.includes(rawType)) {
    query.type = rawType;
  }

  if (rawSearch) {
    const safeSearch = escapeRegExp(rawSearch).slice(0, 100);
    query.$or = [
      { type: { $regex: safeSearch, $options: 'i' } },
      { 'payload.email': { $regex: safeSearch, $options: 'i' } },
      { 'payload.student.email': { $regex: safeSearch, $options: 'i' } },
      { 'payload.eventName': { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BackgroundJob.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BackgroundJob.countDocuments(query),
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
      'Background jobs fetched successfully'
    )
  );
});

/**
 * Get background job metrics summary
 */
const getJobStats = asyncHandler(async (req, res) => {
  const [
    total,
    pending,
    processing,
    completed,
    failed,
    suppressed,
    certificateTotal,
    certificateDone,
    certificateEmailSent,
    boardingPassTotal,
    boardingPassDone,
    boardingPassEmailSent,
    announcementTotal,
    emailTotal,
    emailDone,
  ] = await Promise.all([
    BackgroundJob.countDocuments(),
    BackgroundJob.countDocuments({ status: 'PENDING' }),
    BackgroundJob.countDocuments({ status: 'PROCESSING' }),
    BackgroundJob.countDocuments({ status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ status: 'FAILED' }),
    BackgroundJob.countDocuments({ status: 'SUPPRESSED' }),
    BackgroundJob.countDocuments({ type: 'CERTIFICATE_BULK' }),
    BackgroundJob.countDocuments({ type: 'CERTIFICATE_BULK', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', 'payload.subject': { $regex: /Certificate/i }, status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'BOARDING_PASS_BULK' }),
    BackgroundJob.countDocuments({ type: 'BOARDING_PASS_BULK', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', 'payload.subject': { $regex: /Boarding Pass/i }, status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'ANNOUNCEMENT_BULK' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', status: 'COMPLETED' }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        pending,
        processing,
        completed,
        failed,
        suppressed,
        byType: {
          certificate: { total: certificateTotal, completed: certificateDone, emailsSent: certificateEmailSent },
          boardingPass: { total: boardingPassTotal, completed: boardingPassDone, emailsSent: boardingPassEmailSent },
          announcement: { total: announcementTotal },
          email: { total: emailTotal, completed: emailDone },
        },
      },
      'Job statistics fetched successfully'
    )
  );
});

/**
 * Manually retry a failed or suppressed job
 */
const retryJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await BackgroundJob.findById(id);
  if (!job) {
    throw new ApiError(404, 'Background job not found');
  }

  job.status = 'PENDING';
  job.attempts = 0;
  job.lastError = '';
  job.scheduledAt = new Date();
  job.processedAt = null;

  await job.save();

  return res.status(200).json(new ApiResponse(200, job, 'Job re-queued for execution successfully'));
});

/**
 * Delete a specific job
 */
const deleteJob = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const job = await BackgroundJob.findByIdAndDelete(id);
  if (!job) {
    throw new ApiError(404, 'Background job not found');
  }

  return res.status(200).json(new ApiResponse(200, job, 'Job deleted successfully'));
});

/**
 * Bulk clear completed background jobs
 */
const clearCompletedJobs = asyncHandler(async (req, res) => {
  const result = await BackgroundJob.deleteMany({ status: 'COMPLETED' });

  return res
    .status(200)
    .json(new ApiResponse(200, { deletedCount: result.deletedCount }, 'Cleared completed background jobs'));
});

export { getBackgroundJobs, getJobStats, retryJob, deleteJob, clearCompletedJobs };
