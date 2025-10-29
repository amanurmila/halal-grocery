import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    imageUrl: { type: String, default: "/placeholder.png" },
    price: { type: Number, required: true },
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", WishlistSchema);
