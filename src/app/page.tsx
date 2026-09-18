import { HeroBanner } from "@/components/HeroBanner";
import { ProductCatalog } from "@/components/ProductCatalog";
import { prisma } from "@/lib/prisma";

// Enable Incremental Static Regeneration (revalidated every 60s or on demand when editing products)
export const revalidate = 60;

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
          subcategory: true,
        },
      }),
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
        include: {
          subcategories: {
            orderBy: {
              name: "asc",
            },
          },
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

  // Lightweight product payload: convert heavy Base64 to cached image stream URLs
  // This reduces the initial HTML document payload by up to 99% (from 14.5 MB to ~30 KB)
  const optimizedProducts = products.map((p) => ({
    ...p,
    imageUrl: p.imageUrl
      ? p.imageUrl.startsWith("data:")
        ? `/api/products/${p.id}/image`
        : p.imageUrl
      : null,
  }));

  // Extract up to 4 featured product images for the hero carousel background
  const heroImages = optimizedProducts
    .map((p) => p.imageUrl)
    .filter((url): url is string => Boolean(url))
    .slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Banner with Glam Code and blurred product carousel */}
      <HeroBanner images={heroImages} />

      {/* Interactive Product Catalog with Category Filtering */}
      <ProductCatalog products={optimizedProducts} categories={categories} />
    </div>
  );
}
