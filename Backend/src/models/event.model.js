import mongoose from "mongoose";

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
    registrationCloseDate: {
      type: Date, // Deadline after which registration is closed
      default: null,
    },
    locationType: {
      type: String,
      enum: {
        values: ["Online", "Offline"],
        message: "{VALUE} is not a valid location type",
      },
      default: "Offline",
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes for fast timeline filtering (upcoming/past) and sorting
eventSchema.index({ date: 1 });
eventSchema.index({ date: -1 });
eventSchema.index({ eventName: "text", location: "text", tags: "text" });

export const Event = mongoose.model("Event", eventSchema);

