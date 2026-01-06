// models/Chat.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Prevent duplicate user-admin chat
ChatSchema.index({ user: 1, admin: 1 }, { unique: true });

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
