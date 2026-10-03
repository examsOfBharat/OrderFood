import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPlatformSettings extends Document {
  commissionPercentage: number;
  isCodEnabled: boolean;
  taxPercentage: number;
  whatsappTemplates: {
    orderConfirmation: string;
    orderAccepted: string;
    outForDelivery: string;
    delivered: string;
    cancelled: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const platformSettingsSchema = new Schema<IPlatformSettings>(
  {
    commissionPercentage: { type: Number, default: 10 },
    isCodEnabled: { type: Boolean, default: false },
    taxPercentage: { type: Number, default: 5 },
    whatsappTemplates: {
      orderConfirmation: { type: String, default: "order_confirmation" },
      orderAccepted: { type: String, default: "order_accepted" },
      outForDelivery: { type: String, default: "out_for_delivery" },
      delivered: { type: String, default: "order_delivered" },
      cancelled: { type: String, default: "order_cancelled" },
    },
  },
  { timestamps: true }
);

const PlatformSettings: Model<IPlatformSettings> =
  mongoose.models.PlatformSettings ||
  mongoose.model<IPlatformSettings>("PlatformSettings", platformSettingsSchema);

export default PlatformSettings;
