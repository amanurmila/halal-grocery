"use client";

import { useEffect, useState } from "react";
import { Parallax } from "react-parallax";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTag } from "react-icons/fa";
import { cn } from "@/lib/utils";
import ProductActions from "@/components/Cart/ProductActions";
import { Loader2 } from "lucide-react";

export default function KhejurGrid({ category = "Honey", limit = 8 }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        q.set("category", category);
        q.set("page", String(page));
        q.set("limit", String(limit));

        const res = await fetch(
          `/api/products/categories/honey?${q.toString()}`
        );
        const json = await res.json();

        if (json.success) {
          setProducts(json.products || []);
          setTotal(json.total || 0);
        } else {
          setProducts([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category, page, limit]);

  const totalPages = Math.ceil(total / limit);

  const isNew = (isoDate) => {
    if (!isoDate) return false;
    const created = new Date(isoDate);
    const diff = Date.now() - created.getTime();
    return diff <= 1000 * 60 * 60 * 24 * 7;
  };

  if (loading)
    return (
      <div className="mt-6 md:mt-10 max-w-7xl mx-auto my-5 px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <Skeleton className="h-10 w-64 md:w-80" />
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50"
            >
              {/* Aspect Video Image Skeleton */}
              <Skeleton className="aspect-video w-full rounded-none" />

              <div className="p-5 space-y-3">
                {/* Title Skeleton */}
                <Skeleton className="h-5 w-3/4" />

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>

                {/* Price & Action Skeleton */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-8 w-14 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!products.length)
    return (
      <div className="py-16 text-center text-muted-foreground text-lg">
        No products found in <strong>{category}</strong>.
      </div>
    );

  return (
    <Parallax
      blur={{ min: -10, max: 10 }}
      bgImage="/Images/Home/honey.jpg"
      bgImageAlt="Ator Collection"
      strength={300}
      className="bg-fixed mt-6 md:mt-10 max-w-7xl mx-auto my-5 rounded-md bg-cover bg-center"
    >
      <div className="relative py-20">
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white dark:text-gray-100 drop-shadow-lg mb-3 sm:mb-0">
              Pure Honey Collection
            </h2>
            <div className="flex justify-center items-center gap-3">
              <p className="text-sm text-gray-200 dark:text-gray-300">
                {total} item{total > 1 ? "s" : ""} — newest first
              </p>
              <Link href="/shop" className="text-sm">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 py-1.5 text-xs font-medium transition-all hover:bg-primary hover:text-white hover:shadow-md"
                >
                  View More…
                </Button>
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-8">
            {products.map((p) => (
              <article
                key={p._id}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-gray-100 dark:border-gray-800 relative"
              >
                <ProductActions product={p} variant="card" />

                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.productName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {isNew(p.createdAt) && (
                    <span className="absolute top-3 left-3 flex items-center gap-2 bg-[#EC5228] text-white text-xs font-semibold px-1 md:px-3 py-1 rounded-full shadow">
                      <FaTag className="text=[6px] md:text-[10px]" /> New
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {p.productName}
                  </h3>
                  <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {p.description || "No description provided."}
                  </p>

                  <div className="mt-2 md:mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm md:text-xl font-bold text-[#EC5228]">
                        ${Number(p.price).toFixed(2)}
                      </p>
                      <p className="text-[8px] md:text-xs text-gray-600 dark:text-gray-400">
                        {p.isInStock ? `${p.stock} in stock` : "Out of stock"}
                      </p>
                    </div>

                    <Link href={`/shop/${p._id}`} className="text-xl">
                      <Button
                        size="sm"
                        className="bg-[#3E3F5B] text-[8px] md:text-sm cursor-pointer hover:bg-[#2c2d44] text-white dark:bg-[#EC5228] dark:hover:bg-[#d34120]"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#EC5228]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="hover:bg-[#EC5228] hover:text-white"
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center font-medium transition-all",
                    page === i + 1
                      ? "bg-[#EC5228] text-white shadow-lg scale-105"
                      : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 hover:bg-[#EC5228]/20"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="hover:bg-[#EC5228] hover:text-white"
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </Parallax>
  );
}
