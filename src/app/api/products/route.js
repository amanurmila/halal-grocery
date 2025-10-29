import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// 🟢 Add a new product
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();

    if (
      !body.productName ||
      !body.description ||
      !body.price ||
      !body.imageUrl
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding product:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");

    if (category) {
      // Return products of a specific category
      const products = await Product.find({ category }).sort({ createdAt: -1 });
      return NextResponse.json({ products });
    }

    // Return all products if no category specified
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}
