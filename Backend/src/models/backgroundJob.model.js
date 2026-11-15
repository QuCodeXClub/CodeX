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

// High-performance compound indexes for atomic polling, admin stats, and instant sorted exports
backgroundJobSchema.index({ status: 1, scheduledAt: 1, type: 1 });
backgroundJobSchema.index({ status: 1, type: 1, createdAt: -1 });
backgroundJobSchema.index({ status: 1, createdAt: -1 });
backgroundJobSchema.index({ type: 1, status: 1, createdAt: -1 });
backgroundJobSchema.index({ status: 1, updatedAt: 1 });
backgroundJobSchema.index({ type: 1, createdAt: -1 });
backgroundJobSchema.index({ createdAt: -1 });

// Safe 90-day retention guarantees that existing ~1200 production records are preserved
backgroundJobSchema.index(
  { processedAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: { status: 'COMPLETED' },
    name: 'ttl_completed_90d',
  }
);

// Auto-purge SUPPRESSED jobs after 90 days
backgroundJobSchema.index(
  { processedAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: { status: 'SUPPRESSED' },
    name: 'ttl_suppressed_90d',
  }
);

// Auto-purge permanently FAILED jobs after 90 days
backgroundJobSchema.index(
  { processedAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,
    partialFilterExpression: { status: 'FAILED' },
    name: 'ttl_failed_90d',
  }
);

export const BackgroundJob = mongoose.model('BackgroundJob', backgroundJobSchema);

// Non-fatal index error listener for graceful index synchronization
BackgroundJob.on('index', (err) => {
  if (err) {
    console.warn('[BackgroundJob] Index sync notification (non-fatal):', err.message);
  }
});
