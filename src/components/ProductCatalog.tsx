"use client";

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId?: string | null;
  category?: {
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

  // Filter products based on selected category
  const filteredProducts = selectedCategoryId === "all"
    ? products
    : products.filter((p) => p.categoryId === selectedCategoryId);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center uppercase tracking-wider text-[#26140b]">
        Todos los Productos
      </h2>

      {/* Category Filter Pills (shown only if there are categories) */}
      {categories.length > 0 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar px-2">
          {/* Option: Todos */}
          <button
            onClick={() => setSelectedCategoryId("all")}
            className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
              selectedCategoryId === "all"
                ? "bg-[#26140b] text-white shadow-sm"
                : "bg-white text-[#26140b] border border-[#26140b]/20 hover:border-[#26140b]/50 hover:bg-[#26140b]/5"
            }`}
          >
            Todos ({products.length})
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            const isSelected = selectedCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
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
            No hay productos en esta categoría por el momento.
          </p>
          <button
            onClick={() => setSelectedCategoryId("all")}
            className="mt-4 text-xs font-bold underline text-[#26140b] hover:opacity-80 cursor-pointer"
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              imageUrl={product.imageUrl}
              categoryName={product.category?.name}
            />
          ))}
        </div>
      )}
    </section>
  );
}
