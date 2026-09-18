import type { Metadata } from "next";
import { Geist, Geist_Mono, Pinyon_Script } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pinyonScript = Pinyon_Script({
  weight: "400",
  variable: "--font-pinyon",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bruuma.netlify.app"),
  title: {
    default: "Bruma | Joyas y Accesorios",
    template: "%s | Bruma",
  },
  description: "Tienda online de joyas y accesorios de moda en acero blanco, acero dorado y plata 925. Encontrá collares, pulseras, anillos y más.",
  keywords: [
    "Bruma",
    "Bruma joyas",
    "Bruma accesorios",
    "joyas",
    "accesorios de moda",
    "acero blanco",
    "acero dorado",
    "plata 925",
    "collares",
    "pulseras",
    "anillos",
    "tienda online",
  ],
  authors: [{ name: "Bruma" }],
  icons: {
    icon: [
      { url: "/icon.jpg", type: "image/jpeg" },
      { url: "/favicon.ico" },
      { url: "/logo.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.jpg",
  },
  openGraph: {
    title: "Bruma | Joyas y Accesorios",
    description: "Tienda online de joyas y accesorios de moda en acero blanco, acero dorado y plata 925.",
    url: "https://bruuma.netlify.app",
    siteName: "Bruma",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Bruma Joyas y Accesorios",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bruma | Joyas y Accesorios",
    description: "Tienda online de joyas y accesorios de moda en acero blanco, acero dorado y plata 925.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pinyonScript.variable} antialiased bg-white min-h-screen flex flex-col`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NRTB5HVS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NRTB5HVS');`,
          }}
        />

        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
