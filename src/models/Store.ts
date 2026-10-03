import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IStore extends Document {
  owner: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone: string;
  timings: {
    open: string;
    close: string;
  };
  isOpen: boolean;
  status: "pending" | "approved" | "suspended";
  deliverySettings: {
    radiusKm: number;
    fee: number;
    minimumOrder: number;
    isPickupEnabled: boolean;
  };
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    logo: { type: String },
    banner: { type: String },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    phone: { type: String, required: true },
    timings: {
      open: { type: String, required: true }, // e.g., "09:00"
      close: { type: String, required: true }, // e.g., "22:00"
    },
    isOpen: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
    },
    deliverySettings: {
      radiusKm: { type: Number, default: 5 },
      fee: { type: Number, default: 0 },
      minimumOrder: { type: Number, default: 0 },
      isPickupEnabled: { type: Boolean, default: true },
    },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

storeSchema.index({ location: "2dsphere" });

const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", storeSchema);

export default Store;
