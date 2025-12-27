import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import qs from "querystring";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await dbConnect();

    // SSLCommerz sends data as URL-encoded in the body
    const rawBody = await req.text();
    const cancelData = qs.parse(rawBody);

    // Get the ID from the body or URL query string
    const urlParams = new URL(req.url).searchParams;
    const transactionId = cancelData?.tran_id || urlParams.get("tran_id");

    if (transactionId) {
      // Update the order status to 'cancelled'
      await Order.findOneAndUpdate(
        { transactionId },
        {
          status: "cancelled",
          paymentInfo: cancelData,
        }
      );
    }

    const BASE = process.env.NEXT_PUBLIC_BASE_URL;
    // Redirect to the UI page
    const redirectUrl = transactionId
      ? `${BASE}/payment/cancel?tran_id=${transactionId}`
      : `${BASE}/payment/cancel`;

    return NextResponse.redirect(redirectUrl, 303);
  } catch (error) {
    console.error("CANCEL API Route error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      303
    );
  }
}
