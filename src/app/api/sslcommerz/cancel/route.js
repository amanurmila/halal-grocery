import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
  await dbConnect();
  const data = await req.formData();
  const tran_id = data.get("tran_id");

  await Order.findOneAndUpdate(
    { transactionId: tran_id },
    { status: "Cancelled" },
    { new: true }
  );

  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancelled`
  );
}
