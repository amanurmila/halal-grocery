// app/api/check-profile/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json(
      { success: false, message: "User not authenticated" },
      { status: 401 }
    );
  }

  // find user by email
  const user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  // Check if user has phone and address
  const isComplete = user.phone && user.address;

  return Response.json({
    success: true,
    isComplete: !!isComplete,
  });
}
