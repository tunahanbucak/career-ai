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
      _count: { select: { messages: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Mülakatlarım
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            AI ile gerçekleştirdiğin mülakat simülasyonları.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        >
          <Link href="/interview">
            <Plus className=" h-4 w-4" /> Yeni Mülakat Başlat
          </Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 py-20 text-center">
          <div className="rounded-full bg-slate-900 p-6 mb-4 shadow-lg shadow-emerald-500/10">
            <MessageSquare className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-300">
            Henüz mülakat yapmadınız
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">
            İlk simülasyonunuzu başlatın ve deneyim kazanın.
          </p>
        </div>
      ) : (
        <>
          <InterviewAnalytics interviews={interviews} />

          <div className="pt-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-1 bg-emerald-500 rounded-full" />
              <h2 className="text-xl font-bold text-white">
                Geçmiş Mülakatlar
              </h2>
            </div>
            <InterviewHistoryList
              interviews={interviews.map((it) => ({
                id: it.id,
                position: it.position,
                date: it.date instanceof Date ? it.date.toISOString() : it.date,
                _count: it._count,
              }))}
            />
          </div>
        </>
      )}
    </div>
  );
}
