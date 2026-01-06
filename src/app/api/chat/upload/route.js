import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function POST(req) {
  await dbConnect();

  const formData = await req.formData();

  const file = formData.get("file");
  const chatId = formData.get("chatId");
  const senderId = formData.get("senderId");

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "chat-files",
          resource_type: "auto",
        },
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      )
      .end(buffer);
  });

  const message = await Message.create({
    chat: chatId,
    sender: senderId,
    file: {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      type: uploadResult.resource_type === "image" ? "image" : "file",
      name: file.name,
    },
  });

  return NextResponse.json(message);
}
