import Link from "next/link";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  stock?: number;
  imageUrl?: string | null;
  categoryName?: string | null;
  subcategoryName?: string | null;
  isNew?: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  stock,
  imageUrl,
  categoryName,
  subcategoryName,
  isNew,
}: ProductProps) {
  const isOutOfStock = stock !== undefined && stock <= 0;

  // Format category badge: "Acero Blanco • Collares" or just "Collares" or "Acero Blanco"
  const categoryLabel = categoryName && subcategoryName
    ? `${categoryName} • ${subcategoryName}`
    : categoryName || subcategoryName || null;

  return (
    <Link href={`/product/${id}`} className="group block focus:outline-none">
      <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-3 relative shadow-sm border border-gray-100">
        {/* Subtle Status Badges */}
        {isOutOfStock ? (
          <span className="absolute top-2 left-2 z-10 bg-[#26140b]/80 backdrop-blur-sm text-white text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded shadow-sm select-none">
            Agotado
          </span>
        ) : isNew ? (
          <span className="absolute top-2 left-2 z-10 bg-white/95 backdrop-blur-sm text-[#26140b] text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded shadow-sm border border-[#26140b]/15 select-none">
            Nuevo
          </span>
        ) : null}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Sin imagen
          </div>
        )}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      {categoryLabel && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#26140b]/70 mb-1 line-clamp-1">
          {categoryLabel}
        </p>
      )}
      <h3 className="font-semibold text-sm text-[#26140b] line-clamp-1 group-hover:opacity-80 transition-opacity">
        {name}
      </h3>
      <p className="font-bold mt-1 text-base text-[#26140b]">
        ${price.toLocaleString("es-AR")}
      </p>
    </Link>
  );
}
