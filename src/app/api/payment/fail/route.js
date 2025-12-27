import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import qs from "querystring";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await dbConnect();

    // Parse the URL-encoded body from SSLCommerz
    const rawBody = await req.text();
    const failData = qs.parse(rawBody);
    const transactionId = failData?.tran_id;

    if (!transactionId) {
      return NextResponse.json(
        { message: "Transaction ID missing" },
        { status: 400 }
      );
    }

    // Update the order status to 'failed'
    await Order.findOneAndUpdate(
      { transactionId },
      {
        status: "failed",
        paymentInfo: failData,
      }
    );

    // 🔥 REDIRECT the user to the UI Fail Page
    const BASE = process.env.NEXT_PUBLIC_BASE_URL;
    return NextResponse.redirect(
      `${BASE}/payment/fail?tran_id=${transactionId}`,
      303
    );
  } catch (error) {
    console.error("FAIL API Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
