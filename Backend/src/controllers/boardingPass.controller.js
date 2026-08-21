import { BoardingPass } from '../models/boardingPass.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { queueService } from '../services/queueService.js';

const generateBulkBoardingPasses = asyncHandler(async (req, res) => {
  const { eventName, eventDescription, studentsStr } = req.body;
  
  if (!eventName || !eventDescription || !studentsStr) {
    throw new ApiError(400, 'Event Name, Event Description, and students data are required');
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

  const validStudents = students.filter(
    (student) => student && student.name && student.email && student.qid && student.qid.trim()
  );

  if (validStudents.length === 0) {
    throw new ApiError(400, 'No valid student records provided with Name, Email, and QID');
  }

  const bulkJobs = validStudents.map((student) => ({
    type: 'BOARDING_PASS_BULK',
    payload: {
      eventName,
      eventDescription,
      student,
    },
  }));

  await queueService.enqueueJobBatch(bulkJobs);

  return res.status(202).json(
    new ApiResponse(
      202,
      { count: validStudents.length },
      `Successfully queued ${validStudents.length} boarding pass jobs. Processing in the background with rate-limited email delivery.`
    )
  );
});

const verifyBoardingPass = asyncHandler(async (req, res) => {
  const { boardingPassId } = req.params;

  if (!boardingPassId) {
    throw new ApiError(400, 'Boarding Pass ID is required');
  }

  const boardingPass = await BoardingPass.findOne({ boardingPassId });

  if (!boardingPass) {
    throw new ApiError(404, 'Invalid Boarding Pass ID');
  }

  return res.status(200).json(new ApiResponse(200, boardingPass, 'Boarding pass verified successfully'));
});

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAllBoardingPasses = asyncHandler(async (req, res) => {
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
      { qid: { $regex: safeSearch, $options: 'i' } },
      { boardingPassId: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [boardingPasses, total] = await Promise.all([
    BoardingPass.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    BoardingPass.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        boardingPasses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Boarding passes fetched successfully'
    )
  );
});

export { generateBulkBoardingPasses, verifyBoardingPass, getAllBoardingPasses };
