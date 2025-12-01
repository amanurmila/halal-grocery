// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    address: String,
    amount: Number,
    transactionId: String,
    status: { type: String, default: "Pending" },
    products: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
