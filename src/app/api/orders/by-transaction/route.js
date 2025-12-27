import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Use Next.js built-in URL parser (no Invalid URL error)
    const tranId = req.nextUrl.searchParams.get("tran_id");

    if (!tranId) {
      return Response.json(
        { order: null, message: "Missing transaction ID" },
        { status: 400 }
      );
    }

    // Find order by trans ID
    const order = await Order.findOne({ transactionId: tranId });

    return Response.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Payment lookup error:", error);
    return Response.json(
      { order: null, message: "Server error" },
      { status: 500 }
    );
  }
}
