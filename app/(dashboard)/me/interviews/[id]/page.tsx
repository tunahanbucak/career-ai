import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Bot, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InterviewDetailPage({
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

  const interview = await prisma.interview.findFirst({
    where: { id: params.id, userId: user.id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!interview) notFound();

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="flex-shrink-0 pb-6 border-b border-slate-800 mb-6">
        <Link
          href="/me/interviews"
          className="text-xs text-slate-500 hover:text-indigo-400 mb-2 inline-flex items-center gap-1 transition-colors"
        >
          <ChevronLeft size={12} /> Tüm Mülakatlara Dön
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {interview.position}
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Bot size={14} className="text-emerald-400" />
              AI Mülakat Simülasyonu
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />{" "}
                {new Date(interview.date).toLocaleDateString("tr-TR")}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6 rounded-2xl border border-slate-800 bg-slate-950/30 p-6 shadow-inner">
        {interview.messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm">
            Bu mülakatta kayıtlı mesaj bulunmuyor.
          </div>
        )}
        {interview.messages.map((m) => {
          const isAI = m.role === "ASSISTANT";
          return (
            <div
              key={m.id}
              className={`flex gap-4 ${isAI ? "" : "flex-row-reverse"}`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  isAI
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                }`}
              >
                {isAI ? <Bot size={18} /> : <User size={18} />}
              </div>
              <div className={`max-w-[80%] space-y-1`}>
                <div
                  className={`rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-md ${
                    isAI
                      ? "bg-slate-800/50 text-slate-200 rounded-tl-none border border-slate-700"
                      : "bg-indigo-600 text-white rounded-tr-none shadow-indigo-500/20"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                <div
                  className={`text-[10px] text-slate-500 px-1 ${
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
    </div>
  );
}
