// /app/dashboard/admin/AdminClientLayout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, BarChart2, Settings, Upload, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
  { name: "Add Product", href: "/dashboard/admin", icon: Upload },
  {
    name: "Manage Product",
    href: "/dashboard/admin/manage-product",
    icon: Grid,
  },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart2 },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export default function AdminClientLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Admin Routes</h2>
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
