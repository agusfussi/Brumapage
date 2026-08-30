import { prisma } from "@/lib/prisma";
import { Trash2 } from "lucide-react";
import { deleteCategoryAction, createCategoryAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true } } }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categorías</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form action={createCategoryAction} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Nueva Categoría</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full border rounded p-2" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#26140b] text-white  p-2 rounded hover:opacity-90"
              >
                Crear Categoría
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium ">Nombre</th>
                <th className="p-4 font-medium ">Productos</th>
                <th className="p-4 font-medium  text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center ">
                    No hay categorías cargadas.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-4 font-medium">{category.name}</td>
                    <td className="p-4">{category._count.products}</td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <form action={deleteCategoryAction.bind(null, category.id)}>
                        <button type="submit" className="p-2  hover:bg-red-50 rounded" disabled={category._count.products > 0} title={category._count.products > 0 ? "No puedes eliminar una categoría con productos" : "Eliminar categoría"}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
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
