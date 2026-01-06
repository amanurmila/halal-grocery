"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoryFadeSlider({ products = [] }) {
  const [index, setIndex] = useState(0);

  // Auto slide logic
  useEffect(() => {
    if (!products.length) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;

  const nextSlide = () => setIndex((prev) => (prev + 1) % products.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + products.length) % products.length);

  return (
    <section className="relative w-full h-[450px] md:h-[550px] overflow-hidden rounded-3xl bg-gray-900">
      {products.map((product, i) => {
        const isActive = i === index;

        return (
          <div
            key={product._id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image with slight zoom effect when active */}
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms] ease-out ${
                isActive ? "scale-110" : "scale-100"
              }`}
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            />

            {/* THE GRADIENT: Deep black on left, fading to invisible on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

            {/* Optional subtle bottom gradient for better button contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

            {/* Content Container */}
            <div className="relative z-20 h-full flex items-center px-8 md:px-20">
              <div
                className={`max-w-xl space-y-5 text-white transition-all duration-700 delay-300 ${
                  isActive
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-10 opacity-0"
                }`}
              >
                {/* Category Badge */}
                <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] bg-[#EC5228] px-4 py-1.5 rounded-full shadow-lg">
                  {product.category}
                </span>

                {/* Product Title */}
                <h2 className="text-4xl md:text-6xl font-black leading-[1.1] drop-shadow-2xl">
                  {product.productName}
                </h2>

                {/* Brand & Price Info */}
                <div className="space-y-1">
                  {product.brand && (
                    <p className="text-sm md:text-base text-gray-200 font-medium">
                      Brand: <span className="text-white">{product.brand}</span>
                    </p>
                  )}
                  <p className="text-3xl md:text-4xl font-black text-[#EC5228] drop-shadow-md">
                    ৳ {product.price.toLocaleString()}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-[#EC5228] hover:bg-[#d9481f] px-8 py-6 text-lg font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl"
                  >
                    <Link href={`/shop/${product._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <div className="absolute inset-0 z-30 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={prevSlide}
          className="pointer-events-auto bg-black/20 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="pointer-events-auto bg-black/20 hover:bg-black/60 text-white p-3 rounded-full transition-all backdrop-blur-sm group"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index
                ? "w-10 h-2 bg-[#EC5228]"
                : "w-2 h-2 bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
