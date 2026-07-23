import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    academicYear: {
      type: String,
      required: [true, "Academic year is required (e.g., '2024-2025')"], 
    },
    subTeam: {
      type: String,
      required: [true, "Sub-team is required"],
      enum: {
        values: ['Admin Team','Core Team', 'Tech Team', 'Graphic Team'],
        message: '{VALUE} is not a valid sub-team'
      },
    },
    name: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
    },
    post: {
      type: String,
      required: [true, "Post/Role is required (e.g., 'Project Lead')"], 
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    sequenceNumber: {
      type: Number,
      required: [true, "Sequence number is required"],
      default: 0
    },
    photo: {
      type: String, // Cloudinary URL
      required: [true, "Profile photo is required"],
    },
  },
  { timestamps: true }
);

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
