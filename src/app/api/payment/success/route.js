import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import qs from "querystring";

export const dynamic = "force-dynamic";

// This handles the POST request from SSLCommerz
export async function POST(req) {
  try {
    await dbConnect();

    const rawBody = await req.text();
    const paymentSuccess = qs.parse(rawBody);
    const transactionId = paymentSuccess?.tran_id;

    if (!transactionId) {
      return NextResponse.json(
        { message: "Transaction ID missing" },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await Order.findOneAndUpdate(
      { transactionId },
      {
        status: "paid",
        paymentInfo: paymentSuccess,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Redirect to the actual UI Page (Not the API path)
    const BASE = process.env.NEXT_PUBLIC_BASE_URL;
    return NextResponse.redirect(
      `${BASE}/payment/success?tran_id=${transactionId}`,
      303
    );
  } catch (error) {
    console.error("Success route error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// This handles the GET request from your Success Page UI
export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const tran_id = searchParams.get("tran_id");

    const order = await Order.findOne({ transactionId: tran_id });
    if (!order) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
