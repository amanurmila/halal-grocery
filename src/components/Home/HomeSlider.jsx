"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data to make it look "Fancy" with text
const slides = [
  {
    src: "/Images/Home/slider1.png",
    title: "Premium Sound Experience",
    subtitle: "Noise Cancelling Wireless Headphones",
    category: "New Arrival",
  },
  {
    src: "/Images/Home/slider2.png",
    title: "Future of Photography",
    subtitle: "Capture every detail with 8K Resolution",
    category: "Photography",
  },
  {
    src: "/Images/Home/slider3.png",
    title: "Smart Living Redefined",
    subtitle: "Seamless integration for your home",
    category: "Home Tech",
  },
];

export default function HomeSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-6 group">
      <div className="overflow-hidden rounded-[2rem] shadow-2xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] min-w-0 h-[400px] md:h-[550px]"
            >
              {/* Parallax Background Image */}
              <div
                className={`absolute inset-0 transition-transform duration-[7000ms] ease-out ${
                  selectedIndex === index ? "scale-110" : "scale-100"
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Cinematic Gradient Overlay (Left to Right) */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

              {/* Text Content with Staggered Animations */}
              <div className="relative z-20 h-full flex items-center px-8 md:px-16">
                <div className="max-w-xl text-white space-y-4 md:space-y-6">
                  <div
                    className={`transition-all duration-700 delay-300 ${
                      selectedIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <span className="bg-[#EC5228] text-[10px] md:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {slide.category}
                    </span>
                  </div>

                  <h2
                    className={`text-4xl md:text-7xl font-black leading-tight transition-all duration-1000 delay-500 ${
                      selectedIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    {slide.title}
                  </h2>

                  <p
                    className={`text-sm md:text-lg text-gray-300 transition-all duration-1000 delay-700 ${
                      selectedIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  <div
                    className={`pt-4 transition-all duration-1000 delay-1000 ${
                      selectedIndex === index
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0"
                    }`}
                  >
                    <Button
                      asChild
                      className="rounded-full bg-[#EC5228] hover:bg-white hover:text-black transition-colors px-8 py-6 text-lg"
                    >
                      <Link href="/shop">Buy Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls (Visible on hover) */}
      <button
        onClick={scrollPrev}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#EC5228] -translate-x-4 group-hover:translate-x-0"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#EC5228] translate-x-4 group-hover:translate-x-0"
      >
        <ChevronRight size={24} />
      </button>

      {/* Modern Pagination Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              selectedIndex === i ? "w-10 bg-[#EC5228]" : "w-4 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
