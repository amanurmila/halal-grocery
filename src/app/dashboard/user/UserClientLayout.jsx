// /app/dashboard/user/UserClientLayout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, Grid, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const routes = [
  { name: "Your Products", href: "/dashboard/user", icon: Grid },
  { name: "Manage Cart", href: "/cart", icon: Link2 },
  { name: "My Profile", href: "/dashboard/user/my-profile", icon: Users },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function UserClientLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = session?.user?.name;
  const firstName = name ? name.split(" ")[0] : "User";

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">
            Welcome{" "}
            <span className="font-extrabold text-orange-700">{firstName}!</span>
          </h2>
          <ul className="space-y-2">
            {routes.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center space-x-2 p-3 rounded-xl transition-all",
                    pathname === href
                      ? "bg-orange-200 text-orange-700 font-semibold"
                      : "hover:bg-gray-500"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 rounded-2xl shadow-md p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
