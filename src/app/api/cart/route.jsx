import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: "Missing user email" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userEmail }).populate("items.productId");

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { userEmail, productId } = await req.json();

    if (!userEmail || !productId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Find or create cart
    let cart = await Cart.findOne({ userEmail });
    if (!cart) cart = await Cart.create({ userEmail, items: [] });

    // Check if product exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        productName: product.productName,
        imageUrl: product.imageUrl,
        price: product.price,
        category: product.category,
        quantity: 1,
      });
    }

    await cart.save();
    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
