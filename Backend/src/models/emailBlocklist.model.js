import mongoose from 'mongoose';

const emailBlocklistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    type: {
      type: String,
      enum: ['BOUNCE', 'COMPLAINT', 'MANUAL'],
      default: 'BOUNCE',
      index: true,
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

export const EmailBlocklist = mongoose.model('EmailBlocklist', emailBlocklistSchema);
