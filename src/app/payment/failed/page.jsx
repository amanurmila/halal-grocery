"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <XCircle className="w-16 h-16 text-red-600 mb-4" />
      <h2 className="text-3xl font-bold text-red-700">Payment Failed</h2>
      <p className="mt-2 text-gray-700">
        Something went wrong with your payment.
      </p>
      <Link href="/" className="mt-5">
        <Button variant="outline">Go Back Home</Button>
      </Link>
    </div>
  );
}
