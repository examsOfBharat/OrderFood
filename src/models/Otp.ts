import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0, // This TTL index will automatically delete the document when expiresAt is reached
    },
  },
  { timestamps: true }
);

// To prevent Mongoose from using the old schema in Next.js development (Hot Reloading)
if (mongoose.models.Otp) {
  delete mongoose.models.Otp;
}

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
