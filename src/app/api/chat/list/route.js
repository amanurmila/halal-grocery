import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";
import Message from "@/models/Message";

export async function GET() {
  await dbConnect();

  const chats = await Chat.find()
    .populate("user", "name email image")
    .sort({ updatedAt: -1 })
    .lean();

  for (let chat of chats) {
    chat.unreadCount = await Message.countDocuments({
      chat: chat._id,
      isRead: false,
    });
  }

  return NextResponse.json(chats);
}
