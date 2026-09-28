import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col" aria-busy="true" aria-label="Cargando catálogo...">
      {/* Hero Banner Skeleton */}
      <section className="h-72 md:h-96 w-full flex items-center justify-center relative overflow-hidden bg-brand-surface animate-pulse">
        <div className="text-center z-10 px-4 max-w-2xl mx-auto space-y-3">
          <div className="w-28 h-3 bg-brand-primary/10 rounded-full mx-auto" />
          <div className="w-48 md:w-64 h-12 bg-brand-primary/15 rounded-lg mx-auto" />
          <div className="w-64 md:w-80 h-4 bg-brand-primary/10 rounded mx-auto" />
        </div>
      </section>

      {/* Catalog Skeleton */}
      <section className="container mx-auto px-4 py-12">
        <div className="w-52 h-8 bg-gray-200/80 rounded mx-auto mb-8 animate-pulse" />

        {/* Filter Pills Skeleton */}
        <div className="flex items-center justify-center gap-2 mb-8 overflow-hidden">
          <div className="w-20 h-8 bg-gray-200/80 rounded-full animate-pulse" />
          <div className="w-28 h-8 bg-gray-200/80 rounded-full animate-pulse" />
          <div className="w-28 h-8 bg-gray-200/80 rounded-full animate-pulse" />
          <div className="w-24 h-8 bg-gray-200/80 rounded-full animate-pulse" />
        </div>

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </div>
  );
}
