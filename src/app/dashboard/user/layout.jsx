// /app/dashboard/user/layout.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserClientLayout from "./UserClientLayout";

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) redirect("/");
  if (user.isBlocked) redirect("/blocked");

  return <UserClientLayout>{children}</UserClientLayout>;
}
