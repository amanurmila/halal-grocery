"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useCartWishlist } from "@/components/Cart/CartWishlistContext";

export default function ProductActions({ product, variant = "card" }) {
  const { data: session } = useSession();
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // 🔥 Access global context to update cart and wishlist counts
  const { fetchCart, fetchWishlist } = useCartWishlist();

  useEffect(() => {
    async function fetchWishlistStatus() {
      if (!session?.user?.email) return setLoadingSaved(false);
      try {
        const res = await fetch(
          `/api/wishlist/check?userEmail=${session.user.email}&productId=${product._id}`
        );
        const data = await res.json();
        if (data.success && data.exists) setSaved(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSaved(false);
      }
    }
    fetchWishlistStatus();
  }, [session, product]);

  // 🛒 Add to Cart Handler
  const handleAddToCart = async (e) => {
    e?.stopPropagation();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (session?.user?.isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Your account is blocked by admin.",
        text: "You can’t add this item to your cart right now.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (!product.isInStock) {
      Swal.fire({
        icon: "error",
        title: "Product is out of stock",
        text: "You can’t add this item to your cart right now.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId: product._id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          timer: 1000,
          showConfirmButton: false,
        });
        fetchCart(session.user.email);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add",
          text: data.message || "Try again later",
        });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Something went wrong" });
    } finally {
      setAdding(false);
    }
  };

  // ❤️ Wishlist Handler
  const handleSave = async (e) => {
    e?.stopPropagation();

    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (session?.user?.isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Your account is blocked by admin.",
        text: "You can’t add this item to your wishlist right now.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (!product.isInStock) {
      Swal.fire({
        icon: "error",
        title: "Product is out of stock",
        text: "You can’t add this item to your wishlist right now.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      let res;
      if (!saved) {
        res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: session.user.email,
            productId: product._id,
            title: product.productName,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
          }),
        });
      } else {
        res = await fetch(
          `/api/wishlist/${product._id}?userEmail=${session.user.email}`,
          { method: "DELETE" }
        );
      }

      const data = await res.json();
      if (!data.success)
        throw new Error(data.message || "Failed to update wishlist");

      setSaved((prev) => !prev);
      fetchWishlist(session.user.email);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: err.message || "Failed to update wishlist",
      });
    }
  };

  const containerClass =
    variant === "card"
      ? "absolute top-2 right-2 flex flex-col items-center gap-2 z-20"
      : "flex items-center gap-4 mt-4";

  return (
    <div className={containerClass}>
      {/* 🛒 Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="bg-white text-gray-700 shadow p-1 md:p-3 rounded-full hover:bg-[#EC5228] hover:text-white transition-colors"
      >
        {adding ? "..." : <FaShoppingCart className="text-[16px] md:text-xl" />}
      </button>

      {/* ❤️ Wishlist */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loadingSaved}
        className={`p-1 md:p-3 rounded-full shadow transition-colors ${
          saved
            ? "bg-[#EC5228] text-white"
            : "bg-white text-gray-700 hover:bg-[#EC5228] hover:text-white"
        }`}
      >
        <FaHeart className="text-[16px] md:text-xl " />
      </button>
    </div>
  );
}
