import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { productId } = await params;
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail || !productId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    const deleted = await Wishlist.findOneAndDelete({ userEmail, productId });

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, message: "Item not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
