import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import DashboardNavbar from "@/app/components/DashboardNavbar";
import { LayoutProvider } from "@/app/context/LayoutContext";
import DashboardLayoutShell from "@/app/components/DashboardLayoutShell";

// Dashboard Layout: Panelin genel düzeninden sorumludur.
// Sunucu tarafında (Server Component) çalışır ve oturum kontrolü yapar.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Oturum Kontrolü: Kullanıcının giriş yapıp yapmadığını kontrol eder.
  const session = await getServerSession(authOptions);

  // Eğer oturum yoksa anasayfaya yönlendir.
  if (!session || !session.user?.email) {
    redirect("/");
  }

  return (
    // Ana kapsayıcı div: Koyu tema arka planı
    <div className="min-h-screen bg-[#020617] text-slate-100">
      {/* Arka plan efektleri (Blur ve Gradientler) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>
      
      {/* Düzen Sağlayıcısı: Sidebar ve Navbar durumunu yönetir */}
      <LayoutProvider>
          {/* Sol Kenar Çubuğu */}
          <Sidebar user={session.user} />
          {/* Üst Navigasyon Menüsü */}
          <DashboardNavbar user={session.user} />

          {/* Dinamik İçerik Alanı */}
          <DashboardLayoutShell>
            {children}
          </DashboardLayoutShell>
      </LayoutProvider>
    </div>
  );
}
