import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ChevronRight, Plus, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InterviewAnalytics from "./InterviewAnalytics";

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
            <Plus className="mr-2 h-4 w-4" /> Yeni Mülakat Başlat
          </Link>
        </Button>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/50 py-20 text-center">
          <div className="rounded-full bg-slate-900 p-4">
            <MessageSquare className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-slate-300">
            Henüz mülakat yapmadınız
          </h3>
          <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">
            İlk simülasyonunuzu başlatın ve deneyim kazanın.
          </p>
        </div>
      ) : (
        <>
          <InterviewAnalytics interviews={interviews} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.map((it) => (
              <Link
                key={it.id}
                href={`/me/interviews/${it.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <UserCircle2 size={20} />
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium px-2 py-1 rounded-full bg-slate-950 border border-slate-800">
                      {new Date(it.date).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {it.position}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Simülasyon Kaydı
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MessageSquare size={12} /> {it._count.messages} Mesaj
                  </div>
                  <div className="text-xs font-medium text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    İncele <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
