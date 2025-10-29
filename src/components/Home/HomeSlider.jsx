"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useCallback } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const images = [
  "/Images/Home/slider1.png",
  "/Images/Home/slider2.png",
  "/Images/Home/slider3.png",
];

export default function HomeSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="relative w-full mx-auto max-w-6xl px-2 sm:px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* Slider Viewport */}
      <div ref={emblaRef} className="embla__viewport">
        <div className="flex">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] aspect-video overflow-hidden"
            >
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover rounded-xl sm:rounded-2xl shadow-lg transition-transform duration-700 hover:scale-105"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollPrev}
          className="rounded-full bg-white/70 hover:bg-white text-gray-800 backdrop-blur-sm shadow-md p-2 sm:p-3 transition-transform hover:scale-105"
        >
          <FaArrowLeft className="text-sm sm:text-base md:text-lg" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={scrollNext}
          className="rounded-full bg-white/70 hover:bg-white text-gray-800 backdrop-blur-sm shadow-md p-2 sm:p-3 transition-transform hover:scale-105"
        >
          <FaArrowRight className="text-sm sm:text-base md:text-lg" />
        </Button>
      </div>

      {/* Dots (Indicators) */}
      <div className="absolute bottom-3 sm:bottom-4 flex w-full justify-center gap-2 sm:gap-3">
        {images.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/60 hover:bg-white transition-all"
          ></div>
        ))}
      </div>
    </div>
  );
}
