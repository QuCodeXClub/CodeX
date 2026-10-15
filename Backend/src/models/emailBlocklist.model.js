import mongoose from 'mongoose';

const emailBlocklistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    type: {
      type: String,
      enum: ['BOUNCE', 'COMPLAINT', 'MANUAL'],
      default: 'BOUNCE',
    },
    reason: {
      type: String,
      default: 'Delivery failure or bounce reported',
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance compound indexes for filtering and pagination
emailBlocklistSchema.index({ type: 1, createdAt: -1 });
emailBlocklistSchema.index({ createdAt: -1 });

export const EmailBlocklist = mongoose.model('EmailBlocklist', emailBlocklistSchema);
