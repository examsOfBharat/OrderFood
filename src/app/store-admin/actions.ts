"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Store from "@/models/Store";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { auth } from "@/auth";
import { Types } from "mongoose";

import { storeProfileSchema } from "@/lib/schemas";

export async function getStoreProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  return store ? JSON.parse(JSON.stringify(store)) : null;
}

export async function updateStoreProfile(data: z.infer<typeof storeProfileSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validatedData = storeProfileSchema.parse(data);

  await connectDB();
  
  let store = await Store.findOne({ owner: session.user.id });
  
  if (!store) {
    // Determine slug (basic implementation)
    const slug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    store = new Store({
      owner: session.user.id,
      name: validatedData.name,
      slug,
      description: validatedData.description,
      phone: validatedData.phone,
      address: validatedData.address,
      timings: { open: validatedData.openTime, close: validatedData.closeTime },
      isOpen: validatedData.isOpen,
      deliverySettings: {
        radiusKm: validatedData.deliveryRadiusKm,
        fee: validatedData.deliveryFee,
        minimumOrder: validatedData.minimumOrder,
        isPickupEnabled: validatedData.isPickupEnabled,
      },
      location: { type: "Point", coordinates: [0, 0] }, // Default or get from geocoding
    });
  } else {
    store.name = validatedData.name;
    store.description = validatedData.description;
    store.phone = validatedData.phone;
    store.address = validatedData.address;
    store.timings = { open: validatedData.openTime, close: validatedData.closeTime };
    store.isOpen = validatedData.isOpen;
    store.deliverySettings = {
      radiusKm: validatedData.deliveryRadiusKm,
      fee: validatedData.deliveryFee,
      minimumOrder: validatedData.minimumOrder,
      isPickupEnabled: validatedData.isPickupEnabled,
    };
  }

  await store.save();
  revalidatePath("/store-admin");
  return { success: true };
}

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) return [];
  const categories = await Category.find({ store: store._id }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(name: string, description: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) throw new Error("Store not found");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  await Category.create({ name, slug, description, store: store._id });
  revalidatePath("/store-admin/menu");
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  await Category.findByIdAndDelete(id);
  // Optional: delete or move items in this category
  revalidatePath("/store-admin/menu");
}

// Menu Items
export async function getMenuItems() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) return [];
  const items = await MenuItem.find({ store: store._id }).populate("category").sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function createMenuItem(data: any) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) throw new Error("Store not found");

  await MenuItem.create({
    store: store._id,
    category: new Types.ObjectId(data.categoryId),
    name: data.name,
    description: data.description,
    price: data.price,
    isVeg: data.isVeg,
    isAvailable: data.isAvailable,
  });
  revalidatePath("/store-admin/menu");
}

export async function seedSampleMenu() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) throw new Error("Store not found");

  // Create Categories
  const mainCourse = await Category.create({ name: "Main Course", slug: "main-course", description: "Delicious main meals", store: store._id });
  const sweets = await Category.create({ name: "Sweets", slug: "sweets", description: "Fresh local sweets", store: store._id });

  // Create Items
  await MenuItem.insertMany([
    { store: store._id, category: mainCourse._id, name: "Chola Bhatura", description: "Spicy chickpea curry with fried bread", price: 80, isVeg: true, isAvailable: true },
    { store: store._id, category: mainCourse._id, name: "Paneer Tikka", description: "Grilled cottage cheese cubes", price: 150, isVeg: true, isAvailable: true },
    { store: store._id, category: sweets._id, name: "Gulab Jamun", description: "Deep fried sweets in sugar syrup", price: 40, isVeg: true, isAvailable: true },
    { store: store._id, category: sweets._id, name: "Rasgulla", description: "Spongy cottage cheese balls", price: 35, isVeg: true, isAvailable: true },
  ]);

  revalidatePath("/store-admin/menu");
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  await MenuItem.findByIdAndUpdate(id, { isAvailable });
  revalidatePath("/store-admin/menu");
}

export async function deleteMenuItem(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await connectDB();
  await MenuItem.findByIdAndDelete(id);
  revalidatePath("/store-admin/menu");
}
