"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProductActions from "@/components/Cart/ProductActions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryProducts({ products = [] }) {
  const itemsPerPage = 8; // 2 rows of 4 products
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIdx, startIdx + itemsPerPage);

  // Scroll to top of products when changing page
  useEffect(() => {
    const section = document.getElementById("product-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div id="product-section" className="space-y-6">
      {/* Product Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-300"
        key={currentPage}
      >
        {currentItems.map((product) => (
          <div
            key={product._id}
            className="relative group border rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] bg-white dark:bg-zinc-900"
          >
            <ProductActions product={product} variant="card" />
            <Link href={`/shop/${product._id}`} className="block">
              <img
                src={product.imageUrl || "/placeholder.png"}
                alt={product.productName}
                className="w-full h-24 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="p-4">
                <h3 className="text-sm md:text-lg font-semibold truncate">
                  {product.productName}
                </h3>
                <p className="text-gray-500 text-[12px] md:text-sm mt-1 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-[#EC5228] text-[11px] md:text-base font-bold mt-2">
                  ${product.price}
                </p>
                <p className="text-[10px] md:text-sm text-gray-400 mt-1">
                  {product.isInStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              className={`${
                currentPage === i + 1
                  ? "bg-[#EC5228] text-white hover:bg-[#d9431c]"
                  : "hover:border-[#EC5228] hover:text-[#EC5228]"
              } transition`}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
