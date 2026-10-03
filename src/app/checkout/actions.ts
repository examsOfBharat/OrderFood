"use server";

import connectDB from "@/lib/db";
import Order from "@/models/Order";
import MenuItem from "@/models/MenuItem";
import Store from "@/models/Store";
import User from "@/models/User";
import { auth } from "@/auth";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderNotifications } from "@/lib/notifications";

// Helper function to get Razorpay instance
function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "";
  
  if (!key_id || !key_secret) {
    throw new Error("Razorpay API keys are missing in .env file");
  }
  
  return new Razorpay({ key_id, key_secret });
}

export async function createOrder(data: {
  storeId: string;
  items: { _id: string; quantity: number }[];
  address: any;
  paymentMethod: "COD" | "ONLINE";
}) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("You must be logged in to place an order");
  }

  await connectDB();

  // Fetch store
  const store = await Store.findById(data.storeId);
  if (!store || !store.isOpen) {
    throw new Error("Store is closed or unavailable");
  }

  // Calculate pricing securely
  let subtotal = 0;
  const orderItems = [];

  for (const cartItem of data.items) {
    const menuItem = await MenuItem.findById(cartItem._id);
    if (!menuItem || !menuItem.isAvailable) {
      throw new Error(`Item ${cartItem._id} is unavailable`);
    }
    
    const price = menuItem.price;
    subtotal += price * cartItem.quantity;
    
    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      quantity: cartItem.quantity,
      price: price,
    });
  }

  const deliveryFee = store.deliverySettings?.fee || 0;
  const taxes = Math.round(subtotal * 0.05); // Assume 5% GST
  const total = subtotal + deliveryFee + taxes;

  if (subtotal < (store.deliverySettings?.minimumOrder || 0)) {
    throw new Error(`Minimum order amount is ₹${store.deliverySettings?.minimumOrder}`);
  }

  // Save address to user if it's their first time
  const user = await User.findById((session.user as any).id);
  if (user && (!user.addresses || user.addresses.length === 0)) {
    user.addresses = [data.address];
    await user.save();
  }

  // Calculate commissions (e.g. 10% platform fee)
  const commission = Math.round(subtotal * 0.10);
  const storeEarning = total - commission;

  // Create Order Record
  const newOrder = new Order({
    customer: (session.user as any).id,
    store: store._id,
    items: orderItems,
    pricing: {
      subtotal,
      deliveryFee,
      taxes,
      total,
    },
    type: "delivery", // Fixed to delivery for now
    address: data.address,
    paymentStatus: "pending",
    orderStatus: "pending_payment",
    commission,
    storeEarning,
  });

  await newOrder.save();

  if (data.paymentMethod === "COD") {
    newOrder.orderStatus = "placed";
    await newOrder.save();
    
    // Trigger notifications asynchronously
    sendOrderNotifications(newOrder._id.toString());
    
    return { success: true, orderId: newOrder._id.toString(), method: "COD" };
  }

  // If ONLINE, create Razorpay order
  try {
    const razorpay = getRazorpayInstance();
    const rzpOrder = await razorpay.orders.create({
      amount: total * 100, // Amount in paise
      currency: "INR",
      receipt: newOrder._id.toString(),
    });

    newOrder.razorpayOrderId = rzpOrder.id;
    await newOrder.save();

    return {
      success: true,
      method: "ONLINE",
      orderId: newOrder._id.toString(),
      razorpayOrderId: rzpOrder.id,
      amount: total * 100,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Send key safely for checkout
      storeName: store.name
    };
  } catch (error) {
    console.error("Razorpay Error:", error);
    throw new Error("Failed to initialize payment gateway");
  }
}

export async function verifyPayment(data: {
  orderId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}) {
  await connectDB();
  
  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  
  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(data.razorpayOrderId + "|" + data.razorpayPaymentId)
    .digest("hex");

  if (generatedSignature !== data.razorpaySignature) {
    throw new Error("Payment verification failed. Invalid signature.");
  }

  // Update order
  const order = await Order.findById(data.orderId);
  if (!order) throw new Error("Order not found");

  order.paymentStatus = "paid";
  order.orderStatus = "placed";
  order.razorpayPaymentId = data.razorpayPaymentId;
  order.razorpaySignature = data.razorpaySignature;
  
  await order.save();
  
  // Trigger notifications asynchronously
  sendOrderNotifications(data.orderId);

  return { success: true };
}

export async function getUserAddress() {
  const session = await auth();
  if (!session?.user) return null;
  await connectDB();
  const user = await User.findById((session.user as any).id);
  if (user && user.addresses && user.addresses.length > 0) {
    return JSON.parse(JSON.stringify(user.addresses[0]));
  }
  return null;
}
