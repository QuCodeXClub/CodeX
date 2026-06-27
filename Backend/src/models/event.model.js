import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    description: {
      type: String, // HTML Content
      required: [true, "Event description is required"],
    },
    coverImage: {
      type: String, // Cloudinary URL
      required: [true, "Cover image is required"],
    },
    registrationLink: {
      type: String, // URL
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);
