import Link from "next/link";
import { logoutAction } from "./actions";
import { LogOut, Home, Package, List } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold tracking-tight">Bruma Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/gestion-bruma-privado" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ">
            <Package className="w-5 h-5" />
            <span>Productos</span>
          </Link>
          <Link href="/gestion-bruma-privado/categories" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ">
            <List className="w-5 h-5" />
            <span>Categorías</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ">
            <Home className="w-5 h-5" />
            <span>Ver Tienda</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <form action={logoutAction}>
            <button type="submit" className="flex items-center gap-2 p-2 rounded-md hover:bg-red-50  w-full text-left">
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
