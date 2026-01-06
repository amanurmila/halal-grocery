import { getServerSession } from "next-auth";
import ChatLayout from "@/components/admin-chat/ChatLayout";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminChatPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  return <ChatLayout adminId={session.user.id} />;
}
