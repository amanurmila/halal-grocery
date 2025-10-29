import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || "Ator";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "8");
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({ category });
  const products = await Product.find({ category })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return Response.json({ success: true, total, products });
}
