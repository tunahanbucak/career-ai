import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { ToasterProvider } from "@/components/providers/ToasterProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CareerAI",
    template: "%s | CareerAI",
  },
  description:
    "Yapay zeka destekli kariyer asistanınız. CV analizi, mülakat simülasyonları ve daha fazlası.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CareerAI - Kariyer Yolculuğunuzu Hızlandırın",
    description:
      "Yapay zeka ile CV'nizi analiz edin, mülakatlara hazırlanın ve kariyer basamaklarını hızla tırmanın.",
    url: "https://career-ai.app",
    siteName: "CareerAI",
    locale: "tr_TR",
    type: "website",
  },
};

// RootLayout: Tüm uygulamanın kök bileşeni.
// Her sayfada ortak olan HTML, Body yapısını ve global sağlayıcıları (Providers) içerir.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#020617]`}
      >
        {/* Global State ve Session yönetimini sağlayan kapsayıcılar */}
        <Providers>
          {children}
          <ToasterProvider />
        </Providers>
      </body>
    </html>
  );
}
