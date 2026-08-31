import mongoose from 'mongoose';

const studentRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    course: {
      type: String,
      required: [true, "Course is required"],
      enum: {
        values: ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'BBA', 'MBA', 'B.Sc', 'M.Sc'],
        message: '{VALUE} is not a valid course'
      }
    },
    year: {
      type: String,
      required: [true, "Academic year is required"],
      enum: {
        values: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        message: '{VALUE} is not a valid year'
      }
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      enum: {
        values: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
        message: '{VALUE} is not a valid semester'
      }
    },
    section: {
      type: String,
      required: [true, "Section is required"],
    },
    set: {
      type: String,
      required: [true, "Set/Group is required"],
    },
    studentId: {
      type: String,
      required: [true, "Student ID (Q ID) is required"],
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
      match: [/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required for fee verification"],
      trim: true,
    },
    paymentMode: {
      type: String,
      enum: {
        values: ['ONLINE', 'CASH'],
        message: '{VALUE} is not a valid payment mode'
      },
      default: 'ONLINE',
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid status'
      },
      default: 'PENDING',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// High-performance indexing for 500+ concurrent queries and lookups
studentRegistrationSchema.index({ email: 1 });
studentRegistrationSchema.index({ createdAt: -1 });
studentRegistrationSchema.index({ status: 1, createdAt: -1 });

// Atomic race-condition prevention under high concurrency:
// Enforces uniqueness for PENDING and APPROVED states while allowing REJECTED students to re-register
studentRegistrationSchema.index(
  { studentId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['PENDING', 'APPROVED'] } },
    background: true,
  }
);

studentRegistrationSchema.index(
  { transactionId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['PENDING', 'APPROVED'] } },
    background: true,
  }
);

export const StudentRegistration = mongoose.model(
  'StudentRegistration',
  studentRegistrationSchema
);
