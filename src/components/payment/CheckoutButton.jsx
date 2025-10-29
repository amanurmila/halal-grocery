"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function CheckoutButton() {
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/check-profile");
      const data = await res.json();

      if (!data.success) {
        Swal.fire("Error", data.message || "Please log in first.", "error");
        return;
      }

      if (data.isComplete) {
        router.push("/checkout");
      } else {
        Swal.fire({
          title: "Profile incomplete",
          text: "Please add your phone number and address before continuing.",
          icon: "warning",
          confirmButtonText: "Go to Profile",
          confirmButtonColor: "#EC5228",
        }).then(() => router.push("/dashboard/user/profile"));
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className="bg-[#3E3F5B] hover:bg-[#EC5228] text-white font-semibold rounded-lg px-8 py-3 transition-all duration-300"
    >
      Proceed to Checkout
    </Button>
  );
}
