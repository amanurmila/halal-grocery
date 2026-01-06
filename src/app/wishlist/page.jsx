"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useCartWishlist } from "@/components/Cart/CartWishlistContext";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Access context to sync navbar count
  const { fetchWishlist, fetchCart } = useCartWishlist();

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/wishlist?userEmail=${session.user.email}`);
      const data = await res.json();
      const items = data.wishlist || data || [];
      setWishlist(items);

      // Sync navbar count
      fetchWishlist(session.user.email);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, [session]);

  // 🛒 Add to cart directly from wishlist
  const handleAddToCart = async (item) => {
    if (!session?.user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Please login first",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId: item.productId,
          title: item.title,
          imageUrl: item.imageUrl,
          price: item.price,
          brand: item.brand,
          category: item.category,
          description: item.description,
          stock: item.stock,
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
        // Refresh cart count on navbar
        fetchCart(session.user.email);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed to add",
          text: data.message || "Try again later",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Something went wrong" });
    }
  };

  // 🗑️ Delete from wishlist
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be removed from your wishlist.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EC5228",
      cancelButtonColor: "#3E3F5B",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item._id !== id));
        if (session?.user?.email) fetchWishlist(session.user.email);
        Swal.fire("Deleted!", "Item removed from wishlist.", "success");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto py-12 text-center text-gray-600">
        Loading wishlist...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 ">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="">You have no items in your wishlist.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md border">
          <table className="w-full border-collapse text-sm text-left">
            <thead>
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item) => (
                <tr key={item._id} className="border-t transition">
                  <td className="py-3 px-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={item.imageUrl || "/placeholder.png"}
                        alt={item.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{item.title}</td>
                  <td className="py-3 px-4 text-[#EC5228] font-semibold">
                    ${item.price}
                  </td>
                  <td className="py-3 px-4 text-right flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAddToCart(item)}
                    >
                      <FaShoppingCart className="text-orange-600" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
