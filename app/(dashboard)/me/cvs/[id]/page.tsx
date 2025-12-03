import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText, Sparkles, Brain, Tag, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CVDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) redirect("/");

  const cv = await prisma.cV.findFirst({
    where: { id: params.id, userId: user.id },
    include: { analyses: { orderBy: { createdAt: "desc" } } },
  });
  if (!cv) notFound();

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <Link href="/me/cvs" className="text-xs text-slate-500 hover:text-indigo-400 mb-2 inline-flex items-center gap-1 transition-colors">
             <ChevronLeft size={12} /> Tüm CV lere Dön
          </Link>
          <h1 className="text-3xl font-bold text-white">{cv.title}</h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
            <FileText size={14} /> Yüklenme: {new Date(cv.uploadDate).toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      {/* ANALİZLER */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
           <Sparkles className="text-indigo-400" size={20} />
           <h2 className="text-xl font-semibold text-white">Yapay Zeka Analizleri</h2>
        </div>
        
        {cv.analyses.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-500">
            Henüz analiz yapılmamış.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {cv.analyses.map((a) => (
            <article key={a.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-lg transition-all hover:border-indigo-500/30">
              <div className="border-b border-slate-800 bg-slate-950/30 px-6 py-4 flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-300">{a.title || "Genel Analiz Raporu"}</span>
                  <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</span>
              </div>
              
              <div className="p-6 space-y-6">
                  {/* Özet */}
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <Brain size={16} className="text-emerald-400" /> Özet Değerlendirme
                     </div>
                     <p className="text-sm text-slate-400 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                        {a.summary}
                     </p>
                  </div>

                  {/* Anahtar Kelimeler */}
                  {Array.isArray(a.keywords) && a.keywords.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <Tag size={16} className="text-blue-400" /> Tespit Edilen Yetkinlikler
                     </div>
                      <div className="flex flex-wrap gap-2">
                        {a.keywords.map((k, i) => (
                          <Badge key={i} variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 font-normal">
                            #{k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Öneri */}
                  <div className="space-y-2">
                     <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <Sparkles size={16} className="text-amber-400" /> Gelişim Önerisi
                     </div>
                     <div className="text-sm text-slate-300 leading-relaxed bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl">
                        {a.suggestion}
                     </div>
                  </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* RAW TEXT (Collapsible) */}
      <RawTextBlock rawText={cv.rawText || ""} />
    </div>
  );
}

// İstemci tarafı etkileşimi için basit bir bileşen
function RawTextBlock({ rawText }: { rawText: string }) {
  return (
    <details className="group rounded-xl border border-slate-800 bg-black/40 overflow-hidden">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-slate-400 hover:bg-slate-800/50 transition-colors select-none">
        <div className="flex items-center gap-2">
           <Code size={16} />
           Ham Metin İçeriği
        </div>
        <span className="text-xs text-indigo-400 group-open:hidden">Göster</span>
        <span className="text-xs text-indigo-400 hidden group-open:block">Gizle</span>
      </summary>
      <div className="border-t border-slate-800 bg-black/60 p-6">
        <pre className="text-xs text-slate-500 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-auto custom-scrollbar">
            {rawText || "(Metin içeriği boş)"}
        </pre>
      </div>
    </details>
  );
}