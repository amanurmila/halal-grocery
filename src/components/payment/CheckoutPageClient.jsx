"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { useCartWishlist } from "@/components/Cart/CartWishlistContext";

export default function CheckoutPageClient() {
  const { data: session, status } = useSession();
  const { cartItems, clearCart } = useCartWishlist(); // ✅ assuming you have this
  const searchParams = useSearchParams();
  const amountFromQuery = searchParams?.get("amount");

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    amount: amountFromQuery ? parseFloat(amountFromQuery) : 0,
  });

  useEffect(() => {
    if (status !== "authenticated") return;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me");
        const data = await res.json();
        if (data.success && data.user) {
          setForm((prev) => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            amount:
              amountFromQuery ||
              cartItems.reduce((acc, p) => acc + p.price * p.quantity, 0),
          }));
        }
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };
    fetchUser();
  }, [status, amountFromQuery, cartItems]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address) {
      Swal.fire(
        "Missing Info",
        "Please fill in all required fields.",
        "warning"
      );
      return;
    }
    if (!cartItems?.length) {
      Swal.fire(
        "Empty Cart",
        "Please add items to cart before checkout.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sslcommerz/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          products: cartItems.map((item) => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (data?.GatewayPageURL) {
        window.location.href = data.GatewayPageURL;
      } else {
        Swal.fire("Error", "Failed to initialize payment session.", "error");
      }
    } catch (err) {
      console.error("Payment init error:", err);
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading")
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4 shadow-lg rounded-2xl mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-[#3E3F5B] mb-4">
        Checkout
      </h2>

      <div className="space-y-3">
        <Input name="name" value={form.name} placeholder="Full Name" disabled />
        <Input name="email" value={form.email} placeholder="Email" disabled />
        <Input
          name="phone"
          value={form.phone}
          placeholder="Phone"
          onChange={handleChange}
        />
        <Input
          name="address"
          value={form.address}
          placeholder="Address"
          onChange={handleChange}
        />
        <Input
          name="amount"
          type="number"
          value={form.amount}
          placeholder="Amount (BDT)"
          disabled
        />
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#EC5228] font-semibold text-lg py-3 rounded-xl transition-all duration-300"
      >
        {loading ? "Redirecting..." : `Pay ৳${form.amount}`}
      </Button>
    </div>
  );
}
