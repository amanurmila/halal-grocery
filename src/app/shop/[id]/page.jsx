import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "@/components/Cart/ProductActions";
import ProductImageViewer from "@/components/Shop/ProductImageViewer";
async function getProduct(id) {
  await dbConnect();
  const product = await Product.findById(id).lean();
  if (!product) return null;

  return {
    _id: product._id.toString(),
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
    createdAt: product.createdAt?.toString() || "",
    updatedAt: product.updatedAt?.toString() || "",
  };
}

export default async function ProductPage({ params }) {
  const { id } = params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <p className="mt-4 text-gray-500">Try browsing other products.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block text-[#EC5228] underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden relative group">
            <div className="relative w-full h-[420px] cursor-pointer">
              {/* ✅ Added full-screen viewer trigger */}
              <ProductImageViewer
                imageUrl={product.imageUrl || "/placeholder.png"}
              />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{product.productName}</h1>
          <p className="text-sm text-gray-500 mt-1">{product.brand}</p>

          <div className="mt-4 flex items-center gap-4">
            <p className="text-3xl font-bold text-[#EC5228]">
              ${product.price}
            </p>
            <div className="text-sm text-gray-400">
              {product.isInStock ? (
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full">
                  In Stock
                </span>
              ) : (
                <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <p className="mt-4 text-gray-600">{product.description}</p>

          <ProductActions product={product} variant="page" />

          <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium">Category</div>
              <div>{product.category}</div>
            </div>
            <div>
              <div className="font-medium">Ratings</div>
              <div>{product.ratings} / 100</div>
            </div>
            <div>
              <div className="font-medium">Stock</div>
              <div>{product.stock} units</div>
            </div>
            <div>
              <div className="font-medium">Tags</div>
              <div className="line-clamp-1">{product.tags}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Added by</h3>
            <p className="text-sm text-gray-500">{product.addedBy}</p>
            <p className="text-xs text-gray-400 mt-1">
              Updated: {new Date(product.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts category={product.category} currentId={product._id} />
    </div>
  );
}

// Related Products
async function RelatedProducts({ category, currentId }) {
  if (!category) return null;
  await dbConnect();
  const related = await Product.find({ category, _id: { $ne: currentId } })
    .limit(4)
    .lean();
  if (!related.length) return null;

  const relatedPlain = related.map((p) => ({
    _id: p._id.toString(),
    productName: p.productName,
    price: p.price,
    imageUrl: p.imageUrl,
  }));

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Related products</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {relatedPlain.map((r) => (
          <Link
            key={r._id}
            href={`/shop/${r._id}`}
            className="block border rounded-lg overflow-hidden"
          >
            <div className="relative w-full h-28">
              <Image
                src={r.imageUrl || "/placeholder.png"}
                alt={r.productName}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2 text-sm">
              <div className="font-medium">{r.productName}</div>
              <div className="text-[#EC5228]">${r.price}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
