import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./components/Providers";

// Yazı tiplerini yapılandır (Geist Sans ve Mono)
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Sayfa Metadata bilgileri (SEO için başlık ve açıklama)
export const metadata: Metadata = { title: "CareerAI", description: "Kariyer Asistanı" };

// RootLayout: Tüm uygulamanın kök bileşeni.
// Her sayfada ortak olan HTML, Body yapısını ve global sağlayıcıları (Providers) içerir.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="dark h-full" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#020617]`}>
        {/* Global State ve Session yönetimini sağlayan kapsayıcılar */}
        <Providers>
          {children}
          {/* Bildirim (Toast) bileşeni - Tüm uygulamada kullanılabilir */}
          <Toaster position="top-center" theme="dark" richColors />
        </Providers>
      </body>
    </html>
  );
}
