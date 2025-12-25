import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Bot, Calendar, Award, CheckCircle, Target, Sparkles, MessageSquare, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PrintButton } from "./components/PrintButton";

export const dynamic = "force-dynamic";

export default async function InterviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/");

  const interview = await prisma.interview.findFirst({
    where: { id, userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!interview) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="print:hidden">
        <Link
          href="/me/interviews"
          className="text-sm text-slate-500 hover:text-indigo-400 mb-3 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={16} /> Tüm Mülakatlara Dön
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">
              {interview.position}
            </h1>
            <p className="text-sm text-slate-400 mt-2 flex items-center gap-2">
              <Calendar size={14} />
              {new Date(interview.date).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {interview.isCompleted && (
              <PrintButton />
            )}
            {interview.isCompleted && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Analiz Edilmiş
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block border-b border-slate-800 pb-6 mb-8 text-black">
        <h1 className="text-4xl font-bold mb-2">Mülakat Analiz Raporu</h1>
        <p className="text-xl">{interview.position}</p>
        <p className="text-sm text-slate-600">Tarih: {new Date(interview.date).toLocaleDateString("tr-TR")}</p>
      </div>

      {/* Main Grid - Yeni Layout: Mesajlar üstte, analiz kartları altta dengeli dağılmış */}
      <div className="space-y-6">
        {/* Messages Section - Full Width */}
        <Card className="border-slate-800 bg-slate-900/60 print:bg-white print:text-black print:border-none">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 print:text-black">
              <MessageSquare className="w-5 h-5 text-indigo-400 print:hidden" />
              Mülakat Geçmişi
            </h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar print:max-h-none print:overflow-visible">
              {interview.messages.map((m) => {
                const isAI = m.role === "ASSISTANT";
                return (
                  <div
                    key={m.id}
                    className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center print:hidden ${
                        isAI
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {isAI ? <Bot size={20} /> : <User size={20} />}
                    </div>
                    <div className={`max-w-[85%] space-y-1 ${!isAI ? "text-right" : ""}`}>
                      <div
                        className={`rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                          isAI
                            ? "bg-slate-800/50 text-slate-200 rounded-tl-sm border border-slate-700 print:bg-slate-100 print:text-black print:border-slate-200"
                            : "bg-indigo-600 text-white rounded-tr-sm print:bg-indigo-50 print:text-indigo-900 print:border print:border-indigo-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                      <div className="text-[10px] text-slate-500 px-1 font-mono uppercase">
                        {isAI ? "Mülakatçı" : "Aday"} • {new Date(m.createdAt).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Section - Dengeli Grid Layout */}
        {interview.isCompleted && interview.score !== null ? (
          <div className="space-y-6">
            {/* Score Card - Full Width */}
            <Card className="border-amber-800 bg-gradient-to-br from-amber-900/20 to-slate-900/60 print:bg-white print:text-black print:border-slate-200">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-amber-400 mx-auto mb-3 print:text-amber-600" />
                <p className="text-sm text-slate-400 mb-2 print:text-slate-600">Performans Skoru</p>
                <p className="text-6xl font-black text-white mb-1 print:text-black">{interview.score}</p>
                <p className="text-sm text-slate-500">/ 100</p>
              </CardContent>
            </Card>

            {/* 2 Column Grid for Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary */}
              {interview.summary && (
                <Card className="border-slate-800 bg-slate-900/60 print:bg-white print:text-black print:border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 print:text-black">
                      <Sparkles className="w-5 h-5 text-amber-400 print:hidden" />
                      Genel Değerlendirme
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed print:text-slate-700">
                      {interview.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Cultural Fit */}
              {interview.culturalFit && (
                <Card className="border-indigo-800 bg-indigo-900/20 print:bg-white print:text-black print:border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2 print:text-black">
                      <Users className="w-5 h-5 text-indigo-400 print:hidden" />
                      Kültürel Uyum
                    </h3>
                    <p className="text-sm text-indigo-100 leading-relaxed italic print:text-indigo-900">
                      &quot;{interview.culturalFit}&quot;
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              {interview.strengths && interview.strengths.length > 0 && (
                <Card className="border-emerald-800 bg-emerald-900/20 print:bg-white print:text-black print:border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 print:text-black">
                      <CheckCircle className="w-5 h-5 text-emerald-400 print:hidden" />
                      Güçlü Yönlerin
                    </h3>
                    <ul className="space-y-3">
                      {interview.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-emerald-100 print:text-emerald-900"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Improvements */}
              {interview.improvements && interview.improvements.length > 0 && (
                <Card className="border-orange-800 bg-orange-900/20 print:bg-white print:text-black print:border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 print:text-black">
                      <Target className="w-5 h-5 text-orange-400 print:hidden" />
                      Gelişim Alanları
                    </h3>
                    <ul className="space-y-3">
                      {interview.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-orange-100 print:text-orange-900"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Roadmap - Full Width */}
            {interview.roadmap && interview.roadmap.length > 0 && (
              <Card className="border-amber-800 bg-amber-900/20 print:bg-white print:text-black print:border-slate-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 print:text-black">
                    <GraduationCap className="w-5 h-5 text-amber-400 print:hidden" />
                    Gelişim Yol Haritası
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {interview.roadmap.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 relative p-3 rounded-lg bg-amber-950/20">
                        <div className="flex flex-col items-center print:hidden">
                          <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-[10px] font-bold text-amber-400 z-10">
                            {idx + 1}
                          </div>
                        </div>
                        <p className="text-sm text-amber-100 pt-0.5 print:text-amber-900">
                          <span className="hidden print:inline font-bold mr-2">{idx + 1}.</span>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card className="border-slate-800 bg-slate-900/60 print:hidden">
            <CardContent className="p-6 text-center">
              <p className="text-slate-400 text-sm mb-2">
                Bu mülakat henüz analiz edilmedi.
              </p>
              <p className="text-xs text-slate-500">
                Mülakat sayfasında &quot;Mülakatı Bitir ve Analiz Et&quot; butonuyla analiz yapabilirsiniz.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
