import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, adminId } = await req.json();

    if (!userId || !adminId) {
      return NextResponse.json(
        { error: "Missing userId or adminId" },
        { status: 400 }
      );
    }

    // 🔍 Find existing chat
    let chat = await Chat.findOne({
      user: userId,
      admin: adminId,
    });

    // ➕ Create new chat if not found
    if (!chat) {
      chat = await Chat.create({
        user: userId,
        admin: adminId,
      });
    }

    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error("Chat init error:", error);

    // Handle duplicate index error safely
    if (error.code === 11000) {
      const existingChat = await Chat.findOne({
        user: error.keyValue.user,
        admin: error.keyValue.admin,
      });
      return NextResponse.json(existingChat, { status: 200 });
    }

    return NextResponse.json({ error: "Failed to init chat" }, { status: 500 });
  }
}
