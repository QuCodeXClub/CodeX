import { Certificate } from '../models/certificate.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { queueService } from '../services/queueService.js';

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
    finalSignatureUrl = signatureImage.url;
  }

  const validStudents = students.filter(s => s && s.name && s.email);

  const bulkJobs = validStudents.map((student) => ({
    type: 'CERTIFICATE_BULK',
    payload: {
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
      { count: validStudents.length },
      `Successfully queued ${validStudents.length} certificate jobs. Processing in the background with rate limiting.`
    )
  );
});

const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  if (!certificateId) {
    throw new ApiError(400, 'Certificate ID is required');
  }

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    throw new ApiError(404, 'Invalid Certificate ID');
  }

  return res.status(200).json(new ApiResponse(200, certificate, 'Certificate verified successfully'));
});

const getLatestSignature = asyncHandler(async (req, res) => {
  const latestCertificate = await Certificate.findOne().sort({ createdAt: -1 });
  
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

  const query = {};
  if (rawSearch) {
    const safeSearch = escapeRegExp(rawSearch).slice(0, 100);
    query.$or = [
      { studentName: { $regex: safeSearch, $options: 'i' } },
      { studentEmail: { $regex: safeSearch, $options: 'i' } },
      { eventName: { $regex: safeSearch, $options: 'i' } },
      { certificateId: { $regex: safeSearch, $options: 'i' } },
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

export { generateBulkCertificates, verifyCertificate, getLatestSignature, getAllCertificates };
