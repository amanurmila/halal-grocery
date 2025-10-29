import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await dbConnect();
    const { userEmail, productId, type } = await req.json();

    if (!userEmail || !productId || !type) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await Cart.findOne({ userEmail });
    if (!cart) {
      return NextResponse.json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId.toString()
    );

    if (!item) {
      return NextResponse.json({ success: false, message: "Item not found" });
    }

    if (type === "increase") {
      item.quantity += 1;
    } else if (type === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    await cart.save();

    // Populate product details again (if needed)
    const updatedCart = await Cart.findOne({ userEmail })
      .populate("items.productId")
      .lean();

    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
