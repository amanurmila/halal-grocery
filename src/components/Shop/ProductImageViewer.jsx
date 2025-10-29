"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";

export default function ProductImageViewer({ imageUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Normal image */}
      <div
        onClick={() => setIsOpen(true)}
        className="relative w-full h-[420px]"
      >
        <Image
          src={imageUrl}
          alt="Product image"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
          Click to view full screen
        </div>
      </div>

      {/* Fullscreen modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={imageUrl}
              alt="Full screen product"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
