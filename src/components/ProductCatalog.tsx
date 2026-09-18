"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Tag } from "lucide-react";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategories?: Subcategory[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
  createdAt?: Date | string;
  isNew?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  subcategory?: {
    id: string;
    name: string;
  } | null;
}

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
}

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>("all");

  const handleCategoryChange = (catId: string) => {
    setSelectedCategoryId(catId);
    setSelectedSubcategoryId("all"); // Reset subcategory when switching main category
  };

  // Find active category and its subcategories
  const activeCategory = categories.find((c) => c.id === selectedCategoryId);
  const activeSubcategories = activeCategory?.subcategories || [];

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter((p) => {
    if (selectedCategoryId !== "all" && p.categoryId !== selectedCategoryId) {
      return false;
    }
    if (selectedSubcategoryId !== "all" && p.subcategoryId !== selectedSubcategoryId) {
      return false;
    }
    return true;
  });

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center uppercase tracking-wider text-[#26140b]">
        Todos los Productos
      </h2>

      {/* Main Categories Filter (Level 1) */}
      {categories.length > 0 && (
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar px-2">
            {/* Option: Todos */}
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                selectedCategoryId === "all"
                  ? "bg-[#26140b] text-white shadow-sm"
                  : "bg-white text-[#26140b] border border-[#26140b]/20 hover:border-[#26140b]/50 hover:bg-[#26140b]/5"
              }`}
            >
              Todos ({products.length})
            </button>

            {/* Dynamic Main Categories */}
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? "bg-[#26140b] text-white shadow-sm"
                      : "bg-white text-[#26140b] border border-[#26140b]/20 hover:border-[#26140b]/50 hover:bg-[#26140b]/5"
                  }`}
                >
                  {cat.name} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>

          {/* Subcategories Filter (Level 2 - shown when active category has subcategories) */}
          {selectedCategoryId !== "all" && activeSubcategories.length > 0 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar px-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-xs text-[#26140b]/60 flex items-center gap-1 mr-1 select-none font-medium">
                <Tag className="w-3.5 h-3.5" />
                <span>Tipo:</span>
              </span>

              {/* Option: Todos en esta categoría */}
              <button
                onClick={() => setSelectedSubcategoryId("all")}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer font-medium ${
                  selectedSubcategoryId === "all"
                    ? "bg-[#26140b]/90 text-white shadow-xs"
                    : "bg-[#f4f0eb] text-[#26140b] hover:bg-[#26140b]/10"
                }`}
              >
                Todos
              </button>

              {/* Dynamic Subcategories */}
              {activeSubcategories.map((sub) => {
                const subCount = products.filter(
                  (p) => p.categoryId === selectedCategoryId && p.subcategoryId === sub.id
                ).length;
                const isSelected = selectedSubcategoryId === sub.id;

                return (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategoryId(sub.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-150 whitespace-nowrap cursor-pointer font-medium ${
                      isSelected
                        ? "bg-[#26140b]/90 text-white shadow-xs"
                        : "bg-[#f4f0eb] text-[#26140b] hover:bg-[#26140b]/10"
                    }`}
                  >
                    {sub.name} {subCount > 0 && `(${subCount})`}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Products Grid / Empty States */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-xl border border-gray-100 max-w-md mx-auto">
          <p className="text-lg font-semibold text-[#26140b]">Próximamente...</p>
          <p className="text-sm text-[#26140b]/70 mt-1">Aún no hay productos disponibles en el catálogo.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-xl border border-dashed border-gray-200 max-w-md mx-auto">
          <p className="text-base font-medium text-[#26140b]">
            No hay productos en esta selección por el momento.
          </p>
          <button
            onClick={() => {
              setSelectedCategoryId("all");
              setSelectedSubcategoryId("all");
            }}
            className="mt-4 text-xs font-bold underline text-[#26140b] hover:opacity-80 cursor-pointer"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((product) => {
            const isNew = product.isNew !== undefined
              ? product.isNew
              : (product.createdAt ? Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000 : false);

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                imageUrl={product.imageUrl}
                categoryName={product.category?.name}
                subcategoryName={product.subcategory?.name}
                isNew={isNew}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
