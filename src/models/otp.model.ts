import mongoose, { Schema } from "mongoose";
import { IOTP } from "../interfaces/otp.interface";

const otpSchema = new Schema<IOTP>({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  otp: {
    type: String,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120, // OTP expires in 2 minutes
  },
});

export const OTP = mongoose.model<IOTP>("OTP", otpSchema);
