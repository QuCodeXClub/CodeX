import { BackgroundJob } from '../models/backgroundJob.model.js';
import { EmailBlocklist } from '../models/emailBlocklist.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { Certificate } from '../models/certificate.model.js';
import { BoardingPass } from '../models/boardingPass.model.js';
import { generateQRCodeWithLogo } from '../utils/qrGenerator.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { certificateEmail, boardingPassEmail } from '../utils/emailTemplates.js';
import crypto from 'crypto';

class QueueService {
  constructor() {
    this.isWorking = false;
    this.timerId = null;
    this.staleRecoveryTimerId = null;
    this.sentTimestamps = [];
    this.TARGET_MAX_EMAILS_PER_SEC = 12; // Target rate limit (12 emails/sec)
    this.HARD_MAX_EMAILS_PER_SEC = 14;   // Absolute ceiling (never exceed 14/sec)
    this.CONCURRENCY_LIMIT = 4;          // Parallel job workers per tick

    // High-performance in-memory blocklist cache
    this.blocklistSet = new Set();
    this.blocklistLastSync = 0;
    this.BLOCKLIST_TTL_MS = 30000; // Sync blocklist every 30 seconds
  }

  /**
   * Sync blocklist emails into memory for 0ms lookup overhead
   */
  async syncBlocklistCache() {
    const now = Date.now();
    if (now - this.blocklistLastSync < this.BLOCKLIST_TTL_MS && this.blocklistSet.size > 0) {
      return;
    }
    try {
      const list = await EmailBlocklist.find({}, 'email').lean();
      this.blocklistSet = new Set(list.map((item) => item.email.toLowerCase()));
      this.blocklistLastSync = now;
    } catch (err) {
      console.error('[QueueService] Failed to sync blocklist cache:', err);
    }
  }

  /**
   * Add email to in-memory blocklist cache immediately
   */
  addToBlocklistCache(email) {
    if (email) {
      this.blocklistSet.add(email.toLowerCase().trim());
    }
  }

  /**
   * Enqueue a single background job
   */
  async enqueueJob(type, payload, scheduledAt = new Date()) {
    return await BackgroundJob.create({
      type,
      payload,
      status: 'PENDING',
      scheduledAt,
    });
  }

  /**
   * Enqueue a batch of jobs in a single database query (High performance insertMany)
   */
  async enqueueJobBatch(jobsArray) {
    if (!Array.isArray(jobsArray) || jobsArray.length === 0) return [];
    
    const formattedJobs = jobsArray.map((item) => ({
      type: item.type,
      payload: item.payload,
      status: 'PENDING',
      scheduledAt: item.scheduledAt || new Date(),
    }));

    return await BackgroundJob.insertMany(formattedJobs, { ordered: false });
  }

  /**
   * Start the background worker loop & stale recovery watcher
   */
  startWorker(intervalMs = 60) {
    if (this.timerId) return;

    console.log(
      `[QueueService] High-Performance Job Worker started (Interval: ${intervalMs}ms, Max Rate: ${this.TARGET_MAX_EMAILS_PER_SEC}/s, Concurrency: ${this.CONCURRENCY_LIMIT}).`
    );

    // Initial cache sync
    this.syncBlocklistCache().catch(() => {});

    // Primary queue worker loop
    this.timerId = setInterval(async () => {
      if (this.isWorking) return;
      this.isWorking = true;

      try {
        await this.processNextBatch();
      } catch (err) {
        console.error('[QueueService] Error in worker tick:', err);
      } finally {
        this.isWorking = false;
      }
    }, intervalMs);

    // Periodic stale job recovery loop (runs every 60 seconds)
    this.staleRecoveryTimerId = setInterval(() => {
      this.recoverStaleJobs().catch((err) =>
        console.error('[QueueService] Error recovering stale jobs:', err)
      );
      this.syncBlocklistCache().catch(() => {});
    }, 60000);
  }

  /**
   * Stop worker loops
   */
  stopWorker() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.staleRecoveryTimerId) {
      clearInterval(this.staleRecoveryTimerId);
      this.staleRecoveryTimerId = null;
    }
    console.log('[QueueService] Background Job Worker stopped.');
  }

  /**
   * Auto-recover jobs stuck in 'PROCESSING' state due to server crash/restart (>5 min old)
   */
  async recoverStaleJobs() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const result = await BackgroundJob.updateMany(
      {
        status: 'PROCESSING',
        updatedAt: { $lt: fiveMinutesAgo },
      },
      {
        $set: { status: 'PENDING', scheduledAt: new Date() },
        $inc: { attempts: 1 },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[QueueService] Recovered ${result.modifiedCount} stale PROCESSING jobs back to PENDING.`);
    }
  }

  /**
   * Process a batch of pending jobs with concurrent workers and rolling 1s rate limits
   */
  async processNextBatch() {
    const now = Date.now();

    // 1. Purge timestamps older than 1000 ms
    this.sentTimestamps = this.sentTimestamps.filter((t) => now - t < 1000);

    // 2. Determine available slots under target rate limit
    const availableEmailSlots = Math.max(0, this.TARGET_MAX_EMAILS_PER_SEC - this.sentTimestamps.length);
    const canSendEmail = availableEmailSlots > 0;

    // 3. Process up to CONCURRENCY_LIMIT jobs in parallel
    const activePromises = [];
    for (let i = 0; i < this.CONCURRENCY_LIMIT; i++) {
      const queryFilter = {
        status: 'PENDING',
        scheduledAt: { $lte: new Date(now) },
      };

      if (!canSendEmail && i >= availableEmailSlots) {
        queryFilter.type = { $ne: 'EMAIL_SEND' };
      }

      const jobPromise = (async () => {
        const job = await BackgroundJob.findOneAndUpdate(
          queryFilter,
          {
            $set: { status: 'PROCESSING' },
            $inc: { attempts: 1 },
          },
          {
            sort: { scheduledAt: 1, _id: 1 },
            returnDocument: 'after',
          }
        );

        if (job) {
          await this.executeJob(job);
        }
      })();

      activePromises.push(jobPromise);
    }

    await Promise.all(activePromises);
  }

  /**
   * Route job execution by job type
   */
  async executeJob(job) {
    try {
      if (job.type === 'EMAIL_SEND') {
        await this.handleEmailSend(job);
      } else if (job.type === 'CERTIFICATE_BULK') {
        await this.handleCertificateBulk(job);
      } else if (job.type === 'BOARDING_PASS_BULK') {
        await this.handleBoardingPassBulk(job);
      } else if (job.type === 'ANNOUNCEMENT_BULK') {
        await this.handleAnnouncementBulk(job);
      } else {
        await BackgroundJob.findByIdAndUpdate(job._id, {
          status: 'COMPLETED',
          processedAt: new Date(),
        });
      }
    } catch (err) {
      console.error(`[QueueService] Job ${job._id} (${job.type}) failed:`, err);
      const isMaxAttempts = job.attempts >= job.maxAttempts;
      const nextSchedule = new Date(Date.now() + job.attempts * 5000); // 5s, 10s, 15s exponential backoff

      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: isMaxAttempts ? 'FAILED' : 'PENDING',
        lastError: err.message || String(err),
        scheduledAt: isMaxAttempts ? job.scheduledAt : nextSchedule,
        processedAt: isMaxAttempts ? new Date() : null,
      });
    }
  }

  /**
   * Handle single email send with zero-overhead in-memory blocklist check and rate ceiling
   */
  async handleEmailSend(job) {
    const { email, subject, message, textMessage, bcc } = job.payload;
    const recipientEmail = email ? email.toLowerCase().trim() : null;

    // 0ms In-Memory Blocklist Check
    if (recipientEmail && this.blocklistSet.has(recipientEmail)) {
      console.warn(`[QueueService] Skipping email to ${recipientEmail} (Suppressed in Blocklist)`);
      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: 'SUPPRESSED',
        lastError: 'Recipient email address is in suppression blocklist',
        processedAt: new Date(),
      });
      return;
    }

    // Rate Limit Guard: ensure hard limit ceiling of 14/sec is never breached
    const now = Date.now();
    this.sentTimestamps = this.sentTimestamps.filter((t) => now - t < 1000);
    if (this.sentTimestamps.length >= this.HARD_MAX_EMAILS_PER_SEC) {
      // Re-queue for next tick
      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: 'PENDING',
        scheduledAt: new Date(now + 80),
      });
      return;
    }

    // Record timestamp before sending to guarantee rolling 1s window rate limit
    this.sentTimestamps.push(Date.now());

    try {
      await sendEmail({ email, subject, message, textMessage, bcc });

      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: 'COMPLETED',
        processedAt: new Date(),
      });
    } catch (err) {
      const errorMsg = err.message || '';
      
      // Auto-detect hard bounce or recipient rejection to add to blocklist automatically
      const isHardBounce =
        errorMsg.includes('550') ||
        errorMsg.toLowerCase().includes('user unknown') ||
        errorMsg.toLowerCase().includes('recipient rejected') ||
        errorMsg.toLowerCase().includes('invalid recipient');

      if (recipientEmail && isHardBounce) {
        console.warn(`[QueueService] Auto-blocking hard bounced email: ${recipientEmail}`);
        this.addToBlocklistCache(recipientEmail);
        await EmailBlocklist.updateOne(
          { email: recipientEmail },
          {
            $setOnInsert: {
              email: recipientEmail,
              type: 'BOUNCE',
              reason: `Automatic system capture: ${errorMsg}`,
            },
          },
          { upsert: true }
        );
      }

      throw err; // rethrow to trigger retry mechanism
    }
  }

  /**
   * Handle single student certificate generation job
   */
  async handleCertificateBulk(job) {
    const { eventName, eventDate, coordinatorName, student, finalSignatureUrl } = job.payload;

    if (!student || !student.name || !student.email) {
      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: 'COMPLETED',
        processedAt: new Date(),
      });
      return;
    }

    const certificateId = crypto.randomBytes(8).toString('hex');
    const verificationLink = `${process.env.FRONTEND_URL}/verify-certificate/${certificateId}`;

    let qrCodeUrl = '';
    try {
      const dataUri = await generateQRCodeWithLogo(verificationLink);
      const qrUpload = await uploadOnCloudinary(dataUri, 'CodeX/certificate');
      if (qrUpload) {
        qrCodeUrl = qrUpload.secure_url || qrUpload.url;
      }
    } catch (qrError) {
      console.error('[QueueService] QR generation failed for student:', student.email, qrError);
    }

    await Certificate.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDate,
      coordinatorName,
      signatureImage: finalSignatureUrl,
      certificateId,
      position: student.position || 'Participant',
      qrCodeImage: qrCodeUrl,
    });

    const { html, text } = certificateEmail({
      studentName: student.name,
      eventName,
      certificateId,
      verificationLink,
      position: student.position || 'Participant',
    });

    // Enqueue individual email sending job
    await this.enqueueJob('EMAIL_SEND', {
      email: student.email,
      subject: `Your Certificate for ${eventName}`,
      message: html,
      textMessage: text,
    });

    await BackgroundJob.findByIdAndUpdate(job._id, {
      status: 'COMPLETED',
      processedAt: new Date(),
    });
  }

  /**
   * Handle single student boarding pass generation job
   */
  async handleBoardingPassBulk(job) {
    const { eventName, eventDescription, time, student } = job.payload;

    if (!student || !student.name || !student.email) {
      await BackgroundJob.findByIdAndUpdate(job._id, {
        status: 'COMPLETED',
        processedAt: new Date(),
      });
      return;
    }

    const eventTime = (student.time || time || '').toString().trim();
    const studentQid = student.qid ? student.qid.trim() : '';
    const boardingPassId = crypto.randomBytes(8).toString('hex');
    const verificationLink = `${process.env.FRONTEND_URL}/verify-boarding-pass/${boardingPassId}`;

    let qrCodeUrl = '';
    try {
      const dataUri = await generateQRCodeWithLogo(verificationLink);
      const qrUpload = await uploadOnCloudinary(dataUri, 'CodeX/pass');
      if (qrUpload) {
        qrCodeUrl = qrUpload.secure_url || qrUpload.url;
      }
    } catch (qrError) {
      console.error('[QueueService] QR generation failed for boarding pass:', student.email, qrError);
    }

    await BoardingPass.create({
      studentName: student.name,
      studentEmail: student.email,
      eventName,
      eventDescription,
      time: eventTime,
      qid: studentQid,
      wifiUser: student.wifiUser,
      wifiPass: student.wifiPass,
      loginUser: student.loginUser,
      loginPass: student.loginPass,
      citeNumber: student.citeNumber,
      boardingPassId,
      qrCodeImage: qrCodeUrl,
    });

    const { html, text } = boardingPassEmail({
      studentName: student.name,
      eventName,
      eventDescription,
      time: eventTime,
      qid: studentQid,
      boardingPassId,
      citeNumber: student.citeNumber,
      verificationLink,
    });

    // Enqueue individual email sending job (rate-limited via queue)
    await this.enqueueJob('EMAIL_SEND', {
      email: student.email,
      subject: `Your Boarding Pass for ${eventName}`,
      message: html,
      textMessage: text,
    });

    await BackgroundJob.findByIdAndUpdate(job._id, {
      status: 'COMPLETED',
      processedAt: new Date(),
    });
  }

  /**
   * Handle announcement bulk routing job with High Performance Batch Enqueueing
   */
  async handleAnnouncementBulk(job) {
    const { emailList, subject, messageHtml, messageText } = job.payload;

    if (Array.isArray(emailList) && emailList.length > 0) {
      const emailJobs = emailList.map((email) => ({
        type: 'EMAIL_SEND',
        payload: {
          email,
          subject,
          message: messageHtml,
          textMessage: messageText,
        },
      }));

      // High Performance Batch Insert (1 database write instead of 1000s)
      await this.enqueueJobBatch(emailJobs);
    }

    await BackgroundJob.findByIdAndUpdate(job._id, {
      status: 'COMPLETED',
      processedAt: new Date(),
    });
  }
}

export const queueService = new QueueService();
