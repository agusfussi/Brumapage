import { prisma } from "@/lib/prisma";
import { createCategoryAction, createSubcategoryAction } from "./actions";
import { DeleteCategoryButton } from "@/components/DeleteCategoryButton";
import { DeleteSubcategoryButton } from "@/components/DeleteSubcategoryButton";
import { FolderTree, Tag, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: any[] = [];

  try {
    categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { products: true } },
        subcategories: {
          orderBy: { name: "asc" },
          include: {
            _count: { select: { products: true } },
          },
        },
      },
    });
  } catch (e) {
    console.error("Error fetching categories:", e);
    categories = [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#26140b]">Categorías y Subcategorías</h1>
        <p className="text-sm text-[#26140b]/70 mt-1">
          Organizá tus productos en categorías principales (ej: <em>Acero Blanco</em>) y subcategorías (ej: <em>Collares, Pulseras, Anillos</em>).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="md:col-span-1 space-y-6">
          {/* Form 1: Nueva Categoría Principal */}
          <form
            action={createCategoryAction}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3 text-[#26140b]">
              <FolderTree className="w-5 h-5" />
              <h2 className="text-base font-bold">Nueva Categoría Principal</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#26140b]">
                  Nombre
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ej: Acero Blanco, Acero Dorado..."
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#26140b] outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#26140b] text-white p-2.5 rounded-lg hover:opacity-90 font-medium text-sm shadow-sm transition-opacity"
              >
                Crear Categoría Principal
              </button>
            </div>
          </form>

          {/* Form 2: Nueva Subcategoría */}
          <form
            action={createSubcategoryAction}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3 text-[#26140b]">
              <Tag className="w-5 h-5" />
              <h2 className="text-base font-bold">Nueva Subcategoría</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#26140b]">
                  Categoría Principal a la que pertenece
                </label>
                {categories.length === 0 ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    Primero debés crear una categoría principal arriba.
                  </p>
                ) : (
                  <select
                    name="categoryId"
                    required
                    className="w-full border rounded-lg p-2.5 text-sm bg-white focus:ring-1 focus:ring-[#26140b] outline-none"
                  >
                    <option value="">Seleccioná una categoría...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#26140b]">
                  Nombre de la Subcategoría
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={categories.length === 0}
                  placeholder="Ej: Collares, Pulseras, Anillos..."
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#26140b] outline-none disabled:bg-gray-50"
                />
              </div>

              <button
                type="submit"
                disabled={categories.length === 0}
                className="w-full bg-[#26140b] text-white p-2.5 rounded-lg hover:opacity-90 font-medium text-sm shadow-sm transition-opacity disabled:opacity-50"
              >
                Crear Subcategoría
              </button>
            </div>
          </form>
        </div>

        {/* Categories & Subcategories Tree List */}
        <div className="md:col-span-2 space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-100 text-gray-400">
              <FolderTree className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#26140b]" />
              <p className="font-medium text-[#26140b]">No hay categorías cargadas todavía.</p>
              <p className="text-xs text-gray-500 mt-1">Creá una categoría en el formulario de la izquierda.</p>
            </div>
          ) : (
            categories.map((category) => {
              const subcats = category.subcategories || [];

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:border-gray-200 transition-all"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-5 h-5 text-[#26140b]/80" />
                      <div>
                        <h3 className="font-bold text-base text-[#26140b]">{category.name}</h3>
                        <span className="text-xs text-[#26140b]/60">
                          {category._count?.products || 0}{" "}
                          {(category._count?.products || 0) === 1 ? "producto" : "productos"} en total
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <DeleteCategoryButton
                        categoryId={category.id}
                        categoryName={category.name}
                        productsCount={category._count?.products || 0}
                      />
                    </div>
                  </div>

                  {/* Subcategories Chips */}
                  <div className="pt-3">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#26140b]/60 mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Subcategorías ({subcats.length}):</span>
                    </div>

                    {subcats.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-1">
                        Sin subcategorías todavía. Podés crear subcategorías para {category.name} desde la izquierda.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {subcats.map((sub: any) => (
                          <div
                            key={sub.id}
                            className="inline-flex items-center gap-2 bg-[#f4f0eb] border border-[#26140b]/15 px-3 py-1 rounded-full text-xs font-medium text-[#26140b] shadow-xs"
                          >
                            <span>{sub.name}</span>
                            <span className="text-[10px] text-[#26140b]/60 font-semibold">
                              ({sub._count?.products || 0})
                            </span>
                            <DeleteSubcategoryButton
                              subcategoryId={sub.id}
                              subcategoryName={sub.name}
                              productsCount={sub._count?.products || 0}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
