import mongoose from 'mongoose';

const studentItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      default: 'Participant',
      trim: true,
    },
  },
  { _id: false }
);

const certificateBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    coordinatorName: {
      type: String,
      required: [true, 'Coordinator name is required'],
      trim: true,
    },
    signatureImage: {
      type: String,
      required: [true, 'Signature image is required'],
    },
    students: {
      type: [studentItemSchema],
      default: undefined,
    },
    studentCount: {
      type: Number,
      default: 0,
    },
    generatedCount: {
      type: Number,
      default: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING_APPROVAL', 'APPROVED', 'PROCESSING', 'COMPLETED', 'FAILED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
    },
    completedAt: {
      type: Date,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    submittedByName: {
      type: String,
      default: 'Admin',
    },
    submittedByEmail: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    approvedByName: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// High-performance compound indexes for batch approvals, admin history, and pagination
certificateBatchSchema.index({ status: 1, createdAt: -1 });
certificateBatchSchema.index({ submittedBy: 1, createdAt: -1 });
certificateBatchSchema.index({ createdAt: -1 });

export const CertificateBatch = mongoose.model('CertificateBatch', certificateBatchSchema);
