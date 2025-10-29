import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const session = await getServerSession();

  // if no session, redirect to homepage
  if (!session) {
    redirect("/");
  }

  return <div>Welcome, {session.user?.name || "User"}!</div>;
}
