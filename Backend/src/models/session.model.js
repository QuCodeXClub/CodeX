import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: [true, "Admin ID is required for the session"],
    },
    token: {
      type: String,
      required: [true, "Session token is required"],
    },
    userAgent: {
      type: String, // Full raw string
      default: 'Unknown User Agent',
    },
    os: {
      type: String,
      default: 'Unknown OS',
    },
    browser: {
      type: String,
      default: 'Unknown Browser',
    },
    device: {
      type: String, // E.g., Mobile, Tablet, Desktop
      default: 'Desktop',
    },
    ipAddress: {
      type: String,
      required: [true, "IP address is required for security tracking"],
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'LOGGED_OUT', 'REVOKED', 'EXPIRED'],
      default: 'ACTIVE',
    },
    loggedOutAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
      required: [true, "Session expiration date is required"],
    },
    cleanupAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index to automatically delete sessions only when cleanupAt is reached
sessionSchema.index(
  { cleanupAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: {
      cleanupAt: { $type: 'date' },
    },
  }
);

// High-performance compound indexes for session validation and admin active session queries
// Note: { adminId: 1, status: 1, expiresAt: 1 } fully covers any { adminId, status } prefix lookups.
sessionSchema.index({ token: 1, status: 1 });
sessionSchema.index({ adminId: 1, status: 1, expiresAt: 1 });
sessionSchema.index({ adminId: 1, createdAt: -1 });

export const Session = mongoose.model('Session', sessionSchema);

// Synchronize indexes with MongoDB to ensure legacy duplicate indexes are dropped
Session.syncIndexes().catch(() => {});
