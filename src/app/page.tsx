import { ProductCard } from "@/components/ProductCard";
import { HeroBanner } from "@/components/HeroBanner";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function Home() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true
      }
    });
  } catch (error) {
    console.error("Error fetching products from database:", error);
    products = [];
  }

  // Extract all available product images for the hero carousel background
  const heroImages = products
    .map((p) => p.imageUrl)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="flex flex-col">
      {/* Hero Banner with Glam Code and blurred product carousel */}
      <HeroBanner images={heroImages} />

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wider text-[#26140b]">
          Todos los Productos
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold text-[#26140b]">Próximamente...</p>
            <p className="text-sm text-[#26140b]/70 mt-1">Aún no hay productos disponibles en el catálogo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                categoryName={product.category?.name}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
