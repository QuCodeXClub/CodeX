import mongoose from 'mongoose';

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Setting key is required'],
      unique: true,
      trim: true,
    },
    // Registration portal configuration
    isRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    closedMessage: {
      type: String,
      default: 'Registrations are currently closed. Please check back later or contact the CodeX team.',
      trim: true,
    },
    openedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
);

export const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
