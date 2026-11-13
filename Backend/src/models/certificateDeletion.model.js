import mongoose from 'mongoose';

const certificateDeletionSchema = new mongoose.Schema(
  {
    deletedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    deletedByName: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    reason: {
      type: String,
      default: '',
      trim: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CertificateBatch',
    },
    certificateCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// 8-day TTL index: automatically purges deletion logs after soft-deleted certificates have expired (7 * 24h + 24h buffer)
certificateDeletionSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 691200 });
certificateDeletionSchema.index({ batchId: 1 });
certificateDeletionSchema.index({ deletedBy: 1 });

export const CertificateDeletion = mongoose.model('CertificateDeletion', certificateDeletionSchema);

