import Image from "next/image";
import clsx from "clsx";

export default function ChatList({ chats, activeChat, setActiveChat }) {
  return (
    <div className="w-80 border-r overflow-y-auto">
      {chats.map((chat) => (
        <button
          key={chat._id}
          onClick={() => setActiveChat(chat)}
          className={clsx(
            "w-full flex justify-between items-center gap-3 p-3 hover:bg-muted",
            activeChat?._id === chat._id && "bg-muted"
          )}
        >
          <div className="flex gap-3">
            <Image
              src={chat.user.image || "/avatar.png"}
              width={40}
              height={40}
              className="rounded-full"
              alt=""
            />
            <div className="text-left">
              <p className="font-medium">{chat.user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {chat.lastMessage}
              </p>
            </div>
          </div>

          {chat.unreadCount > 0 && (
            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
