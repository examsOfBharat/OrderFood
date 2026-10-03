import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface INotificationLog extends Document {
  user?: Types.ObjectId;
  order?: Types.ObjectId;
  type: "whatsapp" | "email" | "sms";
  recipient: string; // Phone number or email
  messageTemplate: string;
  status: "pending" | "sent" | "failed";
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationLogSchema = new Schema<INotificationLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    type: { type: String, enum: ["whatsapp", "email", "sms"], required: true },
    recipient: { type: String, required: true },
    messageTemplate: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    error: { type: String },
  },
  { timestamps: true }
);

const NotificationLog: Model<INotificationLog> =
  mongoose.models.NotificationLog ||
  mongoose.model<INotificationLog>("NotificationLog", notificationLogSchema);

export default NotificationLog;
