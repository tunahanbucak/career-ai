import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/app/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText, Sparkles, Brain, Tag, Code, Download, Share2, Layers, Lightbulb, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const latestAnalysis = cv.analyses[0];

  return (
    <div className="space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <Link href="/me/cvs" className="text-xs font-medium text-slate-500 hover:text-indigo-400 mb-2 inline-flex items-center gap-1 transition-colors">
             <ChevronLeft size={12} /> Tüm CV lerime Dön
          </Link>
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <FileText className="h-6 w-6" />
             </div>
             <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{cv.title || "İsimsiz Doküman"}</h1>
                 <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    Yükleme: {new Date(cv.uploadDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
          </div>
        </div>
        
        <div className="flex gap-3">
            <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300">
                <Share2 size={14} /> Paylaş
            </Button>
            <Button variant="default" size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                <Download size={14} /> PDF Raporu
            </Button>
        </div>
      </div>

      {!latestAnalysis ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center text-slate-500 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 shadow-inner">
                <Sparkles className="h-8 w-8 text-slate-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300">Henüz Analiz Yapılmamış</h3>
            <p className="max-w-xs mx-auto mt-2 text-sm">Bu CV için henüz bir AI analizi oluşturulmamış.</p>
          </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-slate-900/50 border border-slate-800 p-1 h-auto rounded-xl">
                <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 transition-all">
                    <Layers size={16} /> Genel Bakış
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 transition-all">
                    <Lightbulb size={16} /> Gelişim Önerileri
                </TabsTrigger>
                <TabsTrigger value="raw" className="gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg px-4 py-2.5 transition-all">
                    <Code size={16} /> Ham Veri
                </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 focus:outline-none">
                 {/* Summary Card */}
                 <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm shadow-xl">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Brain size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Yapay Zeka Özeti</h2>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-base md:text-lg font-light">
                            {latestAnalysis.summary}
                        </p>
                    </div>
                 </div>

                 {/* Skills Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                <Tag size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-white">Tespit Edilen Yetkinlikler</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                             {latestAnalysis.keywords && latestAnalysis.keywords.length > 0 ? (
                                 latestAnalysis.keywords.map((k, i) => (
                                    <Badge key={i} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 text-sm font-normal transition-colors">
                                        #{k}
                                    </Badge>
                                 ))
                             ) : (
                                 <span className="text-slate-500 text-sm">Özel yetkinlik tespit edilemedi.</span>
                             )}
                        </div>
                    </div>
                    
                    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-6 backdrop-blur-sm flex flex-col justify-center items-center text-center">
                         <div className="h-16 w-16 mb-4 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                             <CheckCircle2 className="h-8 w-8 text-white" />
                         </div>
                         <h3 className="text-lg font-bold text-white mb-1">Analiz Tamamlandı</h3>
                         <p className="text-sm text-slate-400 mb-4">CV&apos;niz başarıyla işlendi ve analiz edildi.</p>
                         <div className="text-xs text-slate-600 bg-slate-900 rounded-full px-3 py-1 border border-slate-800">
                             {new Date(latestAnalysis.createdAt).toLocaleString()}
                         </div>
                    </div>
                 </div>
            </TabsContent>

            <TabsContent value="suggestions" className="focus:outline-none">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-sm overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/50" />
                     <div className="flex items-center gap-3 mb-6">
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <Lightbulb size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-white">Gelişim ve İyileştirme Önerileri</h2>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4">
                        <div className="bg-slate-950/50 rounded-2xl p-6 border border-slate-800/50">
                             {latestAnalysis.suggestion}
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                        <Button variant="ghost" className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10">
                            Bu önerileri uygula <ChevronLeft className="rotate-180 ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="raw" className="focus:outline-none">
                <div className="rounded-xl border border-slate-800 bg-black/40 overflow-hidden">
                    <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center gap-2">
                        <Code size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-300">Ham Metin Çıktısı</span>
                    </div>
                    <div className="p-0">
                        <pre className="p-6 text-xs text-slate-500 whitespace-pre-wrap font-mono leading-relaxed max-h-[500px] overflow-auto custom-scrollbar">
                            {cv.rawText || "(Metin içeriği boş)"}
                        </pre>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}