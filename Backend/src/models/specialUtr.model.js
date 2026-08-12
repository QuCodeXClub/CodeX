import mongoose from 'mongoose';

const specialUtrSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Special UTR code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentRegistration',
      default: null,
    },
    usedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

export const SpecialUtr = mongoose.model('SpecialUtr', specialUtrSchema);
