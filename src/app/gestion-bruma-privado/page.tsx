import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { DeleteProductButton } from "@/components/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#26140b]">Productos</h1>
          <p className="text-sm text-[#26140b]/70">Administrá el inventario, precios y fotos de tu catálogo.</p>
        </div>
        <Link 
          href="/gestion-bruma-privado/product/new" 
          className="flex items-center gap-2 bg-[#26140b] text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-[#26140b]/70 font-semibold">
              <th className="p-4">Foto</th>
              <th className="p-4">Nombre</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Precio</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No hay productos cargados en el inventario.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-4 w-16">
                    <div className="w-12 h-14 bg-gray-100 rounded overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                          Sin foto
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-[#26140b]">{product.name}</td>
                  <td className="p-4 text-[#26140b]/80">
                    {product.category?.name || <span className="text-gray-400 italic">Sin categoría</span>}
                  </td>
                  <td className="p-4 font-bold text-[#26140b]">${product.price.toLocaleString("es-AR")}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      product.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                    }`}>
                      {product.stock > 0 ? `${product.stock} u.` : "Agotado"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/gestion-bruma-privado/product/${product.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar producto"
                        aria-label={`Editar ${product.name}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      
                      {/* Interactive Delete with Confirmation Modal */}
                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
