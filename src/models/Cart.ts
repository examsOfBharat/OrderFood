import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICartItem {
  menuItem: Types.ObjectId;
  variantName?: string;
  quantity: number;
  price: number; // Price at the time of adding to cart
}

export interface ICart extends Document {
  user?: Types.ObjectId;
  sessionId?: string; // For guest users
  store: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
  variantName: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    sessionId: { type: String },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
