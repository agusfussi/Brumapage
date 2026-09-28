export function ProductCardSkeleton() {
  return (
    <div className="block" aria-hidden="true">
      {/* Image Skeleton */}
      <div className="aspect-[4/5] bg-gray-200/70 rounded-lg overflow-hidden mb-3 relative shadow-xs animate-pulse" />

      {/* Category line skeleton */}
      <div className="w-20 h-2.5 bg-gray-200/80 rounded mb-1.5 animate-pulse" />

      {/* Title skeleton */}
      <div className="w-3/4 h-4 bg-gray-200/80 rounded mb-2 animate-pulse" />

      {/* Price skeleton */}
      <div className="w-1/3 h-5 bg-gray-200/80 rounded animate-pulse" />
    </div>
  );
}
