import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterviewAnalytics from "./InterviewAnalytics";
import InterviewHistoryList from "./components/InterviewHistoryList";

export const dynamic = "force-dynamic";

export default async function MyInterviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/");

  const interviews = await prisma.interview.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    select: {
      id: true,
      position: true,
      date: true,
      isCompleted: true,
      score: true,
      _count: { select: { messages: true } },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Mülakat Geçmişim
          </h1>
          <p className="text-slate-400">
            AI ile gerçekleştirdiğin mülakat simülasyonları
          </p>
        </div>
        <Link href="/interview">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 h-11 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni Mülakat Başlat
          </Button>
        </Link>
      </div>
      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 py-24 text-center">
          <div className="p-6 bg-slate-900/50 rounded-full mb-6">
            <MessageSquare className="h-14 w-14 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Henüz mülakat yapmadınız
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            AI destekli mülakat simülasyonu ile pratik yapın ve kendinizi
            geliştirin
          </p>
          <Link href="/interview">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 h-11 rounded-xl shadow-lg shadow-purple-500/25">
              İlk Mülakatını Başlat
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <InterviewAnalytics interviews={interviews} />
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Tüm Mülakatlar</h2>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-full">
                {interviews.length}
              </span>
            </div>
            <InterviewHistoryList
              interviews={interviews.map((it) => ({
                id: it.id,
                position: it.position,
                date: it.date instanceof Date ? it.date.toISOString() : it.date,
                isCompleted: it.isCompleted,
                score: it.score,
                _count: it._count,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
