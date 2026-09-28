import { ArrowLeft } from "lucide-react";

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8" aria-busy="true" aria-label="Cargando producto...">
      <div className="inline-flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al catálogo</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Image Skeleton */}
        <div className="aspect-[4/5] bg-gray-200/70 rounded-lg overflow-hidden shadow-xs animate-pulse" />

        {/* Product Details Skeleton */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-24 h-3 bg-gray-200/80 rounded animate-pulse" />
            <div className="w-3/4 h-9 bg-gray-200/80 rounded animate-pulse" />
            <div className="w-32 h-8 bg-gray-200/80 rounded animate-pulse" />

            <div className="border-t border-b py-6 space-y-3">
              <div className="w-24 h-4 bg-gray-200/80 rounded animate-pulse" />
              <div className="w-full h-16 bg-gray-200/60 rounded animate-pulse" />
            </div>
          </div>

          <div className="pt-2">
            <div className="w-full h-12 bg-gray-200/80 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
