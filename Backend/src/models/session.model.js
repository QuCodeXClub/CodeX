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
      required: [true, "User agent string is required"],
    },
    os: {
      type: String,
      required: [true, "Operating system is required"],
    },
    browser: {
      type: String,
      required: [true, "Browser information is required"],
    },
    device: {
      type: String, // E.g., Mobile, Tablet, Desktop
      required: [true, "Device type is required"],
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

export const Session = mongoose.model('Session', sessionSchema);

// Synchronize indexes with MongoDB to ensure legacy TTL indexes (updatedAt_1, expiresAt_1) are dropped
Session.syncIndexes().catch(() => {});
