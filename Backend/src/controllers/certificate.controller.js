import crypto from 'crypto';
import { Certificate } from '../models/certificate.model.js';
import { CertificateBatch } from '../models/certificateBatch.model.js';
import { CertificateDeletion } from '../models/certificateDeletion.model.js';
import { BackgroundJob } from '../models/backgroundJob.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { queueService } from '../services/queueService.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { logPublicEvent } from '../middlewares/log.middleware.js';
import { certificateEmail } from '../utils/emailTemplates.js';

const generateBulkCertificates = asyncHandler(async (req, res) => {
  const { eventName, eventDate, coordinatorName, studentsStr, signatureImageUrl } = req.body;
  
  if (!eventName || !eventDate || !coordinatorName || !studentsStr) {
    throw new ApiError(400, 'All fields are required');
  }

  let students;
  try {
    students = JSON.parse(studentsStr);
  } catch (e) {
    throw new ApiError(400, 'Invalid students data format');
  }

  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiError(400, 'Students array is required');
  }

  let finalSignatureUrl = signatureImageUrl;

  if (!finalSignatureUrl) {
    const signatureLocalPath = req.file?.path;
    if (!signatureLocalPath) {
      throw new ApiError(400, 'Signature image is required');
    }

    const signatureImage = await uploadOnCloudinary(signatureLocalPath, 'CodeX/certificate');
    if (!signatureImage) {
      throw new ApiError(500, 'Error while uploading signature image');
    }
    finalSignatureUrl = signatureImage.secure_url || signatureImage.url;
  }

  // Deduplicate students by normalized email to prevent duplicate jobs and race conditions
  const seenEmails = new Set();
  const validStudents = [];
  for (const s of (students || [])) {
    if (s && s.name && s.email) {
      const email = s.email.trim().toLowerCase();
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        validStudents.push({
          name: s.name.trim(),
          email,
          position: s.position?.trim() || 'Participant',
        });
      }
    }
  }

  if (validStudents.length === 0) {
    throw new ApiError(400, 'No valid student records provided');
  }

  const batchId = `CERT-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const isSuperAdmin = req.admin?.role === 'SuperAdmin';

  if (isSuperAdmin) {
    // Super Admin direct issuance: Auto-approved and immediate background queuing
    const batch = await CertificateBatch.create({
      batchId,
      eventName,
      eventDate,
      coordinatorName,
      signatureImage: finalSignatureUrl,
      students: validStudents,
      studentCount: validStudents.length,
      status: 'PROCESSING',
      submittedBy: req.admin._id,
      submittedByName: req.admin.name || 'Super Admin',
      submittedByEmail: req.admin.email,
      approvedBy: req.admin._id,
      approvedByName: req.admin.name || 'Super Admin',
      approvedAt: new Date(),
    });

    const bulkJobs = validStudents.map((student) => ({
      type: 'CERTIFICATE_BULK',
      payload: {
        batchId: batch._id,
        eventName,
        eventDate,
        coordinatorName,
        student,
        finalSignatureUrl,
      },
    }));

    await queueService.enqueueJobBatch(bulkJobs);

    return res.status(202).json(
      new ApiResponse(
        202,
        { batch, count: validStudents.length, autoApproved: true },
        `Super Admin direct issuance: ${validStudents.length} certificates approved and queued for processing.`
      )
    );
  } else {
    // Regular Admin submission: Requires Super Admin review & approval before generation begins
    const batch = await CertificateBatch.create({
      batchId,
      eventName,
      eventDate,
      coordinatorName,
      signatureImage: finalSignatureUrl,
      students: validStudents,
      studentCount: validStudents.length,
      status: 'PENDING_APPROVAL',
      submittedBy: req.admin._id,
      submittedByName: req.admin.name || 'Admin',
      submittedByEmail: req.admin.email,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        { batch, count: validStudents.length, autoApproved: false },
        `Certificate batch submitted successfully (#${batch.batchId}). Awaiting Super Admin approval before generation begins.`
      )
    );
  }
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  if (!certificateId) {
    throw new ApiError(400, 'Certificate ID is required');
  }

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate || certificate.isDeleted) {
    throw new ApiError(404, 'Invalid Certificate ID or certificate has been revoked');
  }

  await logPublicEvent(req, `Certificate verified: ${certificateId}`);

  return res.status(200).json(new ApiResponse(200, certificate, 'Certificate verified successfully'));
});

const getLatestSignature = asyncHandler(async (req, res) => {
  const latestCertificate = await Certificate.findOne({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  
  if (!latestCertificate || !latestCertificate.signatureImage) {
    return res.status(200).json(new ApiResponse(200, { signatureUrl: null }, 'No previous signature found'));
  }

  return res.status(200).json(new ApiResponse(200, { signatureUrl: latestCertificate.signatureImage }, 'Latest signature fetched successfully'));
});

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAllCertificates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const query = { isDeleted: { $ne: true } };
  if (rawSearch) {
    const safeSearch = escapeRegExp(rawSearch).slice(0, 100);
    query.$and = [
      { isDeleted: { $ne: true } },
      {
        $or: [
          { studentName: { $regex: safeSearch, $options: 'i' } },
          { studentEmail: { $regex: safeSearch, $options: 'i' } },
          { eventName: { $regex: safeSearch, $options: 'i' } },
          { certificateId: { $regex: safeSearch, $options: 'i' } },
        ],
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [certificates, total] = await Promise.all([
    Certificate.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Certificate.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        certificates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Certificates fetched successfully'
    )
  );
});

// @desc    Get Certificate Batches (with approval status)
// @route   GET /api/v1/certificates/batches
// @access  Private (Admin & Super Admin)
const getCertificateBatches = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status && req.query.status !== 'ALL') {
    query.status = req.query.status;
  }

  const [batches, total, pendingCount] = await Promise.all([
    CertificateBatch.find(query)
      .select('-students')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CertificateBatch.countDocuments(query),
    CertificateBatch.countDocuments({ status: 'PENDING_APPROVAL' }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        batches,
        pendingCount,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Certificate batches fetched successfully'
    )
  );
});

// @desc    Get Single Certificate Batch Details (including student list)
// @route   GET /api/v1/certificates/batches/:id
// @access  Private (Admin & Super Admin)
const getCertificateBatchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batch = await CertificateBatch.findById(id).lean();

  if (!batch) {
    throw new ApiError(404, 'Certificate batch not found');
  }

  // If students array was purged or missing, dynamically hydrate from the Certificate collection
  if (!batch.students || batch.students.length === 0) {
    let certs = await Certificate.find({ batchId: batch._id, isDeleted: { $ne: true } })
      .select('studentName studentEmail position certificateId')
      .lean();

    if (!certs || certs.length === 0) {
      certs = await Certificate.find({
        $and: [
          { isDeleted: { $ne: true } },
          {
            $or: [
              { batchId: String(batch._id) },
              { batchId: batch.batchId },
              { eventName: batch.eventName },
            ],
          },
        ],
      })
      .select('studentName studentEmail position certificateId')
      .lean();
    }

    if (certs && certs.length > 0) {
      batch.students = certs.map((c) => ({
        name: c.studentName,
        email: c.studentEmail,
        position: c.position,
        certificateId: c.certificateId,
      }));
    } else {
      batch.students = [];
    }
  }

  return res.status(200).json(
    new ApiResponse(200, batch, 'Certificate batch details retrieved successfully')
  );
});

// @desc    Approve Certificate Batch & Trigger Generation Queue
// @route   PATCH /api/v1/certificates/batches/:id/approve
// @access  Private (Super Admin Only)
const approveCertificateBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const batch = await CertificateBatch.findById(id);
  if (!batch) {
    throw new ApiError(404, 'Certificate batch not found');
  }

  if (batch.status !== 'PENDING_APPROVAL') {
    throw new ApiError(400, `Cannot approve a batch with status "${batch.status}".`);
  }

  if (!batch.students || batch.students.length === 0) {
    throw new ApiError(400, `Cannot approve batch #${batch.batchId}: No students found in this batch roster.`);
  }

  batch.status = 'PROCESSING';
  batch.approvedBy = req.admin._id;
  batch.approvedByName = req.admin.name || 'Super Admin';
  batch.approvedAt = new Date();
  await batch.save();

  const bulkJobs = batch.students.map((student) => ({
    type: 'CERTIFICATE_BULK',
    payload: {
      batchId: batch._id,
      eventName: batch.eventName,
      eventDate: batch.eventDate,
      coordinatorName: batch.coordinatorName,
      student,
      finalSignatureUrl: batch.signatureImage,
    },
  }));

  await queueService.enqueueJobBatch(bulkJobs);

  return res.status(200).json(
    new ApiResponse(
      200,
      batch,
      `Certificate batch #${batch.batchId} approved successfully! ${batch.studentCount} certificates are now queued for generation.`
    )
  );
});

// @desc    Reject Certificate Batch
// @route   PATCH /api/v1/certificates/batches/:id/reject
// @access  Private (Super Admin Only)
const rejectCertificateBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const batch = await CertificateBatch.findById(id);
  if (!batch) {
    throw new ApiError(404, 'Certificate batch not found');
  }

  // Once a certificate batch is approved, it can NEVER be rejected or revoked
  if (batch.status !== 'PENDING_APPROVAL') {
    throw new ApiError(
      400,
      `Cannot reject batch #${batch.batchId}. Once approved by Super Admin, a certificate batch cannot be rejected or revoked.`
    );
  }

  batch.status = 'REJECTED';
  batch.rejectionReason = reason?.trim() || 'Rejected by Super Admin';
  batch.rejectedAt = new Date();

  // 1. Create a single normalized deletion record to avoid duplicating deletedBy/reason across all batch certificates
  const deletionRecord = await CertificateDeletion.create({
    deletedAt: new Date(),
    deletedBy: req.admin._id,
    deletedByName: req.admin.name || 'Super Admin',
    reason: `Batch #${batch.batchId} rejected: ${batch.rejectionReason}`,
    batchId: batch._id,
    certificateCount: batch.studentCount || 0,
  });

  // Soft-delete certificates associated strictly with this batch into 7-day TTL recovery trash referencing the deletion session
  const certDeleteResult = await Certificate.updateMany(
    { batchId: batch._id, isDeleted: { $ne: true } },
    {
      $set: {
        isDeleted: true,
        deletedAt: deletionRecord.deletedAt,
        deletionId: deletionRecord._id,
      },
      $unset: {
        deletedBy: 1,
        deletedByName: 1,
        deleteReason: 1,
      },
    }
  );

  // 2. Suppress and cancel any pending or in-flight background queue jobs for this batch
  await BackgroundJob.updateMany(
    {
      'payload.batchId': batch._id,
      status: { $in: ['PENDING', 'PROCESSING'] },
    },
    {
      status: 'SUPPRESSED',
      lastError: `Batch #${batch.batchId} was rejected by Super Admin: ${batch.rejectionReason}`,
    }
  );

  await batch.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        batch,
        deletedCertificatesCount: certDeleteResult.deletedCount || 0,
      },
      `Certificate batch #${batch.batchId} rejected.${
        certDeleteResult.deletedCount > 0
          ? ` ${certDeleteResult.deletedCount} certificate(s) deleted from database.`
          : ''
      }`
    )
  );
});

// @desc    Update a Certificate Batch (Details & Student Roster)
// @route   PUT /api/v1/certificates/batches/:id
// @access  Private (Submitting Admin or Super Admin)
const updateCertificateBatch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batch = await CertificateBatch.findById(id);

  if (!batch) {
    throw new ApiError(404, 'Certificate batch not found');
  }

  // Authorization check: Submitting Admin or Super Admin
  const isSuperAdmin = req.admin?.role === 'SuperAdmin';
  const isOwner = batch.submittedBy && batch.submittedBy.toString() === req.admin._id.toString();

  if (!isSuperAdmin && !isOwner) {
    throw new ApiError(403, 'You do not have permission to edit this certificate batch.');
  }

  // Regular admins can only edit PENDING_APPROVAL batches;
  // Super Admins can edit any batch (PENDING_APPROVAL, REJECTED, or modify previously approved batches)
  if (!isSuperAdmin && batch.status !== 'PENDING_APPROVAL') {
    throw new ApiError(
      400,
      `Cannot edit batch #${batch.batchId}. It is currently in "${batch.status}" status. Only batches in "PENDING_APPROVAL" can be modified by standard Admins.`
    );
  }

  const { eventName, eventDate, coordinatorName, studentsStr, signatureImageUrl } = req.body;

  if (eventName && eventName.trim()) {
    batch.eventName = eventName.trim();
  }
  if (eventDate) {
    batch.eventDate = eventDate;
  }
  if (coordinatorName && coordinatorName.trim()) {
    batch.coordinatorName = coordinatorName.trim();
  }

  // Handle signature image update if provided
  if (req.file?.path) {
    const signatureImage = await uploadOnCloudinary(req.file.path, 'CodeX/certificate');
    if (signatureImage) {
      batch.signatureImage = signatureImage.secure_url || signatureImage.url;
    }
  } else if (signatureImageUrl && signatureImageUrl.trim()) {
    batch.signatureImage = signatureImageUrl.trim();
  }

  // Update students roster if provided
  let validStudents = null;
  if (studentsStr || req.body.students) {
    let rawStudents;
    if (studentsStr) {
      try {
        rawStudents = JSON.parse(studentsStr);
      } catch (e) {
        throw new ApiError(400, 'Invalid students data format');
      }
    } else {
      rawStudents = req.body.students;
    }

    if (Array.isArray(rawStudents)) {
      const seenEmails = new Set();
      validStudents = [];
      for (const s of rawStudents) {
        if (s && s.name && s.email) {
          const email = s.email.trim().toLowerCase();
          if (!seenEmails.has(email)) {
            seenEmails.add(email);
            validStudents.push({
              name: s.name.trim(),
              email,
              position: s.position?.trim() || 'Participant',
            });
          }
        }
      }

      if (validStudents.length === 0) {
        throw new ApiError(400, 'A certificate batch must contain at least one valid student.');
      }
    }
  }

  const isAlreadyApproved =
    batch.status === 'COMPLETED' || batch.status === 'APPROVED' || batch.status === 'PROCESSING';

  if (isAlreadyApproved) {
    // 1. Update event metadata in-place on existing active certificates of this batch (never delete them)
    const certUpdateFields = {};
    if (eventName && eventName.trim()) certUpdateFields.eventName = batch.eventName;
    if (eventDate) certUpdateFields.eventDate = batch.eventDate;
    if (coordinatorName && coordinatorName.trim()) certUpdateFields.coordinatorName = batch.coordinatorName;
    if (batch.signatureImage) certUpdateFields.signatureImage = batch.signatureImage;

    if (Object.keys(certUpdateFields).length > 0) {
      await Certificate.updateMany(
        { batchId: batch._id, isDeleted: { $ne: true } },
        { $set: certUpdateFields }
      );
    }

    // 2. Preserve all existing approved members (cannot delete members), update details in-place, and append new members
    const existingStudentsMap = new Map();
    for (const s of (batch.students || [])) {
      existingStudentsMap.set(s.email.toLowerCase().trim(), s);
    }

    const newStudents = [];
    if (Array.isArray(validStudents)) {
      for (const s of validStudents) {
        const email = s.email.toLowerCase().trim();
        if (!existingStudentsMap.has(email)) {
          // Brand new member added to approved batch
          newStudents.push(s);
          existingStudentsMap.set(email, s);
        } else {
          // Existing member: update name or award/position in-place
          const existing = existingStudentsMap.get(email);
          existing.name = s.name.trim();
          existing.position = s.position?.trim() || existing.position || 'Participant';
          existingStudentsMap.set(email, existing);

          await Certificate.updateOne(
            { batchId: batch._id, studentEmail: email, isDeleted: { $ne: true } },
            { $set: { studentName: s.name.trim(), position: existing.position } }
          );
        }
      }
    }

    batch.students = Array.from(existingStudentsMap.values());
    batch.studentCount = batch.students.length;

    // 3. If new members were added, immediately queue generation strictly for the new members
    if (newStudents.length > 0) {
      for (const student of newStudents) {
        await queueService.enqueueJob('CERTIFICATE_BULK', {
          batchId: batch._id,
          eventName: batch.eventName,
          eventDate: batch.eventDate,
          coordinatorName: batch.coordinatorName,
          student,
          finalSignatureUrl: batch.signatureImage,
        });
      }
      batch.status = 'PROCESSING';
    }

    await batch.save();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          batch,
          newMembersAdded: newStudents.length,
          deletedCertificatesCount: 0,
        },
        `Batch #${batch.batchId} updated successfully. Event details updated in-place.${
          newStudents.length > 0
            ? ` ${newStudents.length} new member(s) queued for generation.`
            : ' All existing approved member certificates preserved.'
        }`
      )
    );
  }

  // For unapproved batches (PENDING_APPROVAL), update metadata and roster freely
  if (Array.isArray(validStudents)) {
    batch.students = validStudents;
    batch.studentCount = validStudents.length;
  }
  batch.status = 'PENDING_APPROVAL';
  batch.rejectionReason = '';
  await batch.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        batch,
        deletedCertificatesCount: 0,
      },
      `Certificate batch #${batch.batchId} updated successfully. Ready for review & authorization.`
    )
  );
});

// @desc    Delete Single Certificate (Soft delete with 7-day TTL recovery)
// @route   DELETE /api/v1/certificates/:id
// @access  Private (Super Admin Only)
const deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  if (certificate.isDeleted) {
    throw new ApiError(400, 'Certificate is already in 7-day recovery trash');
  }

  const deletionRecord = await CertificateDeletion.create({
    deletedAt: new Date(),
    deletedBy: req.admin._id,
    deletedByName: req.admin.name || 'Super Admin',
    reason: req.body?.reason?.trim() || 'Deleted by Super Admin',
    batchId: certificate.batchId,
    certificateCount: 1,
  });

  certificate.isDeleted = true;
  certificate.deletedAt = deletionRecord.deletedAt;
  certificate.deletionId = deletionRecord._id;
  await certificate.save();

  if (certificate.batchId) {
    await CertificateBatch.findByIdAndUpdate(certificate.batchId, {
      $inc: { generatedCount: -1 },
    });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      certificate,
      `Certificate #${certificate.certificateId} moved to 7-day recovery trash. It will be permanently auto-purged by MongoDB after 7 days.`
    )
  );
});

// @desc    Resend Certificate Email to Student
// @route   POST /api/v1/certificates/:id/resend
// @access  Private (Admin & Super Admin)
const resendCertificateEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  const verificationLink = `${process.env.FRONTEND_URL}/verify-certificate/${certificate.certificateId}`;
  const { html, text } = certificateEmail({
    studentName: certificate.studentName,
    eventName: certificate.eventName,
    certificateId: certificate.certificateId,
    verificationLink,
    position: certificate.position || 'Participant',
  });

  await queueService.enqueueJob('EMAIL_SEND', {
    certificateId: certificate.certificateId,
    email: certificate.studentEmail,
    subject: `Your Certificate for ${certificate.eventName} (Resent)`,
    message: html,
    textMessage: text,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { certificateId: certificate.certificateId, studentEmail: certificate.studentEmail },
      `Certificate email queued for delivery to ${certificate.studentEmail}.`
    )
  );
});

// @desc    Export Batch Certificates as CSV
// @route   GET /api/v1/certificates/batches/:id/export
// @access  Private (Admin & Super Admin)
const exportBatchCertificatesCsv = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const batch = await CertificateBatch.findById(id).lean();

  if (!batch) {
    throw new ApiError(404, 'Certificate batch not found');
  }

  let certs = await Certificate.find({ batchId: batch._id, isDeleted: { $ne: true } }).sort({ createdAt: 1 }).lean();
  if (!certs || certs.length === 0) {
    certs = await Certificate.find({
      $and: [
        { isDeleted: { $ne: true } },
        {
          $or: [
            { batchId: String(batch._id) },
            { batchId: batch.batchId },
            { eventName: batch.eventName },
          ],
        },
      ],
    }).sort({ createdAt: 1 }).lean();
  }

  const rows = [
    ['Student Name', 'Email', 'Position', 'Certificate ID', 'Verification Link', 'Delivery Status', 'Issued At'],
  ];

  if (certs && certs.length > 0) {
    for (const c of certs) {
      const link = `${process.env.FRONTEND_URL}/verify-certificate/${c.certificateId}`;
      rows.push([
        `"${(c.studentName || '').replace(/"/g, '""')}"`,
        `"${(c.studentEmail || '').replace(/"/g, '""')}"`,
        `"${(c.position || 'Participant').replace(/"/g, '""')}"`,
        `"${c.certificateId || ''}"`,
        `"${link}"`,
        `"${c.emailStatus || 'SENT'}"`,
        `"${c.createdAt ? new Date(c.createdAt).toISOString() : ''}"`,
      ]);
    }
  } else if (batch.students && batch.students.length > 0) {
    for (const s of batch.students) {
      rows.push([
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${(s.position || 'Participant').replace(/"/g, '""')}"`,
        '"PENDING_APPROVAL"',
        '""',
        '"NOT_GENERATED"',
        '""',
      ]);
    }
  }

  // Prepend UTF-8 BOM (\uFEFF) for seamless Microsoft Excel rendering
  const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
  const filename = `CodeX_Certificates_${(batch.eventName || 'Batch').replace(/[^a-zA-Z0-9_-]/g, '_')}_${batch.batchId || batch._id}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  return res.status(200).send(csvContent);
});

// @desc    Export All or Filtered Certificates as CSV
// @route   GET /api/v1/certificates/export
// @access  Private (Admin & Super Admin)
const exportAllCertificatesCsv = asyncHandler(async (req, res) => {
  const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const query = { isDeleted: { $ne: true } };

  if (rawSearch) {
    const safeSearch = escapeRegExp(rawSearch).slice(0, 100);
    query.$and = [
      { isDeleted: { $ne: true } },
      {
        $or: [
          { studentName: { $regex: safeSearch, $options: 'i' } },
          { studentEmail: { $regex: safeSearch, $options: 'i' } },
          { eventName: { $regex: safeSearch, $options: 'i' } },
          { certificateId: { $regex: safeSearch, $options: 'i' } },
        ],
      },
    ];
  }

  const certs = await Certificate.find(query).sort({ createdAt: -1 }).limit(5000).lean();

  const rows = [
    [
      'Student Name',
      'Email',
      'Event Name',
      'Event Date',
      'Position',
      'Certificate ID',
      'Verification Link',
      'Delivery Status',
      'Issued At',
    ],
  ];

  for (const c of certs) {
    const link = `${process.env.FRONTEND_URL}/verify-certificate/${c.certificateId}`;
    const formattedDate = c.eventDate ? new Date(c.eventDate).toLocaleDateString('en-IN') : '';
    const issuedDate = c.createdAt ? new Date(c.createdAt).toISOString() : '';
    rows.push([
      `"${(c.studentName || '').replace(/"/g, '""')}"`,
      `"${(c.studentEmail || '').replace(/"/g, '""')}"`,
      `"${(c.eventName || '').replace(/"/g, '""')}"`,
      `"${formattedDate}"`,
      `"${(c.position || 'Participant').replace(/"/g, '""')}"`,
      `"${c.certificateId || ''}"`,
      `"${link}"`,
      `"${c.emailStatus || 'SENT'}"`,
      `"${issuedDate}"`,
    ]);
  }

  const csvContent = '\uFEFF' + rows.map((r) => r.join(',')).join('\r\n');
  const filename = `CodeX_Certificates_Archive_${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
  return res.status(200).send(csvContent);
});

// ============================================================================
// SUPER ADMIN ONLY: 7-DAY TTL TRASH / RECOVERY CONTROLLERS
// ============================================================================

// @desc    Get Soft-deleted Certificates in 7-day TTL Trash
// @route   GET /api/v1/certificates/trash
// @access  Private (Super Admin Only)
const getDeletedCertificates = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const rawSearch = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const query = { isDeleted: true };

  if (rawSearch) {
    const safeSearch = escapeRegExp(rawSearch).slice(0, 100);

    // Search both direct certificate fields and normalized CertificateDeletion sessions
    const matchingDeletions = await CertificateDeletion.find({
      $or: [
        { deletedByName: { $regex: safeSearch, $options: 'i' } },
        { reason: { $regex: safeSearch, $options: 'i' } },
      ],
    }).select('_id').lean();
    const matchingDeletionIds = matchingDeletions.map((d) => d._id);

    query.$and = [
      { isDeleted: true },
      {
        $or: [
          { studentName: { $regex: safeSearch, $options: 'i' } },
          { studentEmail: { $regex: safeSearch, $options: 'i' } },
          { eventName: { $regex: safeSearch, $options: 'i' } },
          { certificateId: { $regex: safeSearch, $options: 'i' } },
          { deletionId: { $in: matchingDeletionIds } },
          { deletedByName: { $regex: safeSearch, $options: 'i' } },
          { deleteReason: { $regex: safeSearch, $options: 'i' } },
        ],
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [rawCertificates, total] = await Promise.all([
    Certificate.find(query)
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('deletionId')
      .lean(),
    Certificate.countDocuments(query),
  ]);

  const now = Date.now();
  const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  const certificates = rawCertificates.map((cert) => {
    const deletedTime = cert.deletedAt ? new Date(cert.deletedAt).getTime() : now;
    const expiresAt = new Date(deletedTime + TTL_MS);
    const msRemaining = Math.max(0, expiresAt.getTime() - now);
    const totalHoursRemaining = Math.floor(msRemaining / (1000 * 60 * 60));
    const daysRemaining = Math.floor(totalHoursRemaining / 24);
    const hoursRemaining = totalHoursRemaining % 24;

    // Pull from normalized deletion session if available, falling back to legacy fields
    const deletedByName = cert.deletionId?.deletedByName || cert.deletedByName || 'Admin';
    const deleteReason = cert.deletionId?.reason || cert.deleteReason || '';
    const deletedBy = cert.deletionId?.deletedBy || cert.deletedBy;

    return {
      ...cert,
      deletedByName,
      deleteReason,
      deletedBy,
      expiresAt,
      msRemaining,
      daysRemaining,
      hoursRemaining,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        certificates,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Trash certificates fetched successfully'
    )
  );
});

// @desc    Restore a Soft-deleted Certificate from Trash
// @route   PATCH /api/v1/certificates/trash/:id/restore
// @access  Private (Super Admin Only)
const restoreCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findById(id);

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found');
  }

  if (!certificate.isDeleted) {
    throw new ApiError(400, 'Certificate is active and not in trash');
  }

  const oldDeletionId = certificate.deletionId;
  certificate.isDeleted = false;
  certificate.deletedAt = null;
  certificate.deletionId = null;
  certificate.deletedBy = undefined;
  certificate.deletedByName = '';
  certificate.deleteReason = '';
  await certificate.save();

  if (oldDeletionId) {
    const remainingWithDeletion = await Certificate.countDocuments({ deletionId: oldDeletionId });
    if (remainingWithDeletion === 0) {
      await CertificateDeletion.findByIdAndDelete(oldDeletionId);
    }
  }

  if (certificate.batchId) {
    await CertificateBatch.findByIdAndUpdate(certificate.batchId, {
      $inc: { generatedCount: 1 },
    });
  }

  return res.status(200).json(
    new ApiResponse(200, certificate, `Certificate #${certificate.certificateId} restored successfully.`)
  );
});

// @desc    Restore All Soft-deleted Certificates from Trash
// @route   POST /api/v1/certificates/trash/restore-all
// @access  Private (Super Admin Only)
const restoreAllDeletedCertificates = asyncHandler(async (req, res) => {
  const deletedCerts = await Certificate.find({ isDeleted: true }).lean();

  if (deletedCerts.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, { restoredCount: 0 }, 'Trash is already empty. No certificates to restore.')
    );
  }

  const result = await Certificate.updateMany(
    { isDeleted: true },
    {
      $set: {
        isDeleted: false,
        deletedAt: null,
        deletionId: null,
      },
      $unset: {
        deletedBy: 1,
        deletedByName: 1,
        deleteReason: 1,
      },
    }
  );

  // Clean up all deletion metadata
  await CertificateDeletion.deleteMany({});

  // Re-synchronize generated counts on batches
  const batchIds = [...new Set(deletedCerts.map((c) => c.batchId).filter(Boolean))];
  for (const bId of batchIds) {
    const activeCount = await Certificate.countDocuments({ batchId: bId, isDeleted: { $ne: true } });
    await CertificateBatch.findByIdAndUpdate(bId, { generatedCount: activeCount });
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { restoredCount: result.modifiedCount },
      `Successfully restored ${result.modifiedCount} certificate(s) from trash.`
    )
  );
});

// @desc    Permanently Hard Delete a Certificate (Super Admin Bypass 7-day TTL)
// @route   DELETE /api/v1/certificates/trash/:id
// @access  Private (Super Admin Only)
const permanentlyDeleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const certificate = await Certificate.findByIdAndDelete(id);

  if (!certificate) {
    throw new ApiError(404, 'Certificate not found in trash');
  }

  // Clean up normalized deletion log if no other soft-deleted certificates reference it
  if (certificate.deletionId) {
    const remainingWithDeletion = await Certificate.countDocuments({ deletionId: certificate.deletionId });
    if (remainingWithDeletion === 0) {
      await CertificateDeletion.findByIdAndDelete(certificate.deletionId);
    }
  }

  return res.status(200).json(
    new ApiResponse(200, certificate, `Certificate #${certificate.certificateId} permanently deleted from database.`)
  );
});

// @desc    Permanently Hard Delete All Soft-deleted Certificates in Trash
// @route   DELETE /api/v1/certificates/trash
// @access  Private (Super Admin Only)
const clearCertificateTrash = asyncHandler(async (req, res) => {
  const result = await Certificate.deleteMany({ isDeleted: true });
  await CertificateDeletion.deleteMany({});

  return res.status(200).json(
    new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      `Trash cleared: ${result.deletedCount} certificate(s) permanently deleted from database.`
    )
  );
});

export {
  generateBulkCertificates,
  verifyCertificate,
  getLatestSignature,
  getAllCertificates,
  getCertificateBatches,
  getCertificateBatchById,
  approveCertificateBatch,
  rejectCertificateBatch,
  updateCertificateBatch,
  deleteCertificate,
  resendCertificateEmail,
  exportBatchCertificatesCsv,
  exportAllCertificatesCsv,
  getDeletedCertificates,
  restoreCertificate,
  restoreAllDeletedCertificates,
  permanentlyDeleteCertificate,
  clearCertificateTrash,
};
