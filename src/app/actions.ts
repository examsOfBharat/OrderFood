"use server";

import connectDB from "@/lib/db";
import Store from "@/models/Store";

export async function getActiveStores() {
  await connectDB();
  const stores = await Store.find({ isOpen: true }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(stores));
}

export async function getStoreBySlug(slug: string) {
  await connectDB();
  const store = await Store.findOne({ slug });
  return store ? JSON.parse(JSON.stringify(store)) : null;
}

import Category from "@/models/Category";
import MenuItem from "@/models/MenuItem";

export async function getPublicStoreMenu(storeId: string) {
  await connectDB();
  const categories = await Category.find({ store: storeId }).sort({ createdAt: 1 });
  const items = await MenuItem.find({ store: storeId, isAvailable: true });
  
  return {
    categories: JSON.parse(JSON.stringify(categories)),
    items: JSON.parse(JSON.stringify(items)),
  };
}
