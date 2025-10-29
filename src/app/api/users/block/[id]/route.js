import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  await dbConnect();

  try {
    const { id } = await params;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Toggle blocked status
    user.isBlocked = !user.isBlocked;
    await user.save();

    return NextResponse.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update user", error },
      { status: 500 }
    );
  }
}
