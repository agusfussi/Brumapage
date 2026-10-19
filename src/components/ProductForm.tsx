"use client";

import { useActionState, useState, ChangeEvent } from "react";
import { createProductAction, updateProductAction } from "@/app/gestion-bruma-privado/actions";
import Link from "next/link";
import { Image as ImageIcon, Upload } from "lucide-react";

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPercentage?: number | null;
  stock: number;
  features: string | null;
  imageUrl: string | null;
  categoryId?: string | null;
  subcategoryId?: string | null;
};

type Category = {
  id: string;
  name: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};

const QUICK_DISCOUNTS = [0, 10, 15, 20, 25, 30, 50];

export function ProductForm({ product, categories = [] }: { product?: Product, categories?: Category[] }) {
  const isEditing = !!product?.id;
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || "");
  const [previewImage, setPreviewImage] = useState<string | null>(product?.imageUrl || null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);

  const initialPrice = product?.price ?? 0;
  const initialDiscount = product?.discountPercentage ?? 0;

  const [basePriceStr, setBasePriceStr] = useState<string>(product?.price !== undefined ? String(product.price) : "");
  const [discountPct, setDiscountPct] = useState<number>(initialDiscount);
  const [promoPriceStr, setPromoPriceStr] = useState<string>(
    initialPrice > 0 && initialDiscount > 0
      ? String(Math.round(initialPrice * (1 - initialDiscount / 100)))
      : ""
  );

  const numericBasePrice = parseFloat(basePriceStr) || 0;
  const finalCalculatedPrice =
    discountPct > 0 ? Math.round(numericBasePrice * (1 - discountPct / 100)) : numericBasePrice;

  const handleBasePriceChange = (val: string) => {
    setBasePriceStr(val);
    const num = parseFloat(val) || 0;
    if (discountPct > 0 && num > 0) {
      setPromoPriceStr(String(Math.round(num * (1 - discountPct / 100))));
    } else {
      setPromoPriceStr("");
    }
  };

  const handleDiscountPctChange = (pct: number) => {
    const clamped = isNaN(pct) ? 0 : Math.min(99, Math.max(0, Math.round(pct)));
    setDiscountPct(clamped);
    if (clamped > 0 && numericBasePrice > 0) {
      setPromoPriceStr(String(Math.round(numericBasePrice * (1 - clamped / 100))));
    } else {
      setPromoPriceStr("");
    }
  };

  const handlePromoPriceChange = (val: string) => {
    setPromoPriceStr(val);
    const promo = parseFloat(val);
    if (!val || isNaN(promo) || numericBasePrice <= 0 || promo >= numericBasePrice) {
      setDiscountPct(0);
      return;
    }
    const calculatedPct = Math.round((1 - promo / numericBasePrice) * 100);
    setDiscountPct(Math.min(99, Math.max(1, calculatedPct)));
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const availableSubcategories = currentCategory?.subcategories || [];
  
  const action = isEditing 
    ? updateProductAction.bind(null, product.id!) 
    : createProductAction;

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    // If we have an optimized base64 string, attach it
    if (imageBase64) {
      formData.set("imageBase64", imageBase64);
    }
    formData.set("discountPercentage", String(discountPct));
    await action(formData);
    return null;
  }, null);

  // Client-side image optimizer using Canvas
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 1000px dimension
        const maxDim = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Convert to ultra-light high-quality WebP format (0.85 quality)
          let optimizedDataUrl = canvas.toDataURL("image/webp", 0.85);

          // Fallback to JPEG if the browser engine doesn't support WebP canvas export
          if (!optimizedDataUrl.startsWith("data:image/webp")) {
            optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          }

          setPreviewImage(optimizedDataUrl);
          setImageBase64(optimizedDataUrl);
        } else {
          const directDataUrl = readerEvent.target?.result as string;
          setPreviewImage(directDataUrl);
          setImageBase64(directDataUrl);
        }
        setIsCompressing(false);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <form action={formAction} className="bg-white p-6 rounded-lg shadow max-w-2xl border border-gray-100" encType="multipart/form-data">
      <input type="hidden" name="imageBase64" value={imageBase64} />
      <input type="hidden" name="discountPercentage" value={discountPct} />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Nombre del Producto</label>
          <input 
            type="text" 
            name="name" 
            defaultValue={product?.name} 
            required 
            className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
            placeholder="Ej: Collar Perlas Bruma"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Descripción</label>
          <textarea 
            name="description" 
            defaultValue={product?.description} 
            required 
            rows={3}
            className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
            placeholder="Detalles sobre el diseño, uso y cuidado..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#26140b]">Precio Normal ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="price" 
              value={basePriceStr}
              onChange={(e) => handleBasePriceChange(e.target.value)}
              required 
              className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#26140b]">Stock (Unidades disponibles)</label>
            <input 
              type="number" 
              min="0"
              step="1"
              name="stock" 
              defaultValue={product?.stock ?? 0} 
              required 
              className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
              placeholder="0"
            />
            <p className="text-[11px] text-[#26140b]/60 mt-1">
              Debe ser un número mayor o igual a 0.
            </p>
          </div>
        </div>

        {/* Forma C: Bloque Híbrido de Descuento (Porcentaje + Precio en Oferta en vivo) */}
        <div className="p-4 rounded-lg bg-[#fbf9f6] border border-[#26140b]/15 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className="block text-sm font-semibold text-[#26140b]">
                Oferta / Descuento (Opcional)
              </label>
              <p className="text-xs text-[#26140b]/65">
                Elegí un porcentaje o escribí el precio final deseado y se calcula solo.
              </p>
            </div>
            {discountPct > 0 && numericBasePrice > 0 && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#26140b]/15 shadow-2xs">
                <span className="bg-[#26140b] text-white text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded">
                  -{discountPct}% OFF
                </span>
                <span className="font-bold text-sm text-[#26140b]">
                  ${finalCalculatedPrice.toLocaleString("es-AR")}
                </span>
                <span className="text-xs text-[#26140b]/45 line-through">
                  ${numericBasePrice.toLocaleString("es-AR")}
                </span>
              </div>
            )}
          </div>

          {/* Botones rápidos de porcentaje */}
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_DISCOUNTS.map((pct) => {
              const isSelected = discountPct === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleDiscountPctChange(pct)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#26140b] text-white shadow-2xs"
                      : "bg-white text-[#26140b] border border-[#26140b]/20 hover:bg-[#26140b]/5"
                  }`}
                >
                  {pct === 0 ? "Sin descuento" : `${pct}% OFF`}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#26140b]/80">
                Porcentaje de Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="99"
                step="1"
                value={discountPct || ""}
                onChange={(e) => handleDiscountPctChange(parseInt(e.target.value, 10) || 0)}
                placeholder="0%"
                className="w-full border rounded p-2 bg-white text-sm focus:ring-1 focus:ring-[#26140b] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-[#26140b]/80">
                Precio Final en Oferta ($)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={promoPriceStr}
                onChange={(e) => handlePromoPriceChange(e.target.value)}
                disabled={numericBasePrice <= 0}
                placeholder={numericBasePrice > 0 ? String(numericBasePrice) : "Ingresá primero el precio normal"}
                className="w-full border rounded p-2 bg-white text-sm focus:ring-1 focus:ring-[#26140b] outline-none disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#26140b]">Categoría Principal</label>
            <select 
              name="categoryId" 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border rounded p-2 bg-white focus:ring-1 focus:ring-[#26140b] outline-none"
            >
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#26140b]">
              Subcategoría {availableSubcategories.length > 0 ? "(Opcional)" : ""}
            </label>
            {availableSubcategories.length > 0 ? (
              <select 
                name="subcategoryId" 
                defaultValue={product?.subcategoryId || ""} 
                className="w-full border rounded p-2 bg-white focus:ring-1 focus:ring-[#26140b] outline-none"
              >
                <option value="">General / Sin subcategoría</option>
                {availableSubcategories.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <div className="w-full border border-dashed rounded p-2 text-xs text-gray-400 bg-gray-50 flex items-center h-[38px]">
                {selectedCategory ? "Esta categoría no tiene subcategorías" : "Seleccioná primero una categoría"}
              </div>
            )}
          </div>
        </div>

        {/* Image Upload with Live Preview */}
        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Imagen del Producto</label>
          
          <div className="flex items-center gap-4 my-2">
            {previewImage ? (
              <div className="w-24 h-24 border-2 border-dashed border-[#26140b]/30 rounded-lg overflow-hidden relative shadow-sm">
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <ImageIcon className="w-6 h-6 mb-1 text-gray-300" />
                <span className="text-[10px]">Sin foto</span>
              </div>
            )}

            <div className="flex-1">
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-[#26140b] bg-white hover:bg-gray-50 cursor-pointer">
                <Upload className="w-4 h-4 text-[#26140b]" />
                <span>{previewImage ? "Cambiar foto" : "Subir foto desde tu PC"}</span>
                <input 
                  type="file" 
                  name="imageFile" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </label>
              <p className="text-xs text-[#26140b]/60 mt-1.5">
                {isCompressing ? "Convirtiendo y optimizando foto a WebP..." : "Formatos soportados: JPG, PNG, WEBP (se optimiza automáticamente a .webp ligero)."}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Características (Opcional)</label>
          <input 
            type="text" 
            name="features" 
            defaultValue={product?.features || ""} 
            className="w-full border rounded p-2 focus:ring-1 focus:ring-[#26140b] outline-none" 
            placeholder="Ej: Acero quirúrgico, Color Dorado, Hipoalergénico"
          />
          <p className="text-[11px] text-[#26140b]/60 mt-1">
            Separalas por comas para que aparezcan como lista de puntos.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Link 
          href="/gestion-bruma-privado" 
          className="px-4 py-2 border rounded hover:bg-gray-50 text-sm font-medium"
        >
          Cancelar
        </Link>
        <button 
          type="submit" 
          disabled={isPending || isCompressing}
          className="px-5 py-2 bg-[#26140b] text-white font-medium rounded hover:opacity-90 disabled:opacity-50 text-sm shadow-sm"
        >
          {isPending ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
