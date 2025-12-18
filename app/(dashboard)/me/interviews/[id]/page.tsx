import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Bot, Calendar, Award, CheckCircle, Target, Sparkles, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div>
        <Link
          href="/me/interviews"
          className="text-sm text-slate-500 hover:text-indigo-400 mb-3 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={16} /> Tüm Mülakatlara Dön
        </Link>
        <div className="flex items-center justify-between">
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
          {interview.isCompleted && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Analiz Edilmiş
            </Badge>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages Column */}
        <div className="lg:col-span-2">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                Mülakat Geçmişi
              </h2>
              <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
                {interview.messages.map((m) => {
                  const isAI = m.role === "ASSISTANT";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}
                    >
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${
                          isAI
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        }`}
                      >
                        {isAI ? <Bot size={20} /> : <User size={20} />}
                      </div>
                      <div className={`max-w-[85%] space-y-1`}>
                        <div
                          className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md ${
                            isAI
                              ? "bg-slate-800/50 text-slate-200 rounded-tl-sm border border-slate-700"
                              : "bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/20"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        </div>
                        <div
                          className={`text-xs text-slate-500 px-1 ${
                            isAI ? "text-left" : "text-right"
                          }`}
                        >
                          {new Date(m.createdAt).toLocaleTimeString("tr-TR", {
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
        </div>

        {/* Analysis Column */}
        <div className="lg:col-span-1 space-y-6">
          {interview.isCompleted && interview.score !== null ? (
            <>
              {/* Score Card */}
              <Card className="border-amber-800 bg-gradient-to-br from-amber-900/20 to-slate-900/60">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <p className="text-sm text-slate-400 mb-2">Performans Skoru</p>
                  <p className="text-6xl font-black text-white mb-1">{interview.score}</p>
                  <p className="text-sm text-slate-500">/ 100</p>
                </CardContent>
              </Card>

              {/* Summary */}
              {interview.summary && (
                <Card className="border-slate-800 bg-slate-900/60">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      Genel Değerlendirme
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {interview.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              {interview.strengths && interview.strengths.length > 0 && (
                <Card className="border-emerald-800 bg-emerald-900/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      Güçlü Yönlerin
                    </h3>
                    <ul className="space-y-3">
                      {interview.strengths.map((strength, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-emerald-100"
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
                <Card className="border-orange-800 bg-orange-900/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-400" />
                      Gelişim Alanları
                    </h3>
                    <ul className="space-y-3">
                      {interview.improvements.map((improvement, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-orange-100"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-slate-800 bg-slate-900/60">
              <CardContent className="p-6 text-center">
                <p className="text-slate-400 text-sm mb-2">
                  Bu mülakat henüz analiz edilmedi.
                </p>
                <p className="text-xs text-slate-500">
                  Mülakat sayfasında "Mülakatı Bitir ve Analiz Et" butonuyla analiz yapabilirsiniz.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
