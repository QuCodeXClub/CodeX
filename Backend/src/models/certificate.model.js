import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
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
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    coordinatorName: {
      type: String,
      required: [true, "Coordinator name is required"],
    },
    signatureImage: {
      type: String, // URL to signature image
      required: [true, "Signature image is required"],
    },
    certificateId: {
      type: String,
      required: [true, "Certificate ID is required"],
      unique: true, // Used for verification link
    },
    position: {
      type: String,
      enum: ['Participant', 'Winner', '1st Runner-up', '2nd Runner-up', 'Volunteer', 'Organizer', 'Other'],
      default: 'Participant'
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

export const Certificate = mongoose.model('Certificate', certificateSchema);
