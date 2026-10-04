"use server";
import connectDB from "@/lib/db";
import Store from "@/models/Store";
import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";
import { signOut } from "@/auth";

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function getActiveStores() {
  await connectDB();
  const stores = await Store.find({}).lean();
  return JSON.parse(JSON.stringify(stores));
}

export async function getStoreBySlug(slug: string) {
  await connectDB();
  const store = await Store.findOne({ slug }).lean();
  return JSON.parse(JSON.stringify(store));
}

export async function getPublicStoreMenu(storeId: string) {
  await connectDB();
  const categories = await Category.find({ store: storeId }).sort({ order: 1 }).lean();
  const items = await MenuItem.find({ store: storeId, isAvailable: true }).lean();
  
  return JSON.parse(JSON.stringify({ categories, items }));
}
