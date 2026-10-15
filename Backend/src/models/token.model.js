import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'userType',
    },
    userType: {
      type: String,
      required: true,
      enum: ['Admin', 'Student'], // Allows tokens to be used by any user type
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['AUTH_OTP', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
      required: true,
    },
    description: {
      type: String,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

tokenSchema.pre('save', async function () {
  if (!this.isModified('token')) return;
  this.token = await bcrypt.hash(this.token, 10);
});

tokenSchema.methods.isTokenCorrect = async function (token) {
  return await bcrypt.compare(token, this.token);
};

// Create a TTL (Time-To-Live) index on the expiresAt field. 
// MongoDB will automatically delete the document when the current time reaches expiresAt.
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for fast OTP & reset token lookups by user and token type
tokenSchema.index({ userId: 1, type: 1 });

export const Token = mongoose.model('Token', tokenSchema);
