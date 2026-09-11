import { BackgroundJob } from '../models/backgroundJob.model.js';
import { Certificate } from '../models/certificate.model.js';
import { BoardingPass } from '../models/boardingPass.model.js';
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
 * Get background job metrics summary across the entire database (all pages)
 */
const getJobStats = asyncHandler(async (req, res) => {
  const [
    total,
    pending,
    processing,
    completed,
    failed,
    suppressed,
    totalCertificatesInDb,
    totalBoardingPassesInDb,
    certificateTotal,
    certificateDone,
    certificateFailed,
    certificateEmailSent,
    boardingPassTotal,
    boardingPassDone,
    boardingPassFailed,
    boardingPassEmailSent,
    announcementTotal,
    announcementDone,
    announcementFailed,
    emailTotal,
    emailDone,
    emailFailed,
  ] = await Promise.all([
    // Global job queue counts across entire DB
    BackgroundJob.countDocuments(),
    BackgroundJob.countDocuments({ status: 'PENDING' }),
    BackgroundJob.countDocuments({ status: 'PROCESSING' }),
    BackgroundJob.countDocuments({ status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ status: 'FAILED' }),
    BackgroundJob.countDocuments({ status: 'SUPPRESSED' }),
    // True global database entities generated (all pages)
    Certificate.countDocuments(),
    BoardingPass.countDocuments(),
    // Certificate jobs
    BackgroundJob.countDocuments({ type: 'CERTIFICATE_BULK' }),
    BackgroundJob.countDocuments({ type: 'CERTIFICATE_BULK', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'CERTIFICATE_BULK', status: 'FAILED' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', 'payload.subject': { $regex: /Certificate/i }, status: 'COMPLETED' }),
    // Boarding Pass jobs
    BackgroundJob.countDocuments({ type: 'BOARDING_PASS_BULK' }),
    BackgroundJob.countDocuments({ type: 'BOARDING_PASS_BULK', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'BOARDING_PASS_BULK', status: 'FAILED' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', 'payload.subject': { $regex: /Boarding Pass/i }, status: 'COMPLETED' }),
    // Announcement jobs
    BackgroundJob.countDocuments({ type: 'ANNOUNCEMENT_BULK' }),
    BackgroundJob.countDocuments({ type: 'ANNOUNCEMENT_BULK', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'ANNOUNCEMENT_BULK', status: 'FAILED' }),
    // Email jobs
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', status: 'COMPLETED' }),
    BackgroundJob.countDocuments({ type: 'EMAIL_SEND', status: 'FAILED' }),
  ]);

  const finishedJobs = completed + failed;
  const passRate = finishedJobs > 0 ? Number(((completed / finishedJobs) * 100).toFixed(1)) : 100;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        total,
        pending,
        processing,
        completed, // Passed tasks across entire database
        failed,    // Failed tasks across entire database
        suppressed,
        passRate,
        globalDb: {
          totalCertificates: totalCertificatesInDb,
          totalBoardingPasses: totalBoardingPassesInDb,
          totalJobs: total,
          passedJobs: completed,
          failedJobs: failed,
        },
        byType: {
          certificate: {
            total: certificateTotal,
            completed: certificateDone,
            failed: certificateFailed,
            emailsSent: certificateEmailSent,
            totalGeneratedInDb: totalCertificatesInDb,
          },
          boardingPass: {
            total: boardingPassTotal,
            completed: boardingPassDone,
            failed: boardingPassFailed,
            emailsSent: boardingPassEmailSent,
            totalGeneratedInDb: totalBoardingPassesInDb,
          },
          announcement: {
            total: announcementTotal,
            completed: announcementDone,
            failed: announcementFailed,
          },
          email: {
            total: emailTotal,
            completed: emailDone,
            failed: emailFailed,
          },
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
