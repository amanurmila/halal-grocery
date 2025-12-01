// app/api/sslcommerz/init/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const body = await req.json();
    const { products } = body;

    if (!products || products.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Empty cart. Please add items before checkout.",
      });
    }

    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const store_id = process.env.SSL_STORE_ID;
    const store_passwd = process.env.SSL_STORE_PASS;
    const base_url =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!store_id || !store_passwd) {
      return NextResponse.json({
        success: false,
        message: "Missing SSLCommerz credentials in environment.",
      });
    }

    const tran_id = uuidv4(); // unique transaction ID

    // ✅ Parse address info for SSLCommerz
    const address = user.address || "Dhaka, Bangladesh";
    const [area, thana, district] = address.split(",").map((p) => p.trim());
    const cus_city = district || "Dhaka";

    const payload = {
      store_id,
      store_passwd,
      total_amount: totalAmount.toFixed(2),
      currency: "BDT",
      tran_id,
      success_url: `${base_url}/payment/success?tran_id=${tran_id}`,
      fail_url: `${base_url}/payment/fail`,
      cancel_url: `${base_url}/payment/cancel`,

      // ✅ Required customer info
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: address,
      cus_add2: thana || area || "Digholia",
      cus_city,
      cus_state: cus_city,
      cus_postcode: "9000",
      cus_country: "Bangladesh",
      cus_phone: user.phone?.replace(/\s/g, "") || "01700000000",
      cus_fax: "N/A",

      // ✅ Product & shipping info
      shipping_method: "NO",
      product_name: "Cart Items",
      product_category: "Ecommerce",
      product_profile: "general",
    };

    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(payload).toString(),
      }
    );

    const result = await response.json();

    if (result?.status === "SUCCESS" && result.GatewayPageURL) {
      return NextResponse.json({
        success: true,
        GatewayPageURL: result.GatewayPageURL,
        tran_id,
      });
    } else {
      console.error("SSLCommerz Init Failed:", result);
      return NextResponse.json({
        success: false,
        message: result?.failedreason || "SSLCommerz init failed.",
      });
    }
  } catch (err) {
    console.error("Payment init error:", err);
    return NextResponse.json({
      success: false,
      message: "Server error during payment initialization.",
    });
  }
}
