import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CategoryProducts from "@/components/Shop/CategoryProducts";
import CategoryHeroSlider from "@/components/Shop/Slider/CategoryHeroSlider";

async function getCategories() {
  await dbConnect();
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

export default async function ShopPage() {
  const categories = await getCategories();

  const productsData = await Promise.all(
    categories.map(async (cat) => [cat, await getProductsByCategory(cat)])
  );

  const products = Object.fromEntries(productsData);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <CategoryHeroSlider />
      <h1 className="text-3xl  mt-4 font-bold mb-6">Shop Products</h1>

      <Tabs defaultValue={categories[0] || ""} className="space-y-6">
        <TabsList className="flex space-x-4 border-b overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <CategoryProducts products={products[category]} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
