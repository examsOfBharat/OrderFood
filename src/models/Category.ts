import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  store: Types.ObjectId;
  description?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    description: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

categorySchema.index({ store: 1, slug: 1 }, { unique: true });

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;
