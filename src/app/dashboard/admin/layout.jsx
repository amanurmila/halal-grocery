// /app/dashboard/admin/layout.jsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminClientLayout from "./AdminClientLayout";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  await dbConnect();
  const user = await User.findOne({ email: session.user.email });

  if (!user) redirect("/");
  if (user.isBlocked) redirect("/blocked");
  if (user.role !== "admin") redirect("/dashboard/user");

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
