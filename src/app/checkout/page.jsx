"use client";

import { Suspense } from "react";
import CheckoutPageClient from "@/components/payment/CheckoutPageClient";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={<p className="text-center mt-10">Loading checkout...</p>}
    >
      <CheckoutPageClient />
    </Suspense>
  );
}
