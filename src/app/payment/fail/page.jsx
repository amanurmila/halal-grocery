"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCcw, Home } from "lucide-react"; // Using lucide-react for icons

function FailPageContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full  p-8 rounded-2xl border shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <div className=" p-3 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold  mb-2">Payment Failed</h1>
        <p className=" mb-6">
          We couldn't process your payment for Transaction ID: <br />
          <span className="font-mono font-medium ">{tranId || "N/A"}</span>
        </p>

        <div className="space-y-3">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full  py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full   py-3 rounded-lg font-semibold transition"
          >
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <p className="mt-6 text-sm ">
          If your money was deducted, it will be refunded within 7-10 business
          days.
        </p>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <FailPageContent />
    </Suspense>
  );
}
