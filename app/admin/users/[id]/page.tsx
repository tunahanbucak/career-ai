import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, FileText, MessageSquare, Calendar, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminUserHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // 1. Admin Kontrolü
  const session = await getServerSession(authOptions);
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  if (!session?.user?.email || !adminEmails.includes(session.user.email)) {
    redirect("/");
  }

  // 2. Kullanıcı Verilerini Fetch Et
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      cvs: {
        orderBy: { uploadDate: "desc" },
        include: { analyses: true },
      },
      interviews: {
        orderBy: { date: "desc" },
        include: { _count: { select: { messages: true } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-sm text-slate-500 hover:text-indigo-400 mb-3 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={16} /> Admin Paneline Dön
        </Link>
        <p className="text-sm text-slate-400">
          Bu kullanıcının tüm verileri (CV&apos;ler, analizler, mülakatlar) kalıcı olarak silinecektir.
        </p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">{user.name || "İsimsiz Kullanıcı"}</h1>
            <p className="text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Stats Card */}
        <Card className="bg-slate-900/60 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg">Kullanıcı Özeti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 text-sm">Seviye</span>
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">L{user.level}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 text-sm">Toplam XP</span>
              <span className="text-white font-mono">{user.xp}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 text-sm">Onay Durumu</span>
              {user.approved ? (
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Onaylı</Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Bekliyor</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CV History */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-emerald-400" /> Yüklenen CV&apos;ler
          </h2>
          <div className="grid gap-4">
            {user.cvs.length === 0 ? (
              <p className="text-slate-500 italic">Henüz CV yüklenmemiş.</p>
            ) : (
              user.cvs.map((cv) => (
                <Card key={cv.id} className="bg-slate-900/40 border-slate-800 hover:border-emerald-500/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{cv.title || "İsimsiz CV"}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(cv.uploadDate).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {cv.analyses.length > 0 && (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400">
                            Analiz Var
                          </Badge>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <h2 className="text-xl font-bold text-white flex items-center gap-2 pt-4">
            <MessageSquare className="text-amber-400" /> Mülakat Geçmişi
          </h2>
          <div className="grid gap-4">
            {user.interviews.length === 0 ? (
              <p className="text-slate-500 italic">Henüz mülakat yapılmamış.</p>
            ) : (
              user.interviews.map((interview) => (
                <Card key={interview.id} className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{interview.position}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(interview.date).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 italic">{interview._count.messages} Mesaj</p>
                        {interview.isCompleted && interview.score !== null && (
                          <div className="flex items-center gap-1 text-amber-400 font-bold mt-1">
                            <Award size={14} />
                            {interview.score}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
