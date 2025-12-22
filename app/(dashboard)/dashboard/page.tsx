import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getDashboardData } from "@/lib/services/dashboard";

import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import ActivityChart from "./components/ActivityChart";
import SkillsRadarWidget from "./components/SkillsRadarWidget";
import RecommendedActionsWidget from "./components/RecommendedActionsWidget";
// import RecentUploadsCard from "./components/RecentUploadsCard";
import WelcomeCard from "./components/WelcomeCard";
import ActivityTimeline from "./components/ActivityTimeline";
import ProgressTracker from "./components/ProgressTracker";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const { prisma } = await import("@/lib/prisma");

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      level: true,
      xp: true,
      levelName: true,
      approved: true,
    },
  });

  if (!dbUser) {
    redirect("/");
  }

  const { stats, activityData, skillsData, recentAnalyses, recentInterviews } =
    await getDashboardData(dbUser.id);
  const timelineActivities = [
    ...recentAnalyses.map((a) => ({
      type: "cv" as const,
      title: `CV Analizi: ${a.title}`,
      date: new Date(a.createdAt),
    })),
    ...recentInterviews.map((i) => ({
      type: "interview" as const,
      title: `Mülakat: ${i.position}`,
      date: new Date(i.date),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const isNewUser = stats.totalAnalyses === 0 && stats.totalInterviews === 0;

  return (
    <div className="min-h-screen w-full font-sans selection:bg-primary/30 overflow-hidden pb-20">
      <main className="relative z-10 h-full w-full max-w-[1920px] mx-auto p-6 lg:p-10">
        <DashboardHeader userName={dbUser.name} />
        {isNewUser && (
          <div className="mb-6">
            <WelcomeCard
              userName={dbUser.name}
              hasAnalyses={stats.totalAnalyses > 0}
              hasInterviews={stats.totalInterviews > 0}
            />
          </div>
        )}

        {/* ONAYSIZ KULLANICI UYARISI */}
        {!dbUser.approved && (
          <div className="mb-6 p-6 rounded-lg bg-amber-950/20 border border-amber-800/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-600/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-400 mb-2">⚠️ Admin Onayı Bekleniyor</h3>
                <p className="text-slate-300 mb-3">
                  Hesabınız henüz yönetici tarafından onaylanmadı. CV yükleme, analiz ve mülakat özelliklerini kullanabilmek için admin onayı beklemeniz gerekmektedir.
                </p>
                <p className="text-sm text-slate-400">
                  Onay süreci genellikle 24 saat içinde tamamlanır.
                </p>
              </div>
            </div>
          </div>
        )}

        <StatsGrid
          totalAnalyses={stats.totalAnalyses}
          totalInterviews={stats.totalInterviews}
          activityScore={stats.activityScore}
        />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px]">
                <ActivityChart data={activityData} />
              </div>
              <div className="h-[400px]">
                <SkillsRadarWidget data={skillsData} />
              </div>
            </div>
            {/* <RecentUploadsCard analyses={recentAnalyses || []} /> */}
            <ActivityTimeline activities={timelineActivities} />
          </div>
          <div className="space-y-6">
            <RecommendedActionsWidget />
            <ProgressTracker
              totalAnalyses={stats.totalAnalyses}
              totalInterviews={stats.totalInterviews}
              level={dbUser.level}
              xp={dbUser.xp}
              levelName={dbUser.levelName}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
