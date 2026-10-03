import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IReview extends Document {
  store: Types.ObjectId;
  customer: Types.ObjectId;
  order: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", reviewSchema);

export default Review;
