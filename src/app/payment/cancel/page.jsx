"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ShoppingCart, ArrowRight } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="max-w-md w-full  border border-gray-100 shadow-xl rounded-3xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className=" p-4 rounded-full">
            <XCircle className="w-16 h-16 text-orange-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        <p className=" mb-8">
          You have cancelled the payment process. No money was deducted from
          your account.
          {tranId && (
            <span className="block mt-2 font-medium ">ID: {tranId}</span>
          )}
        </p>

        <div className="space-y-4">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full bg-orange-500 py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100"
          >
            <ShoppingCart className="w-5 h-5" /> Return to Checkout
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 w-full   py-3 rounded-xl font-semibold  transition"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={<div className="text-center py-20 font-medium">Loading...</div>}
    >
      <CancelContent />
    </Suspense>
  );
}
