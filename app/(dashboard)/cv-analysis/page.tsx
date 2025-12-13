"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  History,
  FileText,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  Zap,
  Layers,
  Share2,
  Download,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import ScoreGauge from "./components/ScoreGauge";

// --- TİP TANIMLAMALARI ---
// Adım yönetimi için durum tipleri
type Step = "idle" | "uploading" | "analyzing" | "done";

// Geçmiş analizler için veri yapısı
interface AnalysisApiItem {
  id: string;
  title: string | null;
  keywords: string[];
  createdAt: string;
  cvId: string;
}

interface HistoryApiResponse {
  analyses: AnalysisApiItem[];
}

type RecentAnalysis = AnalysisApiItem;

// Analiz sonucu veri yapısı
type AnalysisResult = {
  success: boolean;
  title?: string;
  analysis?: {
    summary: string;
    keywords: string[];
    suggestion: string;
    score?: number; // API'den gelmezse örnek skor
  };
  error?: string;
} | null;

// CV Yükleme ve Analiz Sayfası
export default function CvUploadPage() {
  // State Tanımları
  const [file, setFile] = useState<File | null>(null); // Yüklenen dosya
  const [loading, setLoading] = useState(false); // Yükleme/Analiz işlemi sürüyor mu?
  const [fetchingHistory, setFetchingHistory] = useState(true); // Geçmiş verisi yükleniyor mu?
  const [error, setError] = useState<string | null>(null); // Hata mesajları
  const [step, setStep] = useState<Step>("idle"); // Mevcut işlem adımı
  const [dragOver, setDragOver] = useState(false); // Sürükle-bırak efekti durumu

  const [analysis, setAnalysis] = useState<AnalysisResult>(null); // Analiz sonucu
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]); // Son yüklemeler listesi

  // Dosya yükleme input referansı (gizli input'u tetiklemek için)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // FETCH HISTORY
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/me/history");
        if (!res.ok) throw new Error("Geçmiş yüklenemedi");
        const json = (await res.json()) as HistoryApiResponse;
        if (isMounted) {
          const formattedData: RecentAnalysis[] = (json.analyses || []).map(
            (item) => ({
              id: item.id,
              title: item.title,
              keywords: item.keywords || [],
              createdAt: item.createdAt,
              cvId: item.cvId,
            })
          );
          setRecentAnalyses(formattedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setFetchingHistory(false);
      }
    };
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUploadAndAnalyze = async () => {
    try {
      setError(null);
      setAnalysis(null);
      setStep("idle");

      if (!file) {
        setError("Lütfen geçerli bir PDF veya DOCX dosyası seçin.");
        return;
      }

      setLoading(true);
      setStep("uploading");

      const fd = new FormData();
      fd.append("file", file);

      // 1. Upload
      const uploadRes = await fetch("/api/upload-cv", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(uploadJson?.error || "Yükleme hatası.");

      setStep("analyzing");

      // 2. Analyze
      const analyzeRes = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: uploadJson.rawText,
          title: uploadJson.title,
          cvId: uploadJson.cvId,
        }),
      });
      const analyzeJson = await analyzeRes.json();
      if (!analyzeRes.ok)
        throw new Error(analyzeJson?.error || "Analiz hatası.");

      // Mock Score generation if not present (just for visual demo)
      if (analyzeJson.analysis && !analyzeJson.analysis.score) {
        analyzeJson.analysis.score =
          Math.floor(Math.random() * (95 - 70 + 1)) + 70;
      }

      setAnalysis(analyzeJson);
      setStep("done");

      // Update List
      const newEntry: RecentAnalysis = {
        id: crypto.randomUUID(),
        title: uploadJson.title,
        keywords: analyzeJson.analysis?.keywords || [],
        createdAt: new Date().toISOString(),
        cvId: uploadJson.cvId,
      };
      setRecentAnalyses((prev) => [newEntry, ...prev]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Beklenmedik hata.";
      setError(message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-100px)]">
      {/* LEFT COLUMN: Input & History (Scrollable) */}
      <div className="w-full xl:w-1/2 space-y-8">
        {/* HEADER */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">CV Analizi</h2>
          <p className="text-slate-400">
            Yapay zeka ile CV&apos;ni saniyeler içinde analiz et ve geliştir.
          </p>
        </div>

        {/* UPLOAD CARD */}
        <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-slate-700 to-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 space-y-8 overflow-hidden">
            {/* Drag Area */}
            <div
              className={`
                  relative cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all duration-300
                  ${
                    dragOver
                      ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                      : "border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900"
                  }
                  ${file ? "border-emerald-500/50 bg-emerald-500/5" : ""}
                `}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div
                  className={`h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                    file
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-900 text-indigo-400 shadow-lg shadow-indigo-900/20"
                  }`}
                >
                  {file ? (
                    <CheckCircle2 className="h-10 w-10" />
                  ) : (
                    <UploadCloud className="h-10 w-10" />
                  )}
                </div>
                <div>
                  {file ? (
                    <div className="text-emerald-400 font-bold text-lg">
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <div className="text-slate-200 font-semibold text-lg">
                        Dosyayı Sürükle veya Seç
                      </div>
                      <div className="text-slate-500 text-sm mt-1">
                        PDF max 5MB
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-950/50 border-red-900 text-red-200"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Hata</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleUploadAndAnalyze}
              disabled={loading || !file}
              className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analiz
                  Ediliyor...
                </>
              ) : (
                "Analizi Başlat"
              )}
            </Button>
          </div>
        </div>

        {/* RECENT HISTORY */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" />
              Son Yüklemeler
            </h3>
            <Link
              href="/me/cvs"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
            >
              Tümünü Gör
            </Link>
          </div>

          <div className="space-y-3">
            {fetchingHistory ? (
              [1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-16 w-full rounded-xl bg-slate-800/50"
                />
              ))
            ) : recentAnalyses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Henüz kayıt yok.
              </div>
            ) : (
              recentAnalyses.slice(0, 4).map((item) => (
                <Link
                  href={`/me/cvs/${item.cvId}`}
                  key={item.id}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-800/30 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-slate-200 font-medium truncate group-hover:text-white">
                          {item.title || "İsimsiz CV"}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{" "}
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Results Section (Sticky) */}
      <div className="w-full xl:w-1/2">
        <AnimatePresence mode="wait">
          {!analysis && !loading && step !== "analyzing" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/20"
            >
              <div className="h-40 w-40 rounded-full bg-slate-800/30 flex items-center justify-center mb-6">
                <TrendingUp className="h-20 w-20 text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                Analiz Sonucu Bekleniyor
              </h3>
              <p className="text-slate-500 max-w-sm">
                Sol taraftan CV dosyanı yükleyerek detaylı yetenek analizi,
                skorlama ve geliştirme önerileri al.
              </p>
            </motion.div>
          ) : loading || step === "analyzing" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm space-y-8"
            >
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-white">
                  Analiz Yapılıyor
                </h3>
                <p className="text-slate-400">
                  Yapay zeka CV&apos;nizi inceliyor, lütfen bekleyin...
                </p>
              </div>
            </motion.div>
          ) : analysis ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col"
            >
              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-1 flex flex-col">
                {/* HEADER with Score - Premium Gradient */}
                <div className="relative p-8 pb-12 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="text-center sm:text-left space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase border border-indigo-500/20 backdrop-blur-sm">
                        <Award className="h-3 w-3" />
                        AI Analiz Raporu
                      </div>
                      <h3 className="text-3xl font-black text-white tracking-tight">
                        {analysis.analysis?.score &&
                        analysis.analysis.score >= 85
                          ? "Mükemmel!"
                          : analysis.analysis?.score &&
                            analysis.analysis.score >= 70
                          ? "Çok İyi"
                          : "Geliştirilmeli"}
                      </h3>
                      <p className="text-indigo-200/80 font-medium max-w-xs">
                        CV&apos;niz incelendi ve{" "}
                        {analysis.analysis?.keywords?.length} güçlü anahtar
                        kelime tespit edildi.
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

                {/* TABS CONTENT AREA */}
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
                      {/* TAB: OVERVIEW */}
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

                      {/* TAB: DETAILS (Mock Data for Visuals) */}
                      <TabsContent
                        value="details"
                        className="mt-0 space-y-6 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-500"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              label: "Etki Odaklılık",
                              score: 85,
                              color: "bg-emerald-500",
                            },
                            {
                              label: "Kısalık / Öz",
                              score: 92,
                              color: "bg-indigo-500",
                            },
                            {
                              label: "ATS Uyumu",
                              score: 78,
                              color: "bg-blue-500",
                            },
                            {
                              label: "Dil Bilgisi",
                              score: 95,
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

                        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                              <AlertTriangle
                                size={16}
                                className="text-amber-500"
                              />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-200">
                                Gelişim Alanı: Sayısal Veriler
                              </h5>
                              <p className="text-xs text-slate-500">
                                Başarılarını somutlaştırmak için daha fazla
                                rakam kullan.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                              <Layers size={16} className="text-indigo-500" />
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-slate-200">
                                Format: Modern Düzen
                              </h5>
                              <p className="text-xs text-slate-500">
                                Bölüm başlıkların net ve okunabilir.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* TAB: ACTION PLAN */}
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
                          </Button>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex gap-3">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25"
                    asChild
                  >
                    <Link href="/interview">
                      <Zap className="mr-2 h-4 w-4" /> Simülasyonu Başlat
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="aspect-square p-0 border-slate-700 hover:bg-slate-800 text-slate-400"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Bağlantı kopyalandı!"); // Şimdilik basit alert, sonner varsa toast kullanabiliriz
                    }}
                    title="Paylaş"
                  >
                    <Share2 size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    className="aspect-square p-0 border-slate-700 hover:bg-slate-800 text-slate-400"
                    onClick={() => {
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
                    }}
                    title="Raporu İndir"
                  >
                    <Download size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
