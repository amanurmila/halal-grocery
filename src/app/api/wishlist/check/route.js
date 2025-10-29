import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");
  const productId = searchParams.get("productId");

  if (!userEmail || !productId)
    return new Response(JSON.stringify({ success: false }), { status: 400 });

  const exists = await Wishlist.findOne({ userEmail, productId });
  return new Response(JSON.stringify({ success: true, exists: !!exists }), {
    status: 200,
  });
}
