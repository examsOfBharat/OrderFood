import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { sendOrderNotifications } from "@/lib/notifications";

// Razorpay sends webhook events to this endpoint
// Set this URL in your Razorpay Dashboard → Webhooks
// URL: https://yourdomain.com/api/razorpay-webhook

export async function POST(req: NextRequest) {
  try {
    const body = await req.text(); // raw body needed for signature verification
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify the webhook signature from Razorpay
    const razorpaySignature = req.headers.get("x-razorpay-signature");
    if (!razorpaySignature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Razorpay Webhook Event:", event.event);

    await connectDB();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;

      // Find the order by Razorpay order ID
      const order = await Order.findOne({ razorpayOrderId });

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "placed";
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        // Send notifications
        sendOrderNotifications(order._id.toString());

        console.log(`✅ Webhook: Order ${order._id} marked as paid via webhook`);
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.paymentStatus === "pending") {
        order.paymentStatus = "failed";
        order.orderStatus = "cancelled";
        await order.save();
        console.log(`❌ Webhook: Order ${order._id} marked as failed via webhook`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
