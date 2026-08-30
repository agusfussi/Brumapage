"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Heart } from "lucide-react";

// SVG Icon for Instagram
function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const GOOGLE_MAPS_LOCATION_URL =
  "https://www.google.com/search?client=ms-android-samsung-ss&hs=CbCB&sca_esv=936fc7d1f21905e6&sxsrf=APpeQnvmA9r-vppsSjD11OMaaNNHmbYH6g:1788020980921&kgmid=/g/11nvhbrf7v&q=Bruumaccesorios&shem=epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/act/m1/2&kgs=6245e76716eaa85e&utm_source=epsd1,ltae,rimspwouoe,sh/x/loc/act/m1/2";

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/gestion-bruma-privado");

  // Don't render public footer on admin routes
  if (isAdmin) return null;

  return (
    <footer className="border-t bg-[#fbf9f6] text-[#26140b] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* Brand */}
          <div className="space-y-2">
            <Link href="/" className="text-4xl font-pinyon inline-block">
              Bruma
            </Link>
            <p className="text-xs text-[#26140b]/80 max-w-sm mx-auto md:mx-0">
              Accesorios y complementos elegidos con dedicación para acompañar tu estilo.
            </p>
          </div>

          {/* Contact / Delivery Point */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#26140b]/70">
              Ubicación & Contacto
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/bruumaccesorios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#26140b]/20 bg-white hover:bg-[#26140b] hover:text-white transition-all shadow-sm group text-sm font-medium"
              >
                <InstagramIcon className="w-4 h-4 text-[#26140b] group-hover:text-white transition-colors" />
                <span>@bruumaccesorios</span>
              </a>

              {/* Delivery Address / Location */}
              <a
                href={GOOGLE_MAPS_LOCATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#26140b]/20 bg-white hover:bg-[#26140b] hover:text-white transition-all shadow-sm group text-sm font-medium"
              >
                <MapPin className="w-4 h-4 text-[#26140b] group-hover:text-white transition-colors" />
                <span>Punto de entrega</span>
              </a>
            </div>
          </div>

          {/* Information & Copyright */}
          <div className="text-center md:text-right space-y-1 text-xs text-[#26140b]/70">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Catálogo oficial de Bruma <Heart className="w-3 h-3 fill-current text-[#26140b]" />
            </p>
            <p>© {new Date().getFullYear()} Bruma. Todos los derechos reservados.</p>
            <p className="text-[11px] text-[#26140b]/50">
              Coordinación de compras por mensaje directo de Instagram
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
