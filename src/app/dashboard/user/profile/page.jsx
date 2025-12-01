"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ phone: "", address: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        if (!data.success) return;

        // If user already has phone & address, redirect to checkout
        if (data.user.phone && data.user.address) {
          router.push("/checkout");
          return;
        }

        setFormData({
          phone: data.user.phone || "",
          address: data.user.address || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        Swal.fire("Updated", "Profile updated successfully!", "success").then(
          () => router.push("/cart")
        );
      } else {
        Swal.fire("Error", data.message || "Update failed.", "error");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-semibold text-center">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Enter your phone number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded-md p-2"
            placeholder="Enter your full home address for shipping"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </div>
  );
}
