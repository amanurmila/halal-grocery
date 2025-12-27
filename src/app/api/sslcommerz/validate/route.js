// app/api/sslcommerz/validate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const paymentData = await req.json();
    console.log("Callback Received:", paymentData);

    const transactionId = paymentData?.tran_id || paymentData?.tranId;

    if (!transactionId) {
      console.error("❌ Missing transactionId");

      return NextResponse.redirect(
        new URL(
          "/payment/failed?reason=no_tran_id",
          process.env.NEXT_PUBLIC_BASE_URL
        )
      );
    }

    // Ensure BASE_URL exists & is valid
    let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseURL || !baseURL.startsWith("http")) {
      console.warn(
        "⚠ Invalid BASE_URL detected, falling back to absolute path"
      );
      baseURL = "https://your-domain.com"; // fallback for safety
    }

    const redirectURL = new URL(
      `/payment/success?tran_id=${transactionId}`,
      baseURL
    );

    console.log("✅ Redirecting to:", redirectURL.toString());

    return NextResponse.redirect(redirectURL);
  } catch (error) {
    console.error("❌ Payment Validation Error:", error);

    let baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseURL || !baseURL.startsWith("http")) {
      baseURL = "https://your-domain.com";
    }

    return NextResponse.redirect(
      new URL("/payment/failed?reason=server_error", baseURL)
    );
  }
}
