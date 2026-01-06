// components/chat/ChatWidget.jsx
"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-orange-600 p-4 rounded-full shadow-lg"
      >
        <MessageCircle />
      </button>

      {open && <ChatBox />}
    </>
  );
}
