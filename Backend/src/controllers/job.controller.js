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
      { 'payload.recipientEmail': { $regex: safeSearch, $options: 'i' } },
      { 'payload.student.email': { $regex: safeSearch, $options: 'i' } },
      { 'payload.student.name': { $regex: safeSearch, $options: 'i' } },
      { 'payload.name': { $regex: safeSearch, $options: 'i' } },
      { 'payload.eventName': { $regex: safeSearch, $options: 'i' } },
      { 'payload.subject': { $regex: safeSearch, $options: 'i' } },
      { 'payload.certificateId': { $regex: safeSearch, $options: 'i' } },
      { 'payload.boardingPassId': { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    BackgroundJob.find(query)
      .select('-payload.html -payload.signatureImage -payload.finalSignatureUrl -payload.pdfBuffer -payload.attachments')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
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

/**
 * Helper to build job filter query for listing, parts inspection, and export
 */
const buildJobFilterQuery = (queryObj = {}) => {
  const rawStatus = typeof queryObj.status === 'string' ? queryObj.status.trim() : '';
  const rawType = typeof queryObj.type === 'string' ? queryObj.type.trim() : '';
  const rawSearch = typeof queryObj.search === 'string' ? queryObj.search.trim() : '';
  const scope = (queryObj.scope || 'all').toLowerCase();

  const query = {};

  if (scope === 'filtered') {
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
        { 'payload.recipientEmail': { $regex: safeSearch, $options: 'i' } },
        { 'payload.student.email': { $regex: safeSearch, $options: 'i' } },
        { 'payload.student.name': { $regex: safeSearch, $options: 'i' } },
        { 'payload.name': { $regex: safeSearch, $options: 'i' } },
        { 'payload.eventName': { $regex: safeSearch, $options: 'i' } },
        { 'payload.subject': { $regex: safeSearch, $options: 'i' } },
        { 'payload.certificateId': { $regex: safeSearch, $options: 'i' } },
        { 'payload.boardingPassId': { $regex: safeSearch, $options: 'i' } },
      ];
    }
  }

  return query;
};

/**
 * Format single job record for CSV export with 100% backward compatibility
 */
const formatJobRowForCSV = (job) => {
  const p = job.payload || {};
  const recipientEmail =
    p.email ||
    p.student?.email ||
    p.recipientEmail ||
    (typeof p.student === 'string' && p.student.includes('@') ? p.student : '') ||
    (p.recipientCount !== undefined
      ? `${p.recipientCount} recipients`
      : Array.isArray(p.emailList)
      ? `${p.emailList.length} recipients`
      : '');
  const studentName =
    p.student?.name ||
    (typeof p.student === 'string' && !p.student.includes('@') ? p.student : '') ||
    p.name ||
    p.studentName ||
    '';
  const eventOrSubject = p.eventName || p.subject || p.templateName || '';

  let durationSec = '';
  if (job.processedAt && job.createdAt) {
    const ms = new Date(job.processedAt).getTime() - new Date(job.createdAt).getTime();
    durationSec = (ms / 1000).toFixed(2);
  }

  const cleanError = job.lastError
    ? String(job.lastError).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').slice(0, 500)
    : '';

  return [
    `"${String(job._id || '').replace(/"/g, '""')}"`,
    `"${String(job.type || '').replace(/"/g, '""')}"`,
    `"${String(job.status || '').replace(/"/g, '""')}"`,
    `"${String(recipientEmail || '').replace(/"/g, '""')}"`,
    `"${String(studentName || '').replace(/"/g, '""')}"`,
    `"${String(eventOrSubject || '').replace(/"/g, '""')}"`,
    `"${String(p.certificateId || '').replace(/"/g, '""')}"`,
    `"${String(p.boardingPassId || '').replace(/"/g, '""')}"`,
    `"${job.attempts ?? 0}"`,
    `"${job.maxAttempts ?? 3}"`,
    `"${durationSec}"`,
    `"${job.createdAt ? new Date(job.createdAt).toISOString() : ''}"`,
    `"${job.scheduledAt ? new Date(job.scheduledAt).toISOString() : ''}"`,
    `"${job.processedAt ? new Date(job.processedAt).toISOString() : ''}"`,
    `"${cleanError}"`,
  ].join(',');
};

/**
 * Format single job record for JSON export with 100% backward compatibility
 */
const formatJobForJSON = (job) => {
  const p = job.payload || {};
  const recipientEmail =
    p.email ||
    p.student?.email ||
    p.recipientEmail ||
    (typeof p.student === 'string' && p.student.includes('@') ? p.student : '') ||
    (p.recipientCount !== undefined
      ? `${p.recipientCount} recipients`
      : Array.isArray(p.emailList)
      ? `${p.emailList.length} recipients`
      : '');
  const studentName =
    p.student?.name ||
    (typeof p.student === 'string' && !p.student.includes('@') ? p.student : '') ||
    p.name ||
    p.studentName ||
    '';
  const eventName = p.eventName || '';
  const subject = p.subject || p.templateName || '';

  let durationSec = null;
  if (job.processedAt && job.createdAt) {
    const ms = new Date(job.processedAt).getTime() - new Date(job.createdAt).getTime();
    durationSec = Number((ms / 1000).toFixed(2));
  }

  // Strip excessive bloat payloads if present
  const sanitizedPayload = {};
  for (const [k, v] of Object.entries(p)) {
    if (
      k === 'html' ||
      k === 'signatureImage' ||
      k === 'finalSignatureUrl' ||
      k === 'pdfBuffer' ||
      k === 'attachments'
    ) {
      continue;
    }
    if (typeof v === 'string' && v.length > 500) {
      sanitizedPayload[k] = v.slice(0, 500) + '...';
    } else {
      sanitizedPayload[k] = v;
    }
  }

  return {
    jobId: job._id,
    type: job.type,
    status: job.status,
    recipientEmail,
    studentName,
    eventName,
    subject,
    certificateId: p.certificateId || '',
    boardingPassId: p.boardingPassId || '',
    attempts: job.attempts ?? 0,
    maxAttempts: job.maxAttempts ?? 3,
    durationSec,
    createdAt: job.createdAt,
    scheduledAt: job.scheduledAt,
    processedAt: job.processedAt,
    lastError: job.lastError ? String(job.lastError).replace(/[\r\n]+/g, ' ').slice(0, 500) : '',
    payload: sanitizedPayload,
  };
};

/**
 * Get partitioned export metadata (number of parts, records per part)
 * @route GET /api/v1/admin/jobs/export-parts
 * @access Private (Super Admin Only)
 */
const getJobExportParts = asyncHandler(async (req, res) => {
  if (req.admin?.role !== 'SuperAdmin') {
    throw new ApiError(403, 'Forbidden: Only Super Admins are authorized to export task queue logs');
  }

  const query = buildJobFilterQuery(req.query);
  const partSize = Math.max(50, Math.min(2000, parseInt(req.query.limit, 10) || 500));
  const totalRecords = await BackgroundJob.countDocuments(query);
  const totalParts = Math.max(1, Math.ceil(totalRecords / partSize));

  const parts = [];
  for (let i = 1; i <= totalParts; i++) {
    const from = (i - 1) * partSize + 1;
    const to = Math.min(i * partSize, totalRecords);
    const count = totalRecords === 0 ? 0 : to - from + 1;
    parts.push({
      part: i,
      from: totalRecords === 0 ? 0 : from,
      to,
      count,
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalRecords,
        partSize,
        totalParts,
        parts,
      },
      'Export parts calculated successfully'
    )
  );
});

/**
 * Export background job logs partitioned into parts or in full (CSV / JSON)
 * @route GET /api/v1/admin/jobs/export
 * @access Private (Super Admin Only)
 */
const exportJobLogs = asyncHandler(async (req, res) => {
  if (req.admin?.role !== 'SuperAdmin') {
    throw new ApiError(403, 'Forbidden: Only Super Admins are authorized to export task queue logs');
  }

  const format = (req.query.format || 'csv').toLowerCase();
  const query = buildJobFilterQuery(req.query);
  const rawPart = req.query.part;
  const limit = Math.max(10, Math.min(2000, parseInt(req.query.limit, 10) || 500));

  // If specific part requested or default part partitioned mode
  let part = parseInt(rawPart, 10);
  const isPartMode = !isNaN(part) && part >= 1;

  const totalRecords = await BackgroundJob.countDocuments(query);
  const totalParts = Math.max(1, Math.ceil(totalRecords / limit));

  if (!isPartMode && rawPart !== 'all') {
    part = 1; // Default to Part 1 for instantaneous 0ms response
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  // If single part export (INSTANT sub-second execution, no timeouts, no network drops)
  if (isPartMode || rawPart !== 'all') {
    const validPart = Math.min(Math.max(1, part), totalParts);
    const skip = (validPart - 1) * limit;

    const jobs = await BackgroundJob.find(query)
      .select(
        'type status attempts maxAttempts lastError createdAt scheduledAt processedAt payload'
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (format === 'json') {
      const jsonList = jobs.map(formatJobForJSON);
      const content = JSON.stringify(jsonList, null, 2);
      const filename = `CodeX_Task_Queue_Logs_Part_${validPart}_of_${totalParts}_${timestamp}.json`;

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', String(Buffer.byteLength(content, 'utf-8')));
      res.setHeader('x-part-number', String(validPart));
      res.setHeader('x-total-parts', String(totalParts));
      res.setHeader('x-record-count', String(jobs.length));
      res.setHeader('x-total-records', String(totalRecords));
      res.setHeader(
        'Access-Control-Expose-Headers',
        'Content-Disposition, x-part-number, x-total-parts, x-record-count, x-total-records'
      );
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

      return res.status(200).send(content);
    }

    // CSV format
    const headers = [
      'Job ID',
      'Task Type',
      'Status',
      'Recipient / Email',
      'Student Name',
      'Event / Subject',
      'Certificate ID',
      'Boarding Pass ID',
      'Attempts',
      'Max Attempts',
      'Duration (sec)',
      'Created At',
      'Scheduled At',
      'Processed At',
      'Last Error / Failure Details',
    ];

    const csvRows = ['\uFEFF' + headers.map((h) => `"${h}"`).join(',')];
    for (const job of jobs) {
      csvRows.push(formatJobRowForCSV(job));
    }
    const content = csvRows.join('\r\n') + '\r\n';
    const filename = `CodeX_Task_Queue_Logs_Part_${validPart}_of_${totalParts}_${timestamp}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', String(Buffer.byteLength(content, 'utf-8')));
    res.setHeader('x-part-number', String(validPart));
    res.setHeader('x-total-parts', String(totalParts));
    res.setHeader('x-record-count', String(jobs.length));
    res.setHeader('x-total-records', String(totalRecords));
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Content-Disposition, x-part-number, x-total-parts, x-record-count, x-total-records'
    );
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    return res.status(200).send(content);
  }

  // Fallback: full streaming for explicit part='all' requests
  if (format === 'json') {
    const filename = `CodeX_Task_Queue_Logs_All_${timestamp}.json`;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('x-no-compression', '1');

    const cursor = BackgroundJob.find(query)
      .select('-payload.html -payload.signatureImage -payload.finalSignatureUrl -payload.pdfBuffer -payload.attachments')
      .sort({ createdAt: -1 })
      .lean()
      .cursor({ batchSize: 500 });

    req.on('close', () => cursor.close().catch(() => {}));

    res.write('[\n');
    let isFirst = true;

    for await (const job of cursor) {
      if (!isFirst) res.write(',\n');
      res.write(JSON.stringify(formatJobForJSON(job)));
      isFirst = false;
    }

    res.write('\n]');
    return res.end();
  }

  // Full CSV stream
  const headers = [
    'Job ID',
    'Task Type',
    'Status',
    'Recipient / Email',
    'Student Name',
    'Event / Subject',
    'Certificate ID',
    'Boarding Pass ID',
    'Attempts',
    'Max Attempts',
    'Duration (sec)',
    'Created At',
    'Scheduled At',
    'Processed At',
    'Last Error / Failure Details',
  ];

  const filename = `CodeX_Task_Queue_Logs_All_${timestamp}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('x-no-compression', '1');

  res.write('\uFEFF' + headers.map((h) => `"${h}"`).join(',') + '\r\n');

  const cursor = BackgroundJob.find(query)
    .select(
      'type status attempts maxAttempts lastError createdAt scheduledAt processedAt payload'
    )
    .sort({ createdAt: -1 })
    .lean()
    .cursor({ batchSize: 500 });

  req.on('close', () => cursor.close().catch(() => {}));

  for await (const job of cursor) {
    res.write(formatJobRowForCSV(job) + '\r\n');
  }

  return res.end();
});

export {
  getBackgroundJobs,
  getJobStats,
  retryJob,
  deleteJob,
  clearCompletedJobs,
  exportJobLogs,
  getJobExportParts,
};
