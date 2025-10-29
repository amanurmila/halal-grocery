"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { FaHeart } from "react-icons/fa";

export default function WishlistButton({ product }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWishlist = async (e) => {
    e.stopPropagation(); // Prevent card link click
    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);

    try {
      if (!saved) {
        // Add to wishlist
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: session.user.email,
            productId: product._id,
            title: product.productName,
            imageUrl: product.imageUrl,
            price: product.price,
            brand: product.brand,
            category: product.category,
            description: product.description,
            stock: product.stock,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setSaved(true);
          Swal.fire({
            icon: "success",
            title: "Added to wishlist!",
            timer: 1200,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: data.message || "Try again",
          });
        }
      } else {
        // Remove from wishlist
        const res = await fetch(
          `/api/wishlist?userEmail=${session.user.email}&productId=${product._id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();
        if (data.success) {
          setSaved(false);
          Swal.fire({
            icon: "success",
            title: "Removed from wishlist!",
            timer: 1200,
            showConfirmButton: false,
          });
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleWishlist}
      disabled={loading}
      className={`p-2 rounded-full shadow transition-colors ${
        saved
          ? "bg-[#EC5228] text-white"
          : "hover:bg-[#EC5228] hover:text-white"
      }`}
    >
      <FaHeart />
    </button>
  );
}
