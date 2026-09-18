import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  let product = null;
  let categories: any[] = [];

  try {
    const [fetchedProduct, fetchedCategories] = await Promise.all([
      prisma.product.findUnique({ where: { id } }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          subcategories: {
            orderBy: { name: "asc" },
          },
        },
      }),
    ]);
    product = fetchedProduct;
    categories = fetchedCategories;
  } catch (e) {
    console.error("Error loading product/categories for edit:", e);
  }

  if (!product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/gestion-bruma-privado" className="hover:opacity-80 flex items-center gap-2 w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>
        <h1 className="text-2xl font-bold mt-4">Editar Producto</h1>
      </div>
      
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
