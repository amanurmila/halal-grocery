"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (tranId) {
      fetch(`/api/orders/by-transaction?tran_id=${tranId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data?.order || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [tranId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
        <p className="mt-3 text-gray-700">Verifying your payment...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <h2 className="text-2xl font-bold text-red-600">
          Invalid or Missing Transaction
        </h2>
        <Link href="/" className="mt-5">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h2 className="text-3xl font-bold text-green-700">Payment Successful!</h2>
      <p className="mt-2 text-gray-700">
        Transaction ID: <strong>{order.transactionId}</strong>
      </p>
      <p className="text-gray-700">
        Amount Paid: <strong>{order.amount} BDT</strong>
      </p>
      <p className="text-gray-500 mt-1">
        Payment Method: {order.paymentMethod}
      </p>

      <div className="flex gap-4 mt-6">
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
        <Link href="/orders">
          <Button variant="outline">View My Orders</Button>
        </Link>
      </div>
    </div>
  );
}
