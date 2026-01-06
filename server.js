// server.js (or index.js)
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import mongoose from "mongoose";
import Message from "./src/models/Message.js";
import Chat from "./src/models/Chat.js";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ✅ MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chat-app";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =========================
    // ✅ Join chat room
    // =========================
    socket.on("joinChat", (chatId) => {
      if (!socket.rooms.has(chatId)) {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
      }
    });

    // =========================
    // ✅ Text message
    // =========================
    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      try {
        const message = await Message.create({
          chat: chatId,
          sender: senderId,
          text,
        });
        await Chat.findByIdAndUpdate(chatId, { lastMessage: text });

        // Emit to everyone in chat room
        io.to(chatId).emit("newMessage", message);
      } catch (err) {
        console.error("sendMessage error:", err);
      }
    });

    // =========================
    // ✅ File / Image message
    // =========================
    socket.on("fileMessage", async (message) => {
      try {
        await Chat.findByIdAndUpdate(message.chat, {
          lastMessage: message.file?.name || "File sent",
        });

        io.to(message.chat).emit("newMessage", message);
      } catch (err) {
        console.error("fileMessage error:", err);
      }
    });

    // =========================
    // ✅ Delete / Unsend message
    // =========================
    socket.on("deleteMessage", async ({ messageId, chatId }) => {
      try {
        await Message.findByIdAndUpdate(messageId, { isDeleted: true });
        io.to(chatId).emit("messageDeleted", messageId);
      } catch (err) {
        console.error("deleteMessage error:", err);
      }
    });

    // =========================
    // ✅ Mark messages as read
    // =========================
    socket.on("markAsRead", async ({ chatId, readerId }) => {
      try {
        await Message.updateMany(
          { chat: chatId, sender: { $ne: readerId }, isRead: false },
          { $set: { isRead: true } }
        );
        io.to(chatId).emit("messagesRead", chatId);
      } catch (err) {
        console.error("markAsRead error:", err);
      }
    });

    // =========================
    // ✅ Leave chat (optional)
    // =========================
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  httpServer.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});
