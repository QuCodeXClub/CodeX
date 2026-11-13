import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, "Student email is required"],
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/, 'Please provide a valid email address']
    },
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    coordinatorName: {
      type: String,
      required: [true, "Coordinator name is required"],
    },
    signatureImage: {
      type: String, // URL to signature image
      required: [true, "Signature image is required"],
    },
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true, // Used for verification link
    },
    position: {
      type: String,
      enum: [
        'Participant',
        'Winner',
        'Runner Up',
        '1st Runner-up',
        '2nd Runner-up',
        'Volunteer',
        'Organizer',
      ],
      default: 'Participant',
      trim: true,
    },
    qrCodeImage: {
      type: String,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CertificateBatch',
    },
    emailStatus: {
      type: String,
      enum: ['PENDING', 'SENT', 'FAILED', 'BOUNCED'],
      default: 'PENDING',
    },
    emailSentAt: {
      type: Date,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    deletedByName: {
      type: String,
      default: '',
    },
    deleteReason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

// High-performance compound & sort indexes for verification, student lookups, and pagination
// Idempotency: guarantees no duplicate active certificates can ever exist for the same student within a batch
certificateSchema.index(
  { batchId: 1, studentEmail: 1 },
  { unique: true, sparse: true, partialFilterExpression: { isDeleted: false } }
);
certificateSchema.index({ batchId: 1, createdAt: -1 });
certificateSchema.index({ createdAt: -1 });
certificateSchema.index({ studentEmail: 1, createdAt: -1 });
certificateSchema.index({ eventName: 1, createdAt: -1 });

// MongoDB 7-Day TTL index: automatically purges soft-deleted documents 7 days after deletedAt (7 * 24 * 60 * 60 = 604800 seconds).
// Active documents where deletedAt is null or missing are not deleted.
certificateSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 604800 });
certificateSchema.index({ isDeleted: 1, createdAt: -1 });
certificateSchema.index({ isDeleted: 1, batchId: 1 });

export const Certificate = mongoose.model('Certificate', certificateSchema);
