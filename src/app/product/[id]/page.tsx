import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductPurchaseActions } from "@/components/ProductPurchaseActions";

// Enable Incremental Static Regeneration
export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  const isNew = product.createdAt ? Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000 : false;

  const displayImageUrl = product.imageUrl
    ? product.imageUrl.startsWith("data:")
      ? `/api/products/${product.id}/image`
      : product.imageUrl
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-sm relative">
          {product.stock <= 0 ? (
            <span className="absolute top-3 left-3 z-10 bg-[#26140b]/80 backdrop-blur-sm text-white text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded shadow-sm select-none">
              Agotado
            </span>
          ) : isNew ? (
            <span className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm text-[#26140b] text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded shadow-sm border border-[#26140b]/15 select-none">
              Nuevo
            </span>
          ) : null}
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={product.name}
              fetchPriority="high"
              decoding="async"
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
                imageUrl: displayImageUrl,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
