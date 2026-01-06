"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useCartWishlist } from "@/components/Cart/CartWishlistContext";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import CheckoutButton from "@/components/payment/CheckoutButton";

export default function CartPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchCart } = useCartWishlist();

  // 🔹 Fetch cart data from backend
  const fetchCartItems = async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?userEmail=${session.user.email}`);
      const data = await res.json();

      if (data.success) {
        setCart(data.cart);
        fetchCart(session.user.email); // sync navbar count
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [session]);

  // 🔹 Update quantity (increase/decrease)
  const updateQuantity = async (productId, type) => {
    const idToSend = productId?._id || productId;

    try {
      const res = await fetch("/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId: idToSend,
          type, // "increase" or "decrease"
        }),
      });
      const data = await res.json();

      if (data.success) {
        setCart(data.cart);
        fetchCart(session.user.email);
      } else {
        console.warn("Update failed:", data.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // 🔹 Delete cart item
  const handleDelete = async (productId) => {
    const idToSend =
      typeof productId === "object" ? productId._id || productId.id : productId;

    const confirm = await Swal.fire({
      title: "Remove item?",
      text: "This product will be removed from your cart.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EC5228",
      cancelButtonColor: "#3E3F5B",
      confirmButtonText: "Yes, remove it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: session.user.email,
          productId: idToSend,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire("Removed!", "Item deleted from your cart.", "success");
        setCart(data.cart);
        fetchCart(session.user.email);
      } else {
        Swal.fire({
          icon: "error",
          title: "Delete failed",
          text: data.message || "Item not found",
        });
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      Swal.fire("Error", "Something went wrong while deleting", "error");
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto py-12 text-center text-gray-600">
        Loading cart...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="max-w-7xl mx-auto py-12 text-center text-gray-600">
        <p>Your cart is empty.</p>
        <Link href="/shop">
          <Button className="mt-4 bg-[#EC5228] hover:bg-[#d94821] text-white">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );

  // 🔹 Calculate total price
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">My Cart</h1>

      <div className="overflow-x-auto rounded-lg shadow-md border">
        <table className="w-full border-collapse text-sm text-left">
          <thead>
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Quantity</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item._id || item.productId} className="border-t">
                <td className="py-3 px-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.imageUrl || "/placeholder.png"}
                      alt={item.productName}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </td>
                <td className="py-3 px-4 font-medium">{item.productName}</td>
                <td className="py-3 px-4 text-[#EC5228] font-semibold">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, "decrease")}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="font-semibold">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.productId, "increase")}
                    >
                      +
                    </Button>
                  </div>
                </td>
                <td className="py-3 px-4 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item.productId)}
                  >
                    <FaTrashAlt />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Total + Checkout */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
        <h2 className="text-xl font-semibold">
          Totals:{" "}
          <span className="text-[#EC5228]">${totalPrice.toFixed(2)}</span>
        </h2>
        <CheckoutButton amount={totalPrice.toFixed(2)} />
      </div>
    </div>
  );
}
