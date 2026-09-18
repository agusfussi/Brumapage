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

export function ProductForm({ product, categories = [] }: { product?: Product, categories?: Category[] }) {
  const isEditing = !!product?.id;
  const [selectedCategory, setSelectedCategory] = useState<string>(product?.categoryId || "");
  const [previewImage, setPreviewImage] = useState<string | null>(product?.imageUrl || null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState(false);

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
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.82);
          setPreviewImage(compressedDataUrl);
          setImageBase64(compressedDataUrl);
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
            <label className="block text-sm font-medium mb-1 text-[#26140b]">Precio ($)</label>
            <input 
              type="number" 
              step="0.01"
              min="0"
              name="price" 
              defaultValue={product?.price ?? ""} 
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
                {isCompressing ? "Optimizando foto..." : "Formatos soportados: JPG, PNG, WEBP."}
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
