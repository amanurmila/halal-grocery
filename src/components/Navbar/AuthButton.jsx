"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export default function AuthButton() {
  const { data: session } = useSession();

  // If not signed in → show login icon button
  if (!session) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => signIn("google")}
        title="Sign in"
      >
        <User className="h-5 w-5 cursor-pointer" />
      </Button>
    );
  }

  // If signed in → show profile image with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full overflow-hidden border hover:opacity-90 transition">
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt={session.user?.name || "User"}
            className="w-full h-full object-cover"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem disabled>
          <span className="text-sm font-medium truncate">
            {session.user?.name || "User"}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
