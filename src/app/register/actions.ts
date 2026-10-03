"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(data: any) {
  try {
    await connectDB();
    const existingPhone = await User.findOne({ phone: data.phone });
    if (existingPhone) {
      return { error: "User with this phone already exists" };
    }
    
    if (data.email) {
      const existingEmail = await User.findOne({ email: data.email });
      if (existingEmail) {
        return { error: "User with this email already exists" };
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
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
