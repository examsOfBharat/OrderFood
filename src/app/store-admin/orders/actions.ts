"use server";

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Store from "@/models/Store";
import { auth } from "@/auth";
import { sendStatusUpdateEmail } from "@/lib/notifications";

export async function getStoreOrders() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  
  await connectDB();
  const store = await Store.findOne({ owner: session.user.id });
  if (!store) throw new Error("Store not found");

  const orders = await Order.find({ store: store._id })
    .populate("customer", "name email phone")
    .sort({ createdAt: -1 });

  return JSON.parse(JSON.stringify(orders));
}

export type OrderStatus = "pending_payment" | "placed" | "accepted" | "preparing" | "out_for_delivery" | "ready_for_pickup" | "delivered" | "cancelled";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.orderStatus = status;
  await order.save();

  // Send email to customer
  await sendStatusUpdateEmail(orderId, status);

  return { success: true };
}
