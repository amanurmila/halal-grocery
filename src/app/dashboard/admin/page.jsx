"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaPlus, FaUpload } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Swal from "sweetalert2";

const image_hosting_key = process.env.NEXT_PUBLIC_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

export default function AddProductForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      stock: "",
      isInStock: true,
      category: "",
      brand: "",
      tags: "",
      ratings: "",
      addedBy: email,
      image: null,
    },
  });

  const selectedImage = watch("image");

  const onSubmit = async (data) => {
    if (isAdding) return; // prevent double submission
    setIsAdding(true);

    try {
      if (!data.image || data.image.length === 0) {
        Swal.fire("Error", "Please select an image", "error");
        setIsAdding(false);
        return;
      }

      const imageFile = data.image[0];
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);

      const imgRes = await fetch(image_hosting_api, {
        method: "POST",
        body: imageFormData,
      });
      const imgData = await imgRes.json();

      if (!imgData.success) {
        Swal.fire("Error", "Image upload failed", "error");
        setIsAdding(false);
        return;
      }

      const imageUrl = imgData.data.display_url;

      const productData = {
        productName: data.productName,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isInStock: data.isInStock,
        category: data.category,
        brand: data.brand,
        tags: data.tags,
        ratings: data.ratings,
        addedBy: data.addedBy,
        imageUrl: imageUrl,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        Swal.fire("Success", "Product added successfully!", "success");
        reset();
        router.refresh();
      } else {
        const errText = await res.text();
        console.error("Failed DB response:", errText);
        Swal.fire("Error", "Failed to add product.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Error adding product.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleFileClick = () => {
    const input = document.getElementById("product-image-input");
    if (input) input.click();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-5 border rounded-xl shadow"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaPlus /> Add New Product
      </h2>

      <Input
        placeholder="Product Name"
        {...register("productName", { required: true })}
      />
      {errors.productName && (
        <p className="text-red-500 text-sm">Product name is required</p>
      )}

      <Textarea
        placeholder="Description"
        {...register("description", { required: true })}
      />
      {errors.description && (
        <p className="text-red-500 text-sm">Description is required</p>
      )}

      <Input
        type="number"
        placeholder="Price"
        {...register("price", { required: true })}
      />
      {errors.price && (
        <p className="text-red-500 text-sm">Price is required</p>
      )}

      <Input
        type="number"
        placeholder="Stock"
        {...register("stock", { required: true })}
      />
      {errors.stock && (
        <p className="text-red-500 text-sm">Stock is required</p>
      )}

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register("isInStock")} defaultChecked />
        In Stock?
      </label>

      <Input
        placeholder="Category"
        {...register("category", { required: true })}
      />
      {errors.category && (
        <p className="text-red-500 text-sm">Category is required</p>
      )}

      <Input placeholder="Brand" {...register("brand")} />
      <Input placeholder="Tags (comma separated)" {...register("tags")} />
      <Input
        type="number"
        step="0.1"
        placeholder="Ratings (1-5)"
        {...register("ratings")}
      />
      <Input
        type="text"
        defaultValue={email}
        readOnly
        {...register("addedBy")}
      />

      <div>
        <Button
          type="button"
          onClick={handleFileClick}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FaUpload /> Choose Product Image
        </Button>

        {selectedImage && selectedImage.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedImage[0].name}
          </p>
        )}

        <input
          id="product-image-input"
          type="file"
          accept="image/*"
          {...register("image", { required: true })}
          className="hidden"
        />
        {errors.image && (
          <p className="text-red-500 text-sm">Product image is required</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isAdding}
      >
        {isAdding ? "Product Adding..." : "Add Product"}
      </Button>
    </form>
  );
}
