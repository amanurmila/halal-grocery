"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/notify";

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID;

export default function ChatBox() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chatId, setChatId] = useState(null);

  const socketConnectedRef = useRef(false);
  const chatInitRef = useRef(false);

  /* ==============================
     1️⃣ INIT CHAT
  =============================== */
  useEffect(() => {
    if (status !== "authenticated") return;
    if (!session?.user?.id) return;
    if (!ADMIN_ID) return;
    if (chatInitRef.current) return;

    chatInitRef.current = true;

    const initChat = async () => {
      try {
        const res = await fetch("/api/chat/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            adminId: ADMIN_ID,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Chat init failed");

        setChatId(data._id);
      } catch (err) {
        console.error(err);
        toast.error("Failed to start chat");
      }
    };

    initChat();
  }, [status, session]);

  /* ==============================
     2️⃣ LOAD MESSAGES
  =============================== */
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages/${chatId}`);
        const data = await res.json();
        setMessages(data);
      } catch {
        toast.error("Failed to load messages");
      }
    };

    loadMessages();
  }, [chatId]);

  /* ==============================
     3️⃣ SOCKET SETUP
  =============================== */
  useEffect(() => {
    if (!chatId || !session?.user?.id) return;

    if (!socketConnectedRef.current) {
      socket.connect();
      socketConnectedRef.current = true;
    }

    socket.emit("joinChat", chatId);

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);

      // ✅ Play notification for **all incoming messages from others**
      if (msg.sender !== session.user.id) {
        playNotificationSound();
        toast("New message received");
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("newMessage", handleNewMessage);
    };
  }, [chatId, session?.user?.id]);

  /* ==============================
     4️⃣ SEND MESSAGE
  =============================== */
  const sendMessage = () => {
    if (!text.trim() || !chatId) return;

    socket.emit("sendMessage", {
      chatId,
      senderId: session.user.id,
      text,
    });

    setText("");
  };

  if (status !== "authenticated") return null;

  return (
    <div className="fixed bottom-20 right-6 w-80 bg-white border shadow-xl rounded-lg flex flex-col z-50">
      <div className="p-3 bg-orange-600 text-white rounded-t-lg font-bold">
        Chat with Support
      </div>

      <div className="h-64 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`p-2 rounded-lg max-w-[80%] text-sm ${
              m.sender === session.user.id
                ? "bg-orange-100 text-black self-end"
                : "bg-gray-100 text-black self-start"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex p-2 gap-2 border-t">
        <input
          className="border flex-1 px-2 py-1 text-black rounded text-sm"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-orange-600 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
