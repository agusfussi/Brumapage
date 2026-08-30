import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductPurchaseActions } from "@/components/ProductPurchaseActions";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-sm">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            {product.category && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#26140b]/70 mb-2">
                {product.category.name}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-bold mb-6">${product.price.toLocaleString("es-AR")}</p>
            
            <div className="border-t border-b py-6 mb-6 space-y-4">
              <div>
                <h3 className="text-sm uppercase tracking-wider font-bold mb-2">Descripción</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#26140b]/90">{product.description}</p>
              </div>

              {product.features && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider font-bold mb-2">Características</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 text-[#26140b]/90">
                    {product.features.split(",").map((feature, i) => (
                      <li key={i}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <ProductPurchaseActions
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                imageUrl: product.imageUrl,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
