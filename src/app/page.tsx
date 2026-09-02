import { HeroBanner } from "@/components/HeroBanner";
import { ProductCatalog } from "@/components/ProductCatalog";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function Home() {
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
        },
      }),
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);
    products = fetchedProducts;
    categories = fetchedCategories;
  } catch (error) {
    console.error("Error fetching data from database:", error);
    products = [];
    categories = [];
  }

  // Extract all available product images for the hero carousel background
  const heroImages = products
    .map((p) => p.imageUrl)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="flex flex-col">
      {/* Hero Banner with Glam Code and blurred product carousel */}
      <HeroBanner images={heroImages} />

      {/* Interactive Product Catalog with Category Filtering */}
      <ProductCatalog products={products} categories={categories} />
    </div>
  );
}
