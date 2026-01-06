import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import CategoryFadeSlider from "./CategoryFadeSlider";

async function getLatestProductsByCategory() {
  await dbConnect();

  // Get unique categories
  const categories = await Product.distinct("category");

  // For each category, get latest product
  const products = await Promise.all(
    categories.map(async (category) => {
      const product = await Product.findOne({ category })
        .sort({ createdAt: -1 })
        .lean();

      if (!product) return null;

      return {
        _id: product._id.toString(),
        productName: product.productName,
        price: product.price,
        category: product.category,
        brand: product.brand,
        imageUrl: product.imageUrl,
      };
    })
  );

  return products.filter(Boolean);
}

export default async function CategoryHeroSlider() {
  const products = await getLatestProductsByCategory();
  return <CategoryFadeSlider products={products} />;
}
