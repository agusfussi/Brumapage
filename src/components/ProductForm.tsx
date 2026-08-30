"use client";

import { useActionState } from "react";
import { createProductAction, updateProductAction } from "@/app/gestion-bruma-privado/actions";
import Link from "next/link";

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  features: string | null;
  imageUrl: string | null;
  categoryId?: string | null;
};

type Category = {
  id: string;
  name: string;
};

export function ProductForm({ product, categories = [] }: { product?: Product, categories?: Category[] }) {
  const isEditing = !!product?.id;
  
  const action = isEditing 
    ? updateProductAction.bind(null, product.id!) 
    : createProductAction;

  const [state, formAction, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    await action(formData);
    return null;
  }, null);

  return (
    <form action={formAction} className="bg-white p-6 rounded-lg shadow max-w-2xl border border-gray-100" encType="multipart/form-data">
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

        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Categoría</label>
          <select 
            name="categoryId" 
            defaultValue={product?.categoryId || ""} 
            className="w-full border rounded p-2 bg-white focus:ring-1 focus:ring-[#26140b] outline-none"
          >
            <option value="">Sin categoría</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-[#26140b]">Imagen del Producto</label>
          {product?.imageUrl && (
            <div className="mb-2 text-sm text-[#26140b]/80">
              Imagen actual: <img src={product.imageUrl} alt="Actual" className="w-16 h-16 object-cover rounded mt-1 border" />
            </div>
          )}
          <input 
            type="file" 
            name="imageFile" 
            accept="image/*"
            className="w-full border rounded p-2 text-sm" 
          />
          <p className="text-xs text-[#26140b]/60 mt-1">
            {isEditing ? "Dejá este campo vacío si no querés cambiar la imagen actual." : "Subí una foto desde tu computadora."}
          </p>
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
          disabled={isPending}
          className="px-5 py-2 bg-[#26140b] text-white font-medium rounded hover:opacity-90 disabled:opacity-50 text-sm shadow-sm"
        >
          {isPending ? "Guardando..." : "Guardar Producto"}
        </button>
      </div>
    </form>
  );
}
