import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userEmail, productId } = await req.json();

    if (!userEmail || !productId) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await Cart.findOne({ userEmail });
    if (!cart)
      return NextResponse.json({ success: false, message: "Cart not found" });

    // 🧠 Normalize productId to string for safe comparison
    const productIdStr = productId.toString();

    const existingCount = cart.items.length;
    cart.items = cart.items.filter((i) => {
      const id = i.productId?._id?.toString() || i.productId.toString();
      return id !== productIdStr;
    });

    if (cart.items.length === existingCount) {
      return NextResponse.json({
        success: false,
        message: "Item not found in cart",
      });
    }

    await cart.save();

    // Re-populate to return updated cart with product details
    const updatedCart = await Cart.findOne({ userEmail })
      .populate("items.productId")
      .lean();

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to delete item",
    });
  }
}
