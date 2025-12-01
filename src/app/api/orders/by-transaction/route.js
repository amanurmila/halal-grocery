import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const tranId = searchParams.get("tran_id");

  if (!tranId) {
    return Response.json({ order: null }, { status: 400 });
  }

  const order = await Order.findOne({ transactionId: tranId });

  return Response.json({ order });
}
