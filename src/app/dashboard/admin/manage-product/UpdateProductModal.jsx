"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaUpload } from "react-icons/fa";
import { useState } from "react";
import Swal from "sweetalert2";

const image_hosting_key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function UpdateProductModal({ product, onClose, onUpdated }) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isInStock: product.isInStock,
      category: product.category,
      brand: product.brand,
      tags: product.tags,
      ratings: product.ratings,
      addedBy: product.addedBy,
      imageUrl: product.imageUrl,
    },
  });

  const selectedImage = watch("image");
  const [isUpdating, setIsUpdating] = useState(false);

  const onSubmit = async (data) => {
    setIsUpdating(true);

    try {
      let imageUrl = product.imageUrl;

      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(image_hosting_api, {
          method: "POST",
          body: formData,
        });
        const imgData = await res.json();

        if (!imgData.success) {
          Swal.fire("Error", "Image upload failed", "error");
          setIsUpdating(false);
          return;
        }
        imageUrl = imgData.data.display_url;
      }

      const updateData = { ...data, imageUrl };

      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        Swal.fire("Updated!", "Product updated successfully!", "success");
        onUpdated();
        onClose();
      } else {
        Swal.fire("Error", "Failed to update product", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileClick = () => {
    const input = document.getElementById("update-product-image");
    if (input) input.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Update Product
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Product Name" {...register("productName")} />
          <Textarea
            placeholder="Description"
            {...register("description")}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Price" {...register("price")} />
            <Input type="number" placeholder="Stock" {...register("stock")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Category" {...register("category")} />
            <Input placeholder="Brand" {...register("brand")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Tags" {...register("tags")} />
            <Input
              type="number"
              step="0.1"
              placeholder="Ratings (1–5)"
              {...register("ratings")}
            />
          </div>

          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              {...register("isInStock")}
              defaultChecked={product.isInStock}
            />
            In Stock
          </label>

          <div className="mt-3">
            <Button
              type="button"
              onClick={handleFileClick}
              variant="outline"
              className="flex items-center gap-2 w-full justify-center"
            >
              <FaUpload /> Choose New Image
            </Button>

            {selectedImage && selectedImage.length > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                Selected: {selectedImage[0].name}
              </p>
            )}

            <input
              id="update-product-image"
              type="file"
              accept="image/*"
              {...register("image")}
              className="hidden"
            />
          </div>

          <div className="flex justify-center mt-3">
            <img
              src={product.imageUrl}
              alt={product.productName}
              className="w-24 h-24 object-cover rounded-lg shadow-md border border-gray-300 dark:border-gray-700"
            />
          </div>

          <Button type="submit" className="w-full mt-5" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Product"}
          </Button>
        </form>
      </div>
    </div>
  );
}
