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
  // Show all stores except suspended ones
  // (stores default to "pending" status until admin approves, we still show them)
  const stores = await Store.find({ status: { $ne: "suspended" } }).lean();

  // For each store, fetch category names + menu item names for richer search
  const enriched = await Promise.all(
    stores.map(async (store: any) => {
      const categories = await Category.find({ store: store._id })
        .select("name")
        .lean();
      const menuItems = await MenuItem.find({ store: store._id, isAvailable: true })
        .select("name")
        .limit(30)
        .lean();
      return {
        ...store,
        cuisines: categories.map((c: any) => c.name),
        menuPreview: menuItems.map((m: any) => m.name),
      };
    })
  );

  return JSON.parse(JSON.stringify(enriched));
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
