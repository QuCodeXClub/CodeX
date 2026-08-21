import { TeamMember } from '../models/teamMember.model.js';
import { StudentRegistration } from '../models/studentRegistration.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { announcementEmail } from '../utils/emailTemplates.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

import { queueService } from '../services/queueService.js';

const sendAnnouncement = asyncHandler(async (req, res) => {
  const { targetAudience, subject, message, filters } = req.body;

  if (!targetAudience || !subject || !message) {
    throw new ApiError(400, 'Target audience, subject, and message are required');
  }

  let emailList = [];

  if (targetAudience === 'team') {
    const query = {};
    if (filters?.academicYear) query.academicYear = filters.academicYear;
    if (filters?.subTeam) query.subTeam = filters.subTeam;

    const members = await TeamMember.find(query).select('email');
    emailList = members.map((m) => m.email).filter(Boolean);
  } else if (targetAudience === 'students') {
    const query = {};
    if (filters?.academicYear) {
      const [startYear] = filters.academicYear.split("-");
      const startDate = new Date(`${startYear}-06-01T00:00:00.000Z`);
      const endDate = new Date(`${parseInt(startYear) + 1}-06-01T00:00:00.000Z`);
      query.createdAt = {
        $gte: startDate,
        $lt: endDate
      };
    }
    if (filters?.year) query.year = filters.year;
    if (filters?.course) query.course = filters.course;
    if (filters?.status) {
      query.status = filters.status;
    } else {
      query.status = 'APPROVED'; // default to only approved students if not specified
    }

    const students = await StudentRegistration.find(query).select('email');
    emailList = students.map((s) => s.email).filter(Boolean);
  } else {
    throw new ApiError(400, 'Invalid target audience');
  }

  // Remove duplicates
  emailList = [...new Set(emailList)];

  if (emailList.length === 0) {
    return res.status(200).json(new ApiResponse(200, null, 'No recipients found matching the filters.'));
  }

  const emailTemplate = announcementEmail(subject, message);

  // Enqueue announcement broadcast job
  await queueService.enqueueJob('ANNOUNCEMENT_BULK', {
    emailList,
    subject,
    messageHtml: emailTemplate.html,
    messageText: emailTemplate.text,
  });

  return res.status(202).json(
    new ApiResponse(
      202,
      { recipientCount: emailList.length },
      `Announcement queued for ${emailList.length} recipients. Emails are being dispatched safely at 12 emails/sec.`
    )
  );
});

import { BackgroundJob } from '../models/backgroundJob.model.js';

const getAnnouncementsHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const skip = (page - 1) * limit;

  const [announcements, total] = await Promise.all([
    BackgroundJob.find({ type: 'ANNOUNCEMENT_BULK' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    BackgroundJob.countDocuments({ type: 'ANNOUNCEMENT_BULK' }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        announcements,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Announcements history fetched successfully'
    )
  );
});

export { sendAnnouncement, getAnnouncementsHistory };
