import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['ADMIN_ACTIVITY', 'PUBLIC_ACCESS'],
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    adminName: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    }
  },
  { timestamps: true }
);

// Auto delete after 3 months (90 days)
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Compound index for instant paginated log queries by log type
logSchema.index({ type: 1, createdAt: -1 });

export const SystemLog = mongoose.model('SystemLog', logSchema);
