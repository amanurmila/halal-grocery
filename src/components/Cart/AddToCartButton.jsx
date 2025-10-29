"use client";

import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AddToCartButton({ productId }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();

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
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Added to Cart!",
          timer: 1200,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add",
          text: data.message || "Try again later",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="p-2 rounded-full shadow hover:bg-[#EC5228] hover:text-white transition-colors"
    >
      {loading ? "..." : <FaShoppingCart />}
    </button>
  );
}
