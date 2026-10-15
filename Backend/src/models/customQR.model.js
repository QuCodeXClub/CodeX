import mongoose from 'mongoose';

const customQrSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      required: [true, 'Link is required'],
      trim: true,
    },
    qrUrl: {
      type: String,
      required: [true, 'QR Code URL is required'],
    }
  },
  { timestamps: true }
);

customQrSchema.index({ createdAt: -1 });

export const CustomQR = mongoose.model('CustomQR', customQrSchema);
