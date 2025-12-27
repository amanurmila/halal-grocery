export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import qs from "querystring";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order"; // <-- Make sure this exists

export async function POST(req) {
  await dbConnect();

  const payment = await req.json();

  // Unique transaction ID
  const trxId = new mongoose.Types.ObjectId().toString();

  const data = {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,

    total_amount: payment.amount,
    currency: "BDT",
    tran_id: trxId,

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success?tran_id=${trxId}`,
    fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail?tran_id=${trxId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel?tran_id=${trxId}`,
    ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,

    shipping_method: "NO",
    product_name: "Cart Purchase",
    product_category: "General",
    product_profile: "general",

    cus_name: payment.name,
    cus_email: payment.email,
    cus_phone: payment.phone,
    cus_add1: payment.address,
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
  };

  const formBody = qs.stringify(data);

  const response = await fetch(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    }
  );

  const result = await response.json();

  // ---------------------------------------------
  // ✅ Save Pending Order in DB Before Redirect
  // ---------------------------------------------
  await Order.create({
    userId: payment?.userId || null,
    name: payment.name,
    email: payment.email,
    phone: payment.phone,
    address: payment.address,
    amount: payment.amount,
    products: payment.cartItems.map((item) => ({
      _id: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    })),
    transactionId: trxId,
    status: "pending",
    paymentMethod: "SSLCommerz",
  });

  // ---------------------------------------------

  if (result?.GatewayPageURL) {
    return NextResponse.json(
      { success: true, url: result.GatewayPageURL },
      { status: 200 }
    );
  }

  return NextResponse.json({ success: false, error: result }, { status: 500 });
}
