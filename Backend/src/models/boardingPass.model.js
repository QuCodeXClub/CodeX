import mongoose from 'mongoose';

const boardingPassSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, "Student email is required"],
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    eventDescription: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    qid: {
      type: String,
      required: [true, "QID is required"],
      trim: true,
    },
    wifiUser: {
      type: String,
      trim: true,
    },
    wifiPass: {
      type: String,
      trim: true,
    },
    loginUser: {
      type: String,
      trim: true,
    },
    loginPass: {
      type: String,
      trim: true,
    },
    citeNumber: {
      type: String,
      trim: true,
    },
    boardingPassId: {
      type: String,
      required: [true, "Boarding Pass ID is required"],
      unique: true,
    },
    qrCodeImage: {
      type: String,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const BoardingPass = mongoose.model('BoardingPass', boardingPassSchema);
