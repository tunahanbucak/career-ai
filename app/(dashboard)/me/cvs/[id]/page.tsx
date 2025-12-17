import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Sparkles,
  Brain,
  Tag,
  Layers,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Target,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          {(analysis.score ||
            analysis.impact ||
            analysis.brevity ||
            analysis.ats ||
            analysis.style) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {analysis.score !== null && analysis.score !== undefined && (
                <ScoreCard
                  label="Genel Skor"
                  score={analysis.score}
                  icon={<Award className="w-5 h-5" />}
                  color="from-indigo-500 to-purple-500"
                />
              )}
              {analysis.impact !== null && analysis.impact !== undefined && (
                <ScoreCard
                  label="Etki Puanı"
                  score={analysis.impact}
                  icon={<Zap className="w-5 h-5" />}
                  color="from-amber-500 to-orange-500"
                />
              )}
              {analysis.brevity !== null && analysis.brevity !== undefined && (
                <ScoreCard
                  label="Özlülük"
                  score={analysis.brevity}
                  icon={<Target className="w-5 h-5" />}
                  color="from-emerald-500 to-teal-500"
                />
              )}
              {analysis.ats !== null && analysis.ats !== undefined && (
                <ScoreCard
                  label="ATS Uyumu"
                  score={analysis.ats}
                  icon={<BarChart3 className="w-5 h-5" />}
                  color="from-blue-500 to-cyan-500"
                />
              )}
              {analysis.style !== null && analysis.style !== undefined && (
                <ScoreCard
                  label="Dil & Stil"
                  score={analysis.style}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  color="from-pink-500 to-rose-500"
                />
              )}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Brain className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Özeti</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {analysis.summary}
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-900/20 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-amber-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Gelişim Önerileri
                  </h2>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {analysis.suggestion}
                  </div>
                </div>
              </div>
              {(analysis.score || analysis.impact || analysis.brevity) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-emerald-900/20 to-slate-950/90 border border-emerald-900/20 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        Güçlü Yönler
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {(analysis.brevity ?? 0) >= 80 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>Özlü ve anlaşılır ifadeler</span>
                        </li>
                      )}
                      {(analysis.ats ?? 0) >= 80 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>ATS sistemleriyle uyumlu</span>
                        </li>
                      )}
                      {(analysis.style ?? 0) >= 80 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>Profesyonel dil kullanımı</span>
                        </li>
                      )}
                      {(analysis.impact ?? 0) >= 80 && (
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>Etkili başarı vurguları</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-orange-900/20 to-slate-950/90 border border-orange-900/20 rounded-2xl p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-orange-500/10 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        İyileştirilebilir
                      </h3>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {(analysis.brevity ?? 0) < 70 && (
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Daha kısa ve öz ifadeler kullanılabilir</span>
                        </li>
                      )}
                      {(analysis.impact ?? 0) < 70 && (
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Ölçülebilir başarılar eklenebilir</span>
                        </li>
                      )}
                      {(analysis.ats ?? 0) < 70 && (
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Daha fazla sektör anahtar kelimesi</span>
                        </li>
                      )}
                      {(analysis.style ?? 0) < 70 && (
                        <li className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          <span>Dil ve stil iyileştirilebilir</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Tag className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Yetkinlikler</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords && analysis.keywords.length > 0 ? (
                    analysis.keywords.map((k, i) => (
                      <Badge
                        key={i}
                        className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20 text-sm font-normal transition-colors"
                      >
                        #{k}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm">
                      Yetkinlik tespit edilemedi
                    </span>
                  )}
                </div>
              </div>
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

function ScoreCard({
  label,
  score,
  icon,
  color,
}: {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-orange-400";
  };
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
      <div
        className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10 mb-3`}
      >
        {icon}
      </div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-3xl font-black ${getScoreColor(score)}`}>
        {score}
        <span className="text-lg text-slate-500">/100</span>
      </div>
      <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
