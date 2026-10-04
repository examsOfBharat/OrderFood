"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function sendOTP(email: string) {
  try {
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Save to DB (upsert based on email)
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send real verification email
    await sendVerificationEmail(email, otp);

    return { success: true, message: "Verification code sent to your email" };
  } catch (error: any) {
    return { error: error.message || "Failed to send OTP email" };
  }
}

export async function registerUser(data: any) {
  try {
    await connectDB();
    
    if (!data.otp) {
      return { error: "OTP is required" };
    }

    // Verify OTP using email
    const otpRecord = await Otp.findOne({ email: data.email });
    if (!otpRecord) {
      return { error: "OTP expired or not found. Please request a new one." };
    }
    
    if (otpRecord.otp !== data.otp) {
      return { error: "Invalid OTP code" };
    }

    // Check again if user exists (just in case)
    const existingEmail = await User.findOne({ email: data.email });
    if (existingEmail) {
      return { error: "User with this email already exists" };
    }
    
    if (data.phone) {
      const existingPhone = await User.findOne({ phone: data.phone });
      if (existingPhone) {
        return { error: "User with this phone number already exists" };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = new User({
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: hashedPassword,
      role: data.role,
    });

    await user.save();
    
    // Delete OTP record after successful registration
    await Otp.deleteOne({ _id: otpRecord._id });

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
