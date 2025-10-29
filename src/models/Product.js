import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    isInStock: { type: Boolean, default: true },
    category: { type: String, required: true },
    brand: { type: String },
    tags: { type: String },
    ratings: { type: Number, default: 0 },
    addedBy: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
