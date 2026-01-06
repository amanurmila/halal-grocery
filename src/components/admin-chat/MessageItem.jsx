import { Trash2 } from "lucide-react";
import { socket } from "@/lib/socket";
import clsx from "clsx";

export default function MessageItem({ message, adminId, chatId }) {
  const isAdmin = message.sender === adminId;

  const deleteMessage = () => {
    socket.emit("deleteMessage", {
      messageId: message._id,
      chatId,
    });
  };

  return (
    <div
      className={clsx(
        "max-w-xs p-2 rounded",
        isAdmin ? "ml-auto bg-orange-100 text-black" : "bg-muted"
      )}
    >
      <p className="text-sm">
        {message.isDeleted ? "Message deleted" : message.text}
      </p>

      {!message.isDeleted && isAdmin && (
        <button onClick={deleteMessage} className="text-xs text-red-500">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}
