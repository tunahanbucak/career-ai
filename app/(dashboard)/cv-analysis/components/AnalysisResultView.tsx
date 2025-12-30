"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award,
  FileText,
  Target,
  AlertTriangle,
  Layers,
  Lightbulb,
  Zap,
  ChevronRight,
  Share2,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ScoreGauge from "./ScoreGauge";
import { AnalysisResult } from "@/types";

interface AnalysisResultViewProps {
  analysis: NonNullable<AnalysisResult>;
}

export default function AnalysisResultView({
  analysis,
}: AnalysisResultViewProps) {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bağlantı kopyalandı!", {
      description: "Analiz raporunu artık paylaşabilirsin.",
    });
  };

  const handleDownload = () => {
    const text = `CV ANALİZ RAPORU\n\nBaşlık: ${
      analysis.title || "İsimsiz"
    }\nSkor: ${analysis.analysis?.score}\n\nÖzet:\n${
      analysis.analysis?.summary
    }\n\nÖneri:\n${analysis.analysis?.suggestion}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv-analiz-raporu.txt";
    a.click();
    toast.success("Rapor indirildi", {
      description: "Analiz detayları metin dosyası olarak cihazına kaydedildi.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col relative">
        <div className="relative p-8 pb-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute top-6 right-6 flex gap-2 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 transition-colors"
              onClick={handleShare}
              title="Paylaş"
            >
              <Share2 size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full h-10 w-10 transition-colors"
              onClick={handleDownload}
              title="Raporu İndir"
            >
              <Download size={20} />
            </Button>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8 mt-2">
            <div className="text-center sm:text-left space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase border border-indigo-500/20 backdrop-blur-sm">
                <Award className="h-3 w-3" />
                AI Analiz Raporu
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">
                {analysis.analysis?.score && analysis.analysis.score >= 85
                  ? "Mükemmel!"
                  : analysis.analysis?.score && analysis.analysis.score >= 70
                  ? "Çok İyi"
                  : "Geliştirilmeli"}
              </h3>
              <p className="text-indigo-200/80 font-medium max-w-xs">
                CV&apos;niz incelendi ve {analysis.analysis?.keywords?.length}{" "}
                güçlü anahtar kelime tespit edildi.
              </p>
            </div>
            <div className="flex-shrink-0 bg-slate-950/50 p-2 rounded-full border border-indigo-500/20 shadow-xl shadow-indigo-900/20">
              <ScoreGauge
                score={analysis.analysis?.score || 75}
                color={
                  (analysis.analysis?.score || 75) >= 80
                    ? "#10b981"
                    : (analysis.analysis?.score || 75) >= 60
                    ? "#818cf8"
                    : "#f59e0b"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex-1 bg-slate-950/30 -mt-6 rounded-t-3xl border-t border-slate-800/50 backdrop-blur-sm relative z-20">
          <Tabs
            defaultValue="overview"
            className="w-full flex-1 flex flex-col h-full"
          >
            <div className="px-6 pt-6">
              <TabsList className="w-full grid grid-cols-3 bg-slate-900/80 p-1 border border-slate-800 rounded-xl">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg text-xs font-semibold"
                >
                  Genel Bakış
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg text-xs font-semibold"
                >
                  Detaylar
                </TabsTrigger>
                <TabsTrigger
                  value="action"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg text-xs font-semibold"
                >
                  Yol Haritası
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex-1 p-6 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <TabsContent
                value="overview"
                className="mt-0 space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText size={16} /> Özet
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-800/30 border border-slate-800 text-slate-300 text-sm leading-relaxed shadow-inner">
                    {analysis.analysis?.summary}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Target size={16} /> Öne Çıkanlar
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.analysis?.keywords?.map((k, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold shadow-sm"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent
                value="details"
                className="mt-0 space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Etki Odaklılık",
                      score: analysis.analysis?.details?.impact || 0,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Kısalık / Öz",
                      score: analysis.analysis?.details?.brevity || 0,
                      color: "bg-indigo-500",
                    },
                    {
                      label: "ATS Uyumu",
                      score: analysis.analysis?.details?.ats || 0,
                      color: "bg-blue-500",
                    },
                    {
                      label: "Dil Bilgisi / Stil",
                      score: analysis.analysis?.details?.style || 0,
                      color: "bg-purple-500",
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800"
                    >
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs text-slate-400 font-medium">
                          {metric.label}
                        </span>
                        <span className="text-lg font-bold text-white">
                          {metric.score}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${metric.color} rounded-full`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {(() => {
                  const details = analysis.analysis?.details || {
                    impact: 0,
                    brevity: 0,
                    ats: 0,
                    style: 0,
                  };
                  const metrics = [
                    {
                      key: "impact",
                      val: details.impact,
                      label: "Etki Odaklılık",
                      msg: "Başarılarını somutlaştırmak için daha fazla rakam (%, ₺) kullan.",
                    },
                    {
                      key: "brevity",
                      val: details.brevity,
                      label: "Kısalık / Öz",
                      msg: "Cümlelerini daha kısa, net ve vurucu hale getir.",
                    },
                    {
                      key: "ats",
                      val: details.ats,
                      label: "ATS Uyumu",
                      msg: "İlanlardaki anahtar kelimelere CV'nde daha çok yer ver.",
                    },
                    {
                      key: "style",
                      val: details.style,
                      label: "Dil ve Stil",
                      msg: "Daha profesyonel ve kurumsal bir dil kullanmalısın.",
                    },
                  ];
                  const weakest = metrics.reduce((prev, curr) =>
                    curr.val < prev.val ? curr : prev
                  );
                  const score = analysis.analysis?.score || 0;
                  let formatStatus = {
                    title: "Format: Standart",
                    msg: "Genel düzenin kabul edilebilir seviyede.",
                  };
                  if (score >= 85)
                    formatStatus = {
                      title: "Format: Mükemmel",
                      msg: "Tasarım ve okunabilirlik harika, aynen devam.",
                    };
                  else if (score >= 70)
                    formatStatus = {
                      title: "Format: Modern",
                      msg: "Bölüm başlıkların net, akış gayet anlaşılır.",
                    };
                  else if (score < 50)
                    formatStatus = {
                      title: "Format: Karışık",
                      msg: "Daha sade ve okunabilir bir şablon denemelisin.",
                    };

                  return (
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <AlertTriangle size={16} className="text-amber-500" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-200">
                            Gelişim Alanı: {weakest.label}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {weakest.msg}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                          <Layers size={16} className="text-indigo-500" />
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-slate-200">
                            {formatStatus.title}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {formatStatus.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>
              <TabsContent
                value="action"
                className="mt-0 space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-5">
                  <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Lightbulb size={16} /> Ana Öneri
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {analysis.analysis?.suggestion}
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">
                    Sonraki Adımlar
                  </h4>
                  <Button
                    variant="outline"
                    className="w-full justify-between h-auto py-4 px-4 border-slate-700 bg-slate-800/30 hover:bg-slate-800 text-left group"
                    asChild
                  >
                    <Link
                      href={`/interview?position=${encodeURIComponent(
                        analysis.analysis?.keywords?.[0] ||
                          "Yazılım Geliştirici"
                      )}&autoStart=true`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Zap size={16} className="text-emerald-500" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                            Mülakat Simülasyonu Başlat
                          </div>
                          <div className="text-xs text-slate-500">
                            Bu CV ile mülakata gir
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-slate-600 group-hover:text-emerald-500 transition-colors"
                      />
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
