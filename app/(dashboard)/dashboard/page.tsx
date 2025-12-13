import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getDashboardData } from "@/lib/services/dashboard";

import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
// import QuickActionsCard from "./components/QuickActionsCard"; // Removed as per request
import ActivityChart from "./components/ActivityChart";
import IndustryInsightsWidget from "./components/IndustryInsightsWidget";
import CareerReadinessWidget from "./components/CareerReadinessWidget";
import RecommendedActionsWidget from "./components/RecommendedActionsWidget";
import SkillsRadarWidget from "./components/SkillsRadarWidget";
import MarketTrendsWidget from "./components/MarketTrendsWidget";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const { prisma } = await import("@/app/lib/prisma");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true, // Header için gerekli
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  const { stats } = await getDashboardData(dbUser.id);

  return (
    <div className="min-h-screen w-full font-sans selection:bg-primary/30 overflow-hidden pb-20">
      <main className="relative z-10 h-full w-full max-w-[1920px] mx-auto p-6 lg:p-10">
        <DashboardHeader userName={dbUser.name} />

        <StatsGrid
          totalAnalyses={stats.totalAnalyses}
          totalInterviews={stats.totalInterviews}
        />

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Kolon 1: Ana Grafikler ve İstatistikler (3 birim genişlik) */}
          <div className="xl:col-span-3 space-y-6">
            {/* Üst Kısım: Aktivite ve Radar Yan Yana */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Aktivite Grafiği (2 birim) */}
              <div className="lg:col-span-2 h-[400px]">
                <ActivityChart />
              </div>
              {/* Yetkinlik Radarı (1 birim) */}
              <div className="h-[400px]">
                <SkillsRadarWidget />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndustryInsightsWidget />
              <CareerReadinessWidget />
            </div>

            {/* Eski RecentUploadsCard Yorum Satırı
            <RecentUploadsCard analyses={recentAnalyses || []} />
            */}
          </div>

          {/* Kolon 2: Sağ Sidebar (1 birim genişlik) */}
          <div className="space-y-6 flex flex-col h-full">
            <div className="flex-none">
              <RecommendedActionsWidget />
            </div>

            <div className="flex-1">
              <MarketTrendsWidget />
            </div>

            {/* Eski InterviewPromoCard Yorum Satırı
            <div className="flex-1">
                <InterviewPromoCard />
            </div>
            */}
          </div>
        </div>
      </main>
    </div>
  );
}
