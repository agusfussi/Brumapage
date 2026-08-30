"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/gestion-bruma-privado");

  return (
    <nav className="border-b bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-4xl font-pinyon tracking-normal text-[#26140b]">
          Bruma
        </Link>
        <div className="flex items-center gap-4">
          {!isAdmin && (
            <button
              onClick={openCart}
              className="p-2 relative hover:opacity-80 transition-opacity rounded-full hover:bg-gray-100"
              aria-label="Abrir bolsa de compras"
            >
              <ShoppingBag className="w-5 h-5 text-[#26140b]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#26140b] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
