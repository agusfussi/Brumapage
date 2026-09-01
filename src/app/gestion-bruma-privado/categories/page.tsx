import { prisma } from "@/lib/prisma";
import { createCategoryAction } from "./actions";
import { DeleteCategoryButton } from "@/components/DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-[#26140b]">Categorías</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form action={createCategoryAction} className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-bold mb-4 text-[#26140b]">Nueva Categoría</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-[#26140b]">Nombre de Categoría</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="Ej: Aros, Collares, Pulseras..."
                  className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#26140b] text-white p-2 rounded hover:opacity-90 font-medium shadow-sm"
              >
                Crear Categoría
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-[#26140b]">Nombre</th>
                <th className="p-4 font-semibold text-[#26140b]">Productos asociados</th>
                <th className="p-4 font-semibold text-[#26140b] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay categorías cargadas todavía.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-[#26140b]">{category.name}</td>
                    <td className="p-4 text-sm text-[#26140b]/80">
                      {category._count.products} {category._count.products === 1 ? 'producto' : 'productos'}
                    </td>
                    <td className="p-4 text-right flex justify-end items-center">
                      <DeleteCategoryButton 
                        categoryId={category.id} 
                        categoryName={category.name} 
                        productsCount={category._count.products} 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
