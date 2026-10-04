"use server";

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { auth } from "@/auth";

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];
  
  await connectDB();
  const orders = await Order.find({ customer: session.user.id })
    .populate("store", "name slug")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(orders));
}

export async function getOrderById(orderId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  await connectDB();
  const order = await Order.findById(orderId).populate("store", "name slug address phone");
  
  if (!order) return null;
  
  // Ensure the user owns this order
  if (order.customer.toString() !== session.user.id) return null;

  return JSON.parse(JSON.stringify(order));
}
