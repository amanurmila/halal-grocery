"use client";

import { Suspense } from "react";
import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-10">Loading payment...</p>}
    >
      <PaymentSuccessClient />
    </Suspense>
  );
}
