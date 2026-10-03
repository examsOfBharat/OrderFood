import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IMenuItemVariant {
  name: string;
  price: number;
}

export interface IMenuItem extends Document {
  store: Types.ObjectId;
  category: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  variants: IMenuItemVariant[];
  image?: string;
  isVeg: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IMenuItemVariant>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

const menuItemSchema = new Schema<IMenuItem>(
  {
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    variants: [variantSchema],
    image: { type: String },
    isVeg: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", menuItemSchema);

export default MenuItem;
