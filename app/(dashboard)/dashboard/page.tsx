import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getDashboardData } from "@/lib/services/dashboard";

import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import RecentUploadsCard from "./components/RecentUploadsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import InterviewPromoCard from "./components/InterviewPromoCard";
import ActivityChart from "./components/ActivityChart";
import SkillsRadar from "./components/SkillsRadar";
import DailyTipCard from "./components/DailyTipCard";
import RecommendationWidget from "./components/RecommendationWidget";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const { prisma } = await import("@/app/lib/prisma"); 
  
  const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
  });

  if (!dbUser) {
      redirect("/");
  }

  const { stats, recentAnalyses } = await getDashboardData(dbUser.id);

  return (
    <div className="min-h-screen w-full font-sans selection:bg-primary/30 overflow-hidden pb-20">
      
      <main className="relative z-10 h-full w-full max-w-[1920px] mx-auto p-6 lg:p-10">
        <DashboardHeader userName={session.user.name} />

        <StatsGrid
          totalAnalyses={stats.totalAnalyses}
          totalInterviews={stats.totalInterviews}
        />

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content Area (Left/Top) - 2 Cols wide on Desktop */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Chart Section */}
            <div className="h-[340px]">
               <ActivityChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RecommendationWidget />
                <DailyTipCard />
            </div>

            {/* Recent Uploads */}
            <RecentUploadsCard analyses={recentAnalyses} />
          </div>

          {/* Sidebar / Right Column - 1 Col wide */}
          <div className="space-y-6 flex flex-col h-full">
            <QuickActionsCard />
            <SkillsRadar />
            <div className="flex-1">
                <InterviewPromoCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

