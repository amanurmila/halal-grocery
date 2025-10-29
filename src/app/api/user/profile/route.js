import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const user = await User.findOne({ email: session.user.email }).lean();
  return new Response(JSON.stringify({ success: true, user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(
      JSON.stringify({ success: false, message: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { phone, address } = await req.json();

  if (!phone || !address) {
    return new Response(
      JSON.stringify({ success: false, message: "Phone & Address required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: { phone, address } },
    { new: true }
  );

  if (!updatedUser) {
    return new Response(
      JSON.stringify({ success: false, message: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ success: true, user: updatedUser }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
