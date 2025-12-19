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
