import dbConnect from "@/lib/dbConnect";
import Wishlist from "@/models/Wishlist";

export async function POST(req) {
  await dbConnect();
  try {
    const data = await req.json();
    const {
      userEmail,
      productId,
      title,
      imageUrl,
      price,
      brand,
      category,
      description,
      stock,
    } = data;

    if (!userEmail || !productId) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ userEmail, productId });
    if (exists) {
      return new Response(
        JSON.stringify({ success: false, message: "Already in wishlist" }),
        { status: 400 }
      );
    }

    const wishlistItem = await Wishlist.create({
      userEmail,
      productId,
      title,
      imageUrl,
      price,
      brand,
      category,
      description,
      stock,
    });

    return new Response(JSON.stringify({ success: true, data: wishlistItem }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get("userEmail");

  if (!userEmail) {
    return new Response(
      JSON.stringify({ success: false, message: "User email is required" }),
      { status: 400 }
    );
  }

  try {
    const wishlist = await Wishlist.find({ userEmail });
    return new Response(JSON.stringify({ success: true, wishlist }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: "Missing item ID" }, { status: 400 });
  }

  await Wishlist.findByIdAndDelete(id);
  return Response.json({ message: "Item deleted successfully" });
}
