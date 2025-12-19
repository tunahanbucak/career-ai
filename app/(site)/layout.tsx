import LandingNavbar from "@/components/layout/LandingNavbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerAI - Yapay Zeka Destekli Kariyer Koçu",
  description: "CV analizi, mülakat simülasyonu ve kişiselleştirilmiş kariyer rehberliği ile geleceğini tasarla. Yapay zeka destekli kariyer platformu.",
  keywords: ["kariyer", "cv analizi", "mülakat", "yapay zeka", "iş başvurusu", "kariyer koçu"],
  authors: [{ name: "CareerAI Team" }],
  openGraph: {
    title: "CareerAI - Yapay Zeka Destekli Kariyer Koçu",
    description: "CV analizi, mülakat simülasyonu ve kişiselleştirilmiş kariyer rehberliği ile geleceğini tasarla.",
    type: "website",
    locale: "tr_TR",
    siteName: "CareerAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerAI - Yapay Zeka Destekli Kariyer Koçu",
    description: "CV analizi, mülakat simülasyonu ve kişiselleştirilmiş kariyer rehberliği.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <LandingNavbar />
      <main className="flex-1 pt-24 px-6 md:px-0">
        {children}
      </main>
    </div>
  );
}
