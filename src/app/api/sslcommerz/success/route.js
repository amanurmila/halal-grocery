import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const status = formData.get("status");
    const transactionId = formData.get("tran_id");
    const userEmail = formData.get("value_a");
    const amount = formData.get("amount");

    if (status !== "VALID") {
      return Response.json(
        {
          success: false,
          redirect: `/payment/failed?tran_id=${transactionId}`,
        },
        { status: 400 }
      );
    }

    // ✅ Save order
    await Order.create({
      userEmail,
      transactionId,
      amount,
      paymentStatus: "Paid",
      paymentMethod: "SSLCommerz",
      date: new Date(),
    });

    // ✅ Empty user's cart
    await Cart.findOneAndUpdate(
      { userEmail },
      { $set: { items: [] } },
      { new: true }
    );

    // ✅ Return success JSON
    return Response.json({
      success: true,
      redirect: `/payment/success?tran_id=${transactionId}`,
    });
  } catch (error) {
    console.error("SSLCommerz Success Error:", error);
    return new Response("Server error", { status: 500 });
  }
}
