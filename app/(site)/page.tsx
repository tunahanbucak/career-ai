import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";

import HeroSection from "./components/HeroSection";
import DashboardPreview from "./components/DashboardPreview";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FAQSection from "./components/FAQSection";
import SiteFooter from "./components/SiteFooter";

// Ana Sayfa (Landing Page) Bileşeni
// Sunucu tarafında (Server Component) render edilir.
export default async function Home() {
  // Kullanıcı oturumu kontrolü
  const session = await getServerSession(authOptions);

  // Eğer kullanıcı zaten giriş yapmışsa, doğrudan panele (dashboard) yönlendir.
  if (session) redirect("/dashboard");

  return (
    // Landing sayfası ana kapsayıcısı ve arka plan efektleri
    <div className="relative min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
      <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
        <div className="absolute right-0 top-0 -z-10 h-[310px] w-[310px] rounded-full bg-purple-500 opacity-20 blur-[100px] translate-x-1/2" />
      </div>

      <main className="pt-32 pb-20">
        <HeroSection />{/* Karşılama Bölümü */}
        <DashboardPreview />{/* Panel Önizleme */}
        <FeaturesSection />{/* Özellikler */}
        <HowItWorksSection />{/* Nasıl Çalışır */}
        <FAQSection />{/* Sıkça Sorulan Sorular */}
        <SiteFooter />{/* Alt Bilgi */}
      </main>
    </div>
  );
}
