"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCartWishlist } from "@/components/Cart/CartWishlistContext";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCartWishlist();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const tranId = searchParams.get("tran_id");

  useEffect(() => {
    if (!tranId) {
      setLoading(false);
      return;
    }

    const verifyAndFetchOrder = async () => {
      try {
        // We call our GET API to get the order details
        const res = await fetch(`/api/payment/success?tran_id=${tranId}`);
        const data = await res.json();

        if (data.success) {
          setOrder(data.order);
          clearCart(); // Clear cart only on successful verification
        }
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyAndFetchOrder();
  }, [tranId, clearCart]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl">Verifying Payment...</div>
    );

  if (!order)
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl text-red-500">Payment Verification Failed</h1>
        <Link href="/" className="text-blue-500 underline">
          Back to Home
        </Link>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 border shadow-lg rounded-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600">
          🎉 Payment Successful!
        </h1>
        <p className="text-gray-500 mt-2">
          Transaction ID: {order.transactionId}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-bottom pb-2">
          Order Summary
        </h2>
        {order.products.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                {p.quantity} x ৳{p.price}
              </p>
            </div>
            <p className="font-bold text-gray-700">৳{p.subtotal}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t flex justify-between items-center text-xl font-bold">
        <span>Total Paid:</span>
        <span className="text-green-600">৳{order.amount}</span>
      </div>

      <Link
        href="/shop"
        className="block mt-8 bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// Next.js requires Suspense for useSearchParams()
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
