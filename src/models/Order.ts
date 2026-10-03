import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IOrderItem {
  menuItem: Types.ObjectId;
  name: string; // Snapshot of name
  variantName?: string;
  quantity: number;
  price: number; // Snapshot of price
}

export interface IOrder extends Document {
  customer: Types.ObjectId;
  store: Types.ObjectId;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    taxes: number;
    total: number;
  };
  type: "delivery" | "pickup";
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending_payment" | "placed" | "accepted" | "preparing" | "out_for_delivery" | "ready_for_pickup" | "delivered" | "cancelled";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  commission: number; // Platform commission amount
  storeEarning: number; // Amount the store earns
  orderNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
  name: { type: String, required: true },
  variantName: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, required: true },
      taxes: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    type: { type: String, enum: ["delivery", "pickup"], required: true },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending_payment", "placed", "accepted", "preparing", "out_for_delivery", "ready_for_pickup", "delivered", "cancelled"],
      default: "pending_payment",
      index: true,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    commission: { type: Number, required: true },
    storeEarning: { type: Number, required: true },
    orderNotes: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
