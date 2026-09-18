"use client";

import { useEffect, useState } from "react";

interface HeroBannerProps {
  images: string[];
}

export function HeroBanner({ images }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-cycle through product images every 4.5 seconds if there are 2 or more images
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [images.length]);

  const hasImages = images.length > 0;
  // Limit to at most 4 images for performance
  const bannerImages = images.slice(0, 4);

  return (
    <section className="h-72 md:h-96 w-full flex items-center justify-center relative overflow-hidden bg-[#f4f0eb]">
      {/* Blurred Carousel Background */}
      {hasImages ? (
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
          {bannerImages.map((imgUrl, index) => (
            <div
              key={imgUrl + index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <img
                src={imgUrl}
                alt=""
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover scale-105 blur-[6px] md:blur-[8px]"
              />
            </div>
          ))}

          {/* Warm Tint & Gradient Overlay for perfect text contrast */}
          <div className="absolute inset-0 bg-[#f4f0eb]/55 md:bg-[#f4f0eb]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f4f0eb] via-transparent to-transparent opacity-80" />
        </div>
      ) : null}

      {/* Hero Content */}
      <div className="text-center z-10 px-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-700">
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#26140b]/70 block mb-2">
          Nueva Colección
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#26140b] mb-3 drop-shadow-sm font-sans">
          Glam Code
        </h1>
        <p className="text-base md:text-xl text-[#26140b]/85 font-normal tracking-wide">
          Descubrí los accesorios que marcan tendencia.
        </p>
      </div>
    </section>
  );
}
