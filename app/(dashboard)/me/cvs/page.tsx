import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CvAnalytics from "./CvAnalytics";
import CvHistoryList from "./components/CvHistoryList";

export const dynamic = "force-dynamic";

export default async function MyCVsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/");

  const cvs = await prisma.cV.findMany({
    where: { userId: user.id },
    orderBy: { uploadDate: "desc" },
    select: {
      id: true,
      title: true,
      uploadDate: true,
      analyses: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: {
          summary: true,
          keywords: true,
          createdAt: true,
        },
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            CV Geçmişim
          </h1>
          <p className="text-slate-400">
            Yüklediğin ve analiz edilen tüm özgeçmişlerin
          </p>
        </div>
        <Link href="/cv-analysis">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 h-11 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Yeni CV Yükle
          </Button>
        </Link>
      </div>
      {cvs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 py-24 text-center">
          <div className="p-6 bg-slate-900/50 rounded-full mb-6">
            <FileText className="h-14 w-14 text-slate-600" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Henüz CV yüklemediniz
          </h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Yapay zeka destekli analiz için ilk CV&apos;nizi yükleyin ve kariyer
            yolculuğunuza başlayın
          </p>
          <Link href="/cv-analysis">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-6 h-11 rounded-xl shadow-lg shadow-indigo-500/25">
              İlk CV&apos;ni Yükle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <CvAnalytics cvs={cvs} />
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Tüm Dosyalar</h2>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-xs font-semibold rounded-full">
                {cvs.length}
              </span>
            </div>
            <CvHistoryList
              cvs={cvs.map((c) => ({
                id: c.id,
                title: c.title,
                uploadDate:
                  c.uploadDate instanceof Date
                    ? c.uploadDate.toISOString()
                    : c.uploadDate,
                analysis: c.analyses[0] || null,
              }))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
