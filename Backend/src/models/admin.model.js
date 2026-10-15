import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobileNumber: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', 'SuperAdmin'],
      default: 'Admin',
    },
  },
  { timestamps: true }
);

// High-performance compound indexes for admin role filtering and account management
adminSchema.index({ role: 1, createdAt: -1 });
adminSchema.index({ createdAt: -1 });

adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAuthToken = function (sessionId) {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      sessionId: sessionId,
      role: this.role || 'Admin',
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '10d',
    }
  );
};

export const Admin = mongoose.model('Admin', adminSchema);
