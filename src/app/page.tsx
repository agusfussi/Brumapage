import { ProductCard } from "@/components/ProductCard";
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

  return (
    <div className="flex flex-col">
      {/* Banner hero */}
      <section className="bg-[#f4f0eb] h-64 md:h-96 w-full flex items-center justify-center relative">
        <div className="text-center z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Nueva Colección
          </h1>
          <p className="text-lg md:text-xl">
            Descubrí los accesorios que marcan tendencia.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-8 text-center uppercase tracking-wider">
          Todos los Productos
        </h2>
        
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold">Próximamente...</p>
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
