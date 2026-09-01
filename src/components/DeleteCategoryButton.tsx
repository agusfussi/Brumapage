"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { deleteCategoryAction } from "@/app/gestion-bruma-privado/categories/actions";

interface DeleteCategoryButtonProps {
  categoryId: string;
  categoryName: string;
  productsCount: number;
}

export function DeleteCategoryButton({ categoryId, categoryName, productsCount }: DeleteCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasProducts = productsCount > 0;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCategoryAction(categoryId);
      setIsOpen(false);
    } catch (e) {
      console.error("Error al eliminar categoría:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  if (hasProducts) {
    return (
      <button
        type="button"
        disabled
        className="p-2 text-gray-300 cursor-not-allowed rounded"
        title="No podés eliminar una categoría que tiene productos asociados"
        aria-label={`No se puede eliminar ${categoryName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Eliminar categoría"
        aria-label={`Eliminar ${categoryName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => !isDeleting && setIsOpen(false)}
          />

          {/* Dialog */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 z-10 animate-in zoom-in-95 duration-150 border border-gray-100">
            <button
              onClick={() => !isDeleting && setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black p-1"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#26140b]">
                  ¿Eliminar categoría definitivamente?
                </h3>
                <p className="text-sm text-[#26140b]/80 mt-2 leading-relaxed">
                  ¿Estás seguro de que querés eliminar la categoría <strong className="text-[#26140b]">"{categoryName}"</strong>? 
                  Esta acción es permanente y se borrará del sistema.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {isDeleting ? "Eliminando..." : "Sí, eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
