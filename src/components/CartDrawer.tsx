"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, Plus, Minus, ShoppingBag, Send, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Build structured order message for Instagram Direct Message
  const orderSummaryText = items
    .map((item) => `• ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toLocaleString("es-AR")})`)
    .join("\n");
  
  const fullMessage = `¡Hola Bruuma! Me gustaría realizar el siguiente pedido:\n\n${orderSummaryText}\n\nTotal: $${totalPrice.toLocaleString("es-AR")}\n\n¿Tienen disponibilidad para coordinar el pago y la entrega? ¡Muchas gracias!`;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullMessage).catch(() => {});
    }
  };

  const handleBuyOnInstagram = () => {
    copyToClipboard();
    setCopiedNotification(true);

    // Open Instagram DM directly with @bruumaccesorios
    window.open("https://ig.me/m/bruumaccesorios", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#26140b]" />
            <h2 className="text-lg font-bold text-[#26140b]">
              Tu Bolsa ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black"
            aria-label="Cerrar bolsa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-[#26140b] mb-1">
                Tu bolsa está vacía
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Descubrí nuestros productos y agregalos a tu bolsa.
              </p>
              <button
                onClick={closeCart}
                className="bg-[#26140b] text-white px-6 py-2.5 rounded-md font-medium hover:opacity-90 transition-opacity"
              >
                Ver productos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-3 rounded-lg border border-gray-100 bg-gray-50/50"
              >
                {/* Product Image */}
                <div className="w-20 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Sin foto
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-[#26140b] line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-[#26140b] mt-1">
                      ${item.price.toLocaleString("es-AR")}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-[#26140b]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Subtotal: ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-white space-y-3">
            <div className="flex justify-between items-center text-base font-bold text-[#26140b]">
              <span>Total Estimado:</span>
              <span className="text-xl">${totalPrice.toLocaleString("es-AR")}</span>
            </div>

            {/* Prominent notification banner when order is copied */}
            {copiedNotification ? (
              <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-lg text-emerald-900 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>¡Mensaje copiado al portapapeles!</span>
                </div>
                <p className="leading-relaxed">
                  Se abrió el chat con <strong>@bruumaccesorios</strong>. Solo tenés que <strong>Pegar (`Ctrl + V` o mantener presionado «Pegar»)</strong> en el mensaje y enviarlo.
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
            ) : (
              <p className="text-xs text-gray-500 text-center">
                Al hacer clic se copiará tu pedido y se abrirá el chat de Instagram con @bruumaccesorios para enviarlo.
              </p>
            )}

            {/* Buy on Instagram Button */}
            <button
              onClick={handleBuyOnInstagram}
              className="w-full bg-[#26140b] text-white py-3.5 rounded-md font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
            >
              <Send className="w-4 h-4" />
              Comprar por Instagram Direct
            </button>

            <div className="flex justify-between items-center pt-1">
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:underline"
              >
                Vaciar bolsa
              </button>
              <button
                onClick={closeCart}
                className="text-xs text-gray-500 hover:text-black"
              >
                Seguir viendo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
