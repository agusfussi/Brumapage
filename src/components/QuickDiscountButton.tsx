"use client";

import { useState, useTransition } from "react";
import { updateProductDiscountAction } from "@/app/gestion-bruma-privado/actions";
import { Percent, X } from "lucide-react";

interface QuickDiscountButtonProps {
  productId: string;
  price: number;
  discountPercentage: number;
}

const PRESET_DISCOUNTS = [0, 10, 15, 20, 30, 50];

export function QuickDiscountButton({
  productId,
  price,
  discountPercentage,
}: QuickDiscountButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const discount = discountPercentage > 0 ? discountPercentage : 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount ? Math.round(price * (1 - discount / 100)) : price;

  const applyDiscount = (pct: number) => {
    startTransition(async () => {
      await updateProductDiscountAction(productId, pct);
      setIsOpen(false);
    });
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-gray-900">
            ${finalPrice.toLocaleString("es-AR")}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ${price.toLocaleString("es-AR")}
            </span>
          )}
        </div>
        {hasDiscount && (
          <span className="inline-block mt-0.5 bg-[#26140b] text-white text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded">
            -{discount}% OFF
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
        title="Aplicar o cambiar descuento rápido"
        className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
          hasDiscount
            ? "bg-[#fbf9f6] border-[#26140b]/30 text-[#26140b] hover:bg-[#26140b] hover:text-white"
            : "border-gray-200 text-gray-500 hover:text-[#26140b] hover:border-[#26140b]/40 hover:bg-gray-50"
        } ${isPending ? "opacity-50" : ""}`}
      >
        <Percent className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-30 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 w-48">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#26140b]">
              Descuento rápido
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {PRESET_DISCOUNTS.map((pct) => {
              const active = discount === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  disabled={isPending}
                  onClick={() => applyDiscount(pct)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    active
                      ? "bg-[#26140b] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-[#26140b]/10"
                  }`}
                >
                  {pct === 0 ? "Quitar" : `-${pct}%`}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
