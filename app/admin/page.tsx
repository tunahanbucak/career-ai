import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import RoleBasedGuard from "@/components/shared/RoleBasedGuard";

// Sub-components
import AdminStats from "./components/AdminStats";
import { DataCard } from "./components/AdminTables";
import GlobalActivityChart from "./components/GlobalActivityChart";
import AdminHeader from "./components/AdminHeader";
import AdminSearch from "./components/AdminSearch";
import CVTable from "./components/CVTable";
import AnalysisTable from "./components/AnalysisTable";
import InterviewTable from "./components/InterviewTable";

// Types
import {
  AdminCV,
  AdminCVAnalysis,
  AdminInterview,
  AdminStatsData,
} from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  // 1. Auth & Admin Control
  const session = await getServerSession(authOptions);
  
  // Eğer oturum yoksa RoleBasedGuard göster (Giriş yapması gerektiğini belirtir)
  if (!session || !session.user?.email) {
    return (
      <RoleBasedGuard 
        title="Giriş Yapılmadı" 
        description="Bu sayfayı görüntülemek için lütfen yönetici hesabınızla giriş yapın." 
      />
    );
  }

  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  // Eğer emaili admin listesinde yoksa RoleBasedGuard göster
  if (admins.length === 0 || !admins.includes(session.user.email.toLowerCase())) {
     return <RoleBasedGuard />;
  }

  // 2. Data Fetching (Stats)
  const [usersCount, cvsCount, analysesCount, interviewsCount, messagesCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.cV.count(),
      prisma.cVAnalysis.count(),
      prisma.interview.count(),
      prisma.interviewMessage.count(),
    ]);

  const stats: AdminStatsData = {
    users: usersCount,
    cvs: cvsCount,
    analyses: analysesCount,
    interviews: interviewsCount,
    messages: messagesCount,
  };

  // 3. Activity Chart Preparation
  const [chartCvs, chartInterviews] = await Promise.all([
    prisma.cV.findMany({
      select: { uploadDate: true },
      orderBy: { uploadDate: "desc" },
      take: 100,
    }),
    prisma.interview.findMany({
      select: { date: true },
      orderBy: { date: "desc" },
      take: 100,
    }),
  ]);

  const activityMap = new Map<
    string,
    { date: string; cvs: number; interviews: number }
  >();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    activityMap.set(key, {
      date: d.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
      cvs: 0,
      interviews: 0,
    });
  }
  chartCvs.forEach((c) => {
    const key = new Date(c.uploadDate).toISOString().slice(0, 10);
    if (activityMap.has(key)) activityMap.get(key)!.cvs += 1;
  });
  chartInterviews.forEach((i) => {
    const key = new Date(i.date).toISOString().slice(0, 10);
    if (activityMap.has(key)) activityMap.get(key)!.interviews += 1;
  });

  // 4. Tables Data Fetching
  const q = (searchParams?.q || "").trim();
  const pageIndex = Math.max(1, Number(searchParams?.page || 1));
  const pageSize = 10;
  const skip = (pageIndex - 1) * pageSize;

  const cvWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { user: { email: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};
  const analysisWhere = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { cv: { title: { contains: q, mode: "insensitive" as const } } },
          {
            cv: {
              user: { email: { contains: q, mode: "insensitive" as const } },
            },
          },
        ],
      }
    : {};
  const interviewWhere = q
    ? {
        OR: [
          { position: { contains: q, mode: "insensitive" as const } },
          { user: { email: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const [cvTotal, analysisTotal, interviewTotal] = await Promise.all([
    prisma.cV.count({ where: cvWhere }),
    prisma.cVAnalysis.count({ where: analysisWhere }),
    prisma.interview.count({ where: interviewWhere }),
  ]);

  const [recentCVs, recentAnalyses, recentInterviews] = (await Promise.all([
    prisma.cV.findMany({
      where: cvWhere,
      orderBy: { uploadDate: "desc" },
      skip,
      take: pageSize,
      include: { user: { select: { email: true } } },
    }),
    prisma.cVAnalysis.findMany({
      where: analysisWhere,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      include: {
        cv: { select: { title: true, user: { select: { email: true } } } },
      },
    }),
    prisma.interview.findMany({
      where: interviewWhere,
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
      include: {
        user: { select: { email: true } },
        messages: { select: { id: true } },
      },
    }),
  ])) as [AdminCV[], AdminCVAnalysis[], AdminInterview[]];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black" />
      </div>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-10">
        <AdminHeader email={session.user.email} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3">
            <AdminStats counts={stats} />
          </div>
        </div>

        <GlobalActivityChart data={Array.from(activityMap.values())} />

        <AdminSearch query={q} />

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          <DataCard
            title="Son Yüklenen CV'ler"
            total={cvTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="emerald"
          >
            <CVTable data={recentCVs} />
          </DataCard>

          <DataCard
            title="Son Analizler"
            total={analysisTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="purple"
          >
            <AnalysisTable data={recentAnalyses} />
          </DataCard>
        </div>

        <section>
          <DataCard
            title="Mülakat Oturumları"
            total={interviewTotal}
            page={pageIndex}
            pageSize={pageSize}
            query={q}
            accentColor="amber"
          >
            <InterviewTable data={recentInterviews} />
          </DataCard>
        </section>
      </div>
    </div>
  );
}
