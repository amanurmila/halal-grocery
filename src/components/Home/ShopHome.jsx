import { Suspense } from "react";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryProducts from "@/components/Shop/CategoryProducts";

// --- Database Helper Functions (RESTORED) ---
async function getCategories() {
  await dbConnect();
  // Returns a unique list of categories from your Product model
  return await Product.distinct("category");
}

async function getProductsByCategory(category) {
  await dbConnect();
  const products = await Product.find({ category })
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => ({
    _id: p._id.toString(),
    productName: p.productName,
    description: p.description,
    price: p.price,
    stock: p.stock,
    isInStock: p.isInStock,
    category: p.category,
    brand: p.brand,
    tags: p.tags,
    ratings: p.ratings,
    addedBy: p.addedBy,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt?.toString() || "",
    updatedAt: p.updatedAt?.toString() || "",
  }));
}

// --- Main Component ---
export default async function ShopHome() {
  const categories = await getCategories();

  // Fetch all products for all categories in parallel
  const productsData = await Promise.all(
    categories.map(async (cat) => [cat, await getProductsByCategory(cat)])
  );

  const products = Object.fromEntries(productsData);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Fancy Header */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Our Collection
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore our handpicked products across various categories.
        </p>
      </div>

      <Tabs defaultValue={categories[0] || ""} className="w-full space-y-10">
        {/* Centered & Fancy TabsList */}
        <div className="flex justify-center">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-full bg-muted p-1.5 text-muted-foreground shadow-sm border border-zinc-200 dark:border-zinc-800">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full px-6 py-2 text-sm font-medium transition-all 
                           data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 
                           data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent
            key={category}
            value={category}
            className="mt-0 outline-none animate-in fade-in zoom-in-95 duration-300"
          >
            {/* Pass products to the client component. 
               The client component handles its own internal skeleton loading state.
            */}
            <CategoryProducts products={products[category]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
