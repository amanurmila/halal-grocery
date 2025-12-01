import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/Cart";

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userEmail } = await req.json();

    if (!userEmail) {
      return Response.json({ success: false, message: "User email required" });
    }

    await Cart.findOneAndUpdate({ userEmail }, { $set: { items: [] } });

    return Response.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    return Response.json({ success: false, message: "Server error" });
  }
}
