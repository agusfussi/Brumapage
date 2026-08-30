"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Send, Plus, Minus, Check, Copy } from "lucide-react";

interface ProductPurchaseActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    imageUrl?: string | null;
  };
}

export function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const getDirectMessage = () => {
    return `¡Hola Bruuma! Quiero comprar ${quantity}x ${product.name} ($${(product.price * quantity).toLocaleString("es-AR")}). ¿Tienen disponibilidad para coordinar el pago y la entrega?`;
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(getDirectMessage()).catch(() => {});
    }
  };

  const handleDirectInstagram = () => {
    copyToClipboard();
    setCopiedNotification(true);
    window.open("https://ig.me/m/bruumaccesorios", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-4">
      {/* Stock Status & Quantity Selector */}
      <div className="flex items-center justify-between">
        <div
          className={`text-sm font-semibold ${
            isOutOfStock ? "text-red-600" : "text-emerald-700"
          }`}
        >
          {isOutOfStock ? "Sin stock disponible" : `${product.stock} disponibles`}
        </div>

        {!isOutOfStock && (
          <div className="flex items-center border border-gray-300 rounded bg-white">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-bold text-[#26140b]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity >= product.stock}
              className="p-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        {/* Add to Bag */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="w-full bg-[#26140b] text-white py-4 rounded-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              ¡Agregado a la bolsa!
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              Agregar a la bolsa
            </>
          )}
        </button>

        {/* Direct Instagram Purchase */}
        <button
          onClick={handleDirectInstagram}
          disabled={isOutOfStock}
          className="w-full border-2 border-[#26140b] text-[#26140b] py-3.5 rounded-md font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#26140b] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Comprar directamente por Instagram Direct
        </button>
      </div>

      {/* Copy Notification Banner */}
      {copiedNotification && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-emerald-900 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>¡Mensaje copiado al portapapeles!</span>
          </div>
          <p className="leading-relaxed">
            Se abrió el chat con <strong>@bruumaccesorios</strong>. Solo tenés que <strong>Pegar (`Ctrl + V` o mantener presionado «Pegar»)</strong> y enviar el mensaje.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={copyToClipboard}
              type="button"
              className="px-3 py-1.5 bg-emerald-600 text-white rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copiar de nuevo
            </button>
            <a
              href="https://ig.me/m/bruumaccesorios"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-emerald-600 text-emerald-800 rounded font-semibold text-[11px] flex items-center gap-1 hover:bg-emerald-100 transition-colors"
            >
              Reabrir Instagram
            </a>
          </div>
        </div>
      )}

      <p className="text-xs text-center text-[#26140b]/70 pt-1">
        Las compras y envíos se coordinan directamente por mensaje privado de Instagram.
      </p>
    </div>
  );
}
