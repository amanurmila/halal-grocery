"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/notify";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

export default function ChatLayout({ adminId }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    fetch("/api/chat/list")
      .then((res) => res.json())
      .then(setChats);
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("newMessage", (msg) => {
      // ❌ Ignore admin's own message
      if (msg.sender === adminId) return;

      // ❌ Ignore if chat already open
      if (activeChat?._id === msg.chat) return;

      playNotificationSound();

      toast.info("New message received", {
        description: "A user sent you a message",
      });

      // refresh chat list to update unread count
      fetch("/api/chat/list")
        .then((res) => res.json())
        .then(setChats);
    });

    return () => socket.disconnect();
  }, [activeChat]);

  return (
    <div className="flex h-[calc(100vh-80px)] border rounded-lg overflow-hidden">
      <ChatList
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      <ChatWindow chat={activeChat} adminId={adminId} />
    </div>
  );
}
