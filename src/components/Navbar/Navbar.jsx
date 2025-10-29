"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";
import AuthButton from "./AuthButton";
import { useSession } from "next-auth/react";
import { FaHeart } from "react-icons/fa";
import { useCartWishlist } from "../Cart/CartWishlistContext";
import { useEffect } from "react";
import { toast } from "sonner"; // 🧡 Using ShadCN's Toaster (fancy message popup)

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { cartLength, wishlistLength } = useCartWishlist();

  const dashboardLink =
    session?.user?.role === "admin"
      ? "/dashboard/admin"
      : session?.user
      ? "/dashboard/user"
      : null;

  // 🔔 Show "Please LogIn" toast if not logged in
  useEffect(() => {
    if (!session?.user) {
      toast.info("🔐 Please Log In to access your account", {
        position: "top-center",
        duration: 3000,
        style: {
          background: "#3E3F5B",
          color: "white",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
    }
  }, [session]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-2">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Halal Grocery
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
          {dashboardLink && (
            <Link
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              href={dashboardLink}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3 relative">
          {/* 🛒 Cart */}
          <div className="relative group">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </Button>
            {cartLength > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EC5228] text-white text-xs font-bold rounded-full px-1.5 py-[1px] shadow-md">
                {cartLength}
              </span>
            )}
            {/* Tooltip */}
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
              Cart
            </span>
          </div>

          {/* ❤️ Wishlist */}
          <div className="relative group">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <FaHeart className="h-5 w-5" />
              </Link>
            </Button>
            {wishlistLength > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EC5228] text-white text-xs font-bold rounded-full px-1.5 py-[1px] shadow-md">
                {wishlistLength}
              </span>
            )}
            {/* Tooltip */}
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
              Wishlist
            </span>
          </div>

          {/* 👤 Auth Button with Tooltip */}
          <div className="relative group">
            <AuthButton />
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              {session?.user ? "Profile" : "Login"}
            </span>
          </div>

          {/* 🌙 Mode Toggle */}
          <div className="relative group">
            <ModeToggle />
            <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              Theme
            </span>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col gap-6 mt-10 ml-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}

                {dashboardLink && <Link href={dashboardLink}>Dashboard</Link>}

                <div className="flex items-center gap-4 mt-6">
                  {/* Cart */}
                  <div className="relative">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/cart">
                        <ShoppingCart className="h-5 w-5" />
                      </Link>
                    </Button>
                    {cartLength > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#EC5228] text-white text-xs font-bold rounded-full px-1.5 py-[1px] shadow-md">
                        {cartLength}
                      </span>
                    )}
                  </div>

                  {/* Wishlist */}
                  <div className="relative">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="/wishlist">
                        <FaHeart className="h-5 w-5" />
                      </Link>
                    </Button>
                    {wishlistLength > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#EC5228] text-white text-xs font-bold rounded-full px-1.5 py-[1px] shadow-md">
                        {wishlistLength}
                      </span>
                    )}
                  </div>

                  <AuthButton />
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
