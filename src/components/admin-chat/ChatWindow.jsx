"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import MessageItem from "./MessageItem";
import { playNotificationSound } from "@/lib/notify";

export default function ChatWindow({ chat, adminId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!chat) return;

    fetch(`/api/chat/messages/${chat._id}`)
      .then((res) => res.json())
      .then(setMessages);

    socket.connect();
    socket.emit("joinChat", chat._id);

    socket.emit("markAsRead", {
      chatId: chat._id,
      readerId: adminId,
    });

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);

      // 🔔 Play sound for messages not sent by admin
      if (msg.sender !== adminId) playNotificationSound();
    };

    socket.on("newMessage", handleNewMessage);

    socket.on("messagesRead", () => {
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead");
      socket.disconnect();
    };
  }, [chat, adminId]);

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a chat
      </div>
    );

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      chatId: chat._id,
      senderId: adminId,
      text,
    });

    setText("");
  };

  const sendFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chat._id);
    formData.append("senderId", adminId);

    const res = await fetch("/api/chat/upload", {
      method: "POST",
      body: formData,
    });

    const message = await res.json();
    socket.emit("fileMessage", message);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <MessageItem
            key={m._id}
            message={m}
            adminId={adminId}
            chatId={chat._id}
          />
        ))}
      </div>

      <div className="p-3 flex gap-2 border-t items-center">
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => sendFile(e.target.files[0])}
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-3 rounded border text-lg"
          title="Attach file"
        >
          📎
        </button>

        <input
          className="flex-1 border rounded px-3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="bg-orange-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
