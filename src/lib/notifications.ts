import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import Store from "@/models/Store";

// Email Transporter (Configure with your Gmail/SMTP credentials in .env later)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password",
  },
});

export async function sendOrderNotifications(orderId: string) {
  try {
    await connectDB();
    const order = await Order.findById(orderId)
      .populate("customer")
      .populate({
        path: "store",
        populate: { path: "owner" }
      });

    if (!order) return;

    const customer = order.customer as any;
    const store = order.store as any;
    const owner = store.owner as any;

    const itemsList = order.items.map((i: any) => `${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`).join("\\n");
    
    const addressStr = `${order.address?.street}, ${order.address?.city}, ${order.address?.state} - ${order.address?.zipCode}`;
    
    const message = `*New Order Placed!*\\n\\nOrder ID: ${order._id}\\nStore: ${store.name}\\nTotal: ₹${order.pricing.total}\\n\\n*Delivery Address:*\\n${addressStr}\\n\\n*Items:*\\n${itemsList}\\n\\nPayment Method: ${order.paymentStatus === 'paid' ? 'Online (Razorpay)' : 'Cash on Delivery'}`;
    const htmlMessage = `<h2>New Order Placed!</h2><p><strong>Order ID:</strong> ${order._id}</p><p><strong>Store:</strong> ${store.name}</p><p><strong>Total:</strong> ₹${order.pricing.total}</p><h3>Delivery Address:</h3><p>${addressStr}</p><h3>Items:</h3><ul>${order.items.map((i: any) => `<li>${i.quantity}x ${i.name} - ₹${i.price * i.quantity}</li>`).join("")}</ul><p><strong>Payment Method:</strong> ${order.paymentStatus === 'paid' ? 'Online (Razorpay)' : 'Cash on Delivery'}</p>`;

    // --- SEND EMAILS ---
    if (customer?.email) {
      transporter.sendMail({
        from: '"LocalBites" <no-reply@localbites.com>',
        to: customer.email,
        subject: `Order Confirmation - ${order._id}`,
        html: htmlMessage,
      }).catch(err => console.error("Customer Email Error:", err));
    }

    if (owner?.email) {
      transporter.sendMail({
        from: '"LocalBites" <no-reply@localbites.com>',
        to: owner.email,
        subject: `New Order Received! - ${order._id}`,
        html: htmlMessage,
      }).catch(err => console.error("Owner Email Error:", err));
    }

    // --- SEND WHATSAPP ---
    const waToken = process.env.WHATSAPP_TOKEN;
    const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (waToken && waPhoneId) {
      const sendWhatsApp = async (phone: string, text: string) => {
        // Format phone number to include country code if missing (assuming India +91 for this example)
        let formattedPhone = phone.replace(/\\D/g, "");
        if (formattedPhone.length === 10) formattedPhone = "91" + formattedPhone;
        
        try {
          await fetch(`https://graph.facebook.com/v17.0/${waPhoneId}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${waToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: formattedPhone,
              type: "text",
              text: { body: text },
            }),
          });
        } catch (error) {
          console.error("WhatsApp API Error:", error);
        }
      };

      if (customer?.phone) await sendWhatsApp(customer.phone, `Hi ${customer.name || 'Customer'},\\n\\n${message}`);
      if (owner?.phone) await sendWhatsApp(owner.phone, `Hi ${owner.name || 'Store Owner'}, you have a new order!\\n\\n${message}`);
    } else {
      console.log("WhatsApp credentials missing in .env. Skipping WhatsApp notifications.");
    }

  } catch (error) {
    console.error("Notification Error:", error);
  }
}

export async function sendStatusUpdateEmail(orderId: string, status: string) {
  try {
    await connectDB();
    const order = await Order.findById(orderId).populate("customer");
    if (!order) return;
    const customer = order.customer as any;
    
    if (customer?.email) {
      let statusText = "";
      if (status === "cancelled") statusText = "has been cancelled by the store.";
      if (status === "out_for_delivery") statusText = "has been dispatched and is on its way to you!";
      if (status === "accepted") statusText = "has been accepted and is being prepared.";

      const htmlMessage = `<h2>Order Update</h2><p>Your order (ID: ${order._id}) ${statusText}</p>`;
      
      transporter.sendMail({
        from: '"LocalBites" <no-reply@localbites.com>',
        to: customer.email,
        subject: `Order Update - ${order._id}`,
        html: htmlMessage,
      }).catch(err => console.error("Customer Email Error:", err));
    }
  } catch (error) {
    console.error("Status Update Notification Error:", error);
  }
}

