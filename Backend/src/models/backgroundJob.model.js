import mongoose from 'mongoose';

const backgroundJobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Job type is required'],
      enum: ['CERTIFICATE_BULK', 'BOARDING_PASS_BULK', 'EMAIL_SEND', 'ANNOUNCEMENT_BULK'],
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Job payload is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'SUPPRESSED'],
      default: 'PENDING',
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    lastError: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for atomic polling & admin stats
backgroundJobSchema.index({ status: 1, scheduledAt: 1, type: 1 });
backgroundJobSchema.index({ status: 1, type: 1, createdAt: -1 });
backgroundJobSchema.index({ status: 1, updatedAt: 1 });
backgroundJobSchema.index({ type: 1, createdAt: -1 });
backgroundJobSchema.index({ createdAt: -1 });

// Production storage optimization: Auto-purge COMPLETED jobs after 30 days via MongoDB TTL engine
// Prevents unbounded database disk growth from large stored email/payload structures
backgroundJobSchema.index(
  { processedAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 60 * 60,
    partialFilterExpression: { status: 'COMPLETED' },
  }
);

export const BackgroundJob = mongoose.model('BackgroundJob', backgroundJobSchema);
