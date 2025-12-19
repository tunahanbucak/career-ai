import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Sparkles,
  Award,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Layers,
} from "lucide-react";

// Components
import ScoreCard from "./components/ScoreCard";
import AnalysisDetails from "./components/AnalysisDetails";
import Competencies from "./components/Competencies";

export const dynamic = "force-dynamic";

export default async function CVDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/");

  const cv = await prisma.cV.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          summary: true,
          keywords: true,
          suggestion: true,
          score: true,
          impact: true,
          brevity: true,
          ats: true,
          style: true,
          createdAt: true,
        },
      },
    },
  });
  if (!cv) notFound();

  const analysis = cv.analyses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href="/me/cvs"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 mb-3 inline-flex items-center gap-1 transition-colors"
          >
            <ChevronLeft size={16} /> Geri Dön
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {cv.title || "İsimsiz CV"}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {new Date(cv.uploadDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {!analysis ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/50 p-16 text-center">
          <div className="p-6 bg-slate-900/50 rounded-full inline-block mb-4">
            <Sparkles className="h-12 w-12 text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Henüz Analiz Yapılmamış
          </h3>
          <p className="max-w-md mx-auto text-slate-500">
            Bu CV için henüz bir AI analizi oluşturulmamış.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {analysis.score != null && (
              <ScoreCard
                label="Genel Skor"
                score={analysis.score}
                icon={<Award className="w-5 h-5" />}
                color="from-indigo-500 to-purple-500"
              />
            )}
            {analysis.impact != null && (
              <ScoreCard
                label="Etki Puanı"
                score={analysis.impact}
                icon={<Zap className="w-5 h-5" />}
                color="from-amber-500 to-orange-500"
              />
            )}
            {analysis.brevity != null && (
              <ScoreCard
                label="Özlülük"
                score={analysis.brevity}
                icon={<Target className="w-5 h-5" />}
                color="from-emerald-500 to-teal-500"
              />
            )}
            {analysis.ats != null && (
              <ScoreCard
                label="ATS Uyumu"
                score={analysis.ats}
                icon={<BarChart3 className="w-5 h-5" />}
                color="from-blue-500 to-cyan-500"
              />
            )}
            {analysis.style != null && (
              <ScoreCard
                label="Dil & Stil"
                score={analysis.style}
                icon={<CheckCircle2 className="w-5 h-5" />}
                color="from-pink-500 to-rose-500"
              />
            )}
          </div>

          {/* Details Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnalysisDetails analysis={analysis} />
            </div>
            
            <div className="space-y-6">
              <Competencies keywords={analysis.keywords} />
              
              {/* Status Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl text-center">
                <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-4">
                  <Layers className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Analiz Tamamlandı
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  CV&apos;niz başarıyla işlendi
                </p>
                <div className="text-xs text-slate-500 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800">
                  {new Date(analysis.createdAt).toLocaleString("tr-TR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
