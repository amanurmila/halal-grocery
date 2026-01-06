"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProductActions from "@/components/Cart/ProductActions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryProducts({ products = [] }) {
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIdx, startIdx + itemsPerPage);

  // Simulate a brief load for the "fancy" skeleton feel when changing categories/pages
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timer);
  }, [currentPage, products]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div
      id="product-section"
      className="space-y-8 animate-in fade-in duration-500"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          : currentItems.map((product) => (
              <div
                key={product._id}
                className="group relative flex flex-col h-full border rounded-2xl overflow-hidden bg-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-zinc-200 dark:border-zinc-800"
              >
                <div className="relative aspect-square overflow-hidden">
                  <ProductActions product={product} variant="card" />
                  <Link href={`/shop/${product._id}`}>
                    <img
                      src={product.imageUrl || "/placeholder.png"}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <Link
                    href={`/shop/${product._id}`}
                    className="space-y-2 flex-grow"
                  >
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-[#EC5228] transition-colors">
                      {product.productName}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </Link>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-[#EC5228]">
                      ${product.price}
                    </span>
                    <span
                      className={`md:text-[10px] text-[6px] uppercase tracking-widest font-bold  ${
                        product.isInStock ? " text-green-700" : " text-red-700"
                      }`}
                    >
                      {product.isInStock ? "In Stock" : "Sold Out"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Fancy Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-8 border-t">
          <Button
            variant="ghost"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Previous
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  currentPage === i + 1
                    ? "bg-[#EC5228] text-white shadow-lg shadow-orange-200 dark:shadow-none"
                    : "hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="rounded-full"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Sub-component for the Skeleton Card
function ProductSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden p-0 space-y-4">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}
