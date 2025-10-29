"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaEdit, FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";

const image_hosting_key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const isAuthenticated = status === "authenticated";

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.success) {
          setProfile(data.user);
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
            image: data.user.image || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Upload image + update profile
  const handleUpdate = async () => {
    try {
      let imageUrl = formData.image;

      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append("image", imageFile);

        const imgRes = await fetch(image_hosting_api, {
          method: "POST",
          body: imgForm,
        });

        const imgData = await imgRes.json();
        if (!imgData.success) {
          Swal.fire("Error", "Image upload failed", "error");
          return;
        }
        imageUrl = imgData.data.display_url;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        Swal.fire("Success", "Profile updated successfully!", "success");
        setProfile(data.user);
        setOpen(false);
      } else {
        Swal.fire("Error", data.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (status === "loading") return <div className="p-8">Checking auth...</div>;

  if (!isAuthenticated)
    return (
      <div className="p-8 max-w-xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <h2 className="text-xl font-semibold">You are not signed in</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to see your profile.</p>
            <Button onClick={() => signIn()}>Sign in</Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => signOut()}>
            Sign out
          </Button>
          <Button onClick={() => setOpen(true)}>
            <FaEdit className="mr-2" /> Edit Profile
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <CardContent>
          {loading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt={profile.name || "avatar"}
                    width={112}
                    height={112}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <h3 className="text-xs uppercase text-gray-500">Role</h3>
                    <p className="font-medium">{profile.role}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500">Phone</h3>
                    <p className="font-medium">{profile.phone || "-"}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-xs uppercase text-gray-500">Address</h3>
                    <p className="font-medium">{profile.address || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-gray-500">Blocked</h3>
                    <p className="font-medium">
                      {profile.isBlocked ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>No profile found.</p>
          )}
        </CardContent>
      </Card>

      {/* Modal for editing profile */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Image
              </label>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => document.getElementById("imageInput").click()}
              >
                <FaUpload /> Choose Image
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {imageFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {imageFile.name}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
