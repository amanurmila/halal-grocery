import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  await dbConnect();

  const messages = await Message.find({
    chat: params.chatId,
  }).sort({ createdAt: 1 });

  return NextResponse.json(messages);
}
