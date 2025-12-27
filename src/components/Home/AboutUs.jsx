import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Droplets, Sun, Sparkles } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: <Sun className="w-5 h-5 text-orange-500" />,
      title: "Pure Honey",
      desc: "100% raw and organic, sourced directly from the hives.",
    },
    {
      icon: <Droplets className="w-5 h-5 text-amber-600" />,
      title: "Premium Ator",
      desc: "Exquisite, long-lasting fragrances that define elegance.",
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      title: "Select Khejur",
      desc: "Hand-picked premium dates, packed with natural energy.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-yellow-600" />,
      title: "Quality First",
      desc: "Rigorous quality checks for every single product we deliver.",
    },
  ];

  return (
    <section className="relative py-10 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Fancy Image Grid */}
          <div className="relative group">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/Images/Home/ator.jpg" // Replace with Honey/Ator image
                    alt="Pure Honey"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/Images/Home/khejur.jpg" // Replace with Khejur image
                    alt="Premium Dates"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="pt-12 space-y-4">
                <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/Images/Home/honey.jpg" // Replace with Ator image
                    alt="Exquisite Perfume"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 hover:scale-[1.02]">
                  <Image
                    src="/Images/Home/slider1.png" // Replace with Lifestyle image
                    alt="Our Boutique"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-32 h-32 bg-orange-200/50 dark:bg-orange-900/20 rounded-full blur-3xl" />
          </div>

          {/* Right Side: Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="px-4 py-1 border-[#EC5228] text-[#EC5228] font-semibold tracking-wider uppercase text-xs"
              >
                Since 2024
              </Badge>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                Crafting Purity for Your{" "}
                <span className="text-[#EC5228]">Healthy Lifestyle</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that nature holds the best secrets for a fulfilling
                life. From the golden depths of our organic honey to the
                spiritual essence of premium Ator and the natural sweetness of
                selected Khejur, we bring the finest traditions to your
                doorstep.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button className="bg-[#EC5228] hover:bg-[#d9431c] text-white px-8 py-6 rounded-full text-lg shadow-lg shadow-orange-200 dark:shadow-none transition-all hover:scale-105">
                Learn Our Story
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
