"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  History,
  FileText,
  Calendar,
} from "lucide-react";

// --- TİP TANIMLAMALARI (Strict Mode) ---

type Step = "idle" | "uploading" | "analyzing" | "done";

// API'den gelen ham veri tipi
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

type AnalysisResult = {
  success: boolean;
  title?: string;
  analysis?: {
    summary: string;
    keywords: string[];
    suggestion: string;
  };
  error?: string;
} | null;

export default function CvUploadPage() {
  // --- STATE ---
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingHistory, setFetchingHistory] = useState(true); // Liste yükleniyor durumu
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rawPreview, setRawPreview] = useState("");

  // Analiz Sonucu
  const [analysis, setAnalysis] = useState<AnalysisResult>(null);

  // Geçmiş Liste
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);

  // --- REFS ---
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // --- 1. DATA FETCHING (Type-Safe) ---
  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/me/history");
        if (!res.ok) throw new Error("Geçmiş yüklenemedi");

        // Burada 'any' yerine tanımladığımız interface'i kullanıyoruz
        const json = (await res.json()) as HistoryApiResponse;

        if (isMounted) {
          // Gelen veriyi map'lerken tip güvenliği sağlıyoruz
          const formattedData: RecentAnalysis[] = (json.analyses || []).map(
            (item) => ({
              id: item.id,
              title: item.title, // null olabilir, interface izin veriyor
              keywords: item.keywords || [],
              createdAt: item.createdAt,
              cvId: item.cvId,
            })
          );
          setRecentAnalyses(formattedData);
        }
      } catch (err) {
        console.error(err);
        // Liste yüklenemezse kullanıcıya kritik hata göstermiyoruz, boş kalıyor.
      } finally {
        if (isMounted) setFetchingHistory(false);
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- 2. UPLOAD & ANALYZE ---
  const handleUploadAndAnalyze = async () => {
    try {
      // Reset States
      setError(null);
      setAnalysis(null);
      setRawPreview("");
      setStep("idle");

      if (!file) {
        setError("Lütfen geçerli bir PDF veya DOCX dosyası seçin.");
        return;
      }

      setLoading(true);
      setStep("uploading");

      const fd = new FormData();
      fd.append("file", file);

      // --- Adım A: Upload ---
      const uploadRes = await fetch("/api/upload-cv", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(
          uploadJson?.error || "Dosya yüklenirken bir sorun oluştu."
        );
      }

      setRawPreview(uploadJson.rawText?.slice(0, 800) || "");
      setStep("analyzing");

      // --- Adım B: Analyze ---
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

      if (!analyzeRes.ok) {
        throw new Error(
          analyzeJson?.error || "Analiz sırasında bir hata oluştu."
        );
      }

      setAnalysis(analyzeJson);
      setStep("done");

      // --- Adım C: Listeyi Optimistik Güncelle ---
      // Yeni yüklenen veriyi listenin başına ekliyoruz (Fetch atmaya gerek yok)
      const newEntry: RecentAnalysis = {
        id: crypto.randomUUID(), // Client tarafında geçici unique ID
        title: uploadJson.title,
        keywords: analyzeJson.analysis?.keywords || [],
        createdAt: new Date().toISOString(),
        cvId: uploadJson.cvId,
      };

      setRecentAnalyses((prev) => [newEntry, ...prev]);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Beklenmedik bir hata oluştu.";
      setError(message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  // --- YARDIMCI: Format Date ---
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  };

  return (
    <Card
      ref={uploadSectionRef}
      className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl overflow-hidden max-w-5xl mx-auto mt-8 transition-all"
    >
      {/* Üst Dekoratif Çizgi */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-white">
          <UploadCloud className="h-6 w-6 text-indigo-400" />
          AI Destekli CV Analizi
        </CardTitle>
        <CardDescription className="text-slate-400">
          Yeni bir CV yükleyin veya geçmiş analizlerinize göz atın.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-10">
        {/* === BÖLÜM 1: UPLOAD AREA === */}
        <section className="space-y-6">
          <div
            className={`
              relative group cursor-pointer rounded-xl border-2 border-dashed p-10 transition-all duration-300
              ${
                dragOver
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.005]"
                  : "border-slate-700/50 hover:border-indigo-500/40 hover:bg-slate-800/40 bg-slate-950/40"
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
              const f = e.dataTransfer.files?.[0];
              if (f) setFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  file
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-900 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white"
                }`}
              >
                {file ? (
                  <CheckCircle2 className="h-8 w-8" />
                ) : (
                  <UploadCloud className="h-8 w-8" />
                )}
              </div>
              <div className="space-y-1">
                {file ? (
                  <div className="text-emerald-400 font-semibold text-lg">
                    {file.name}
                  </div>
                ) : (
                  <>
                    <div className="text-slate-200 font-medium text-lg">
                      Dosyayı buraya bırakın
                    </div>
                    <div className="text-slate-500 text-sm">
                      veya seçmek için tıklayın (PDF, DOCX)
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Hata Bildirimi */}
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-900/20 border-red-500/30 text-red-200"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hata</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Aksiyon Barı & Stepper */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-950/60 p-5 rounded-xl border border-slate-800/60">
            <div className="flex items-center gap-4 text-xs">
              <StepItem active={step !== "idle"} label="Yükleme" number="1" />
              <div className="h-[2px] w-8 bg-slate-800 rounded-full"></div>
              <StepItem
                active={step === "analyzing" || step === "done"}
                label="Analiz"
                number="2"
              />
              <div className="h-[2px] w-8 bg-slate-800 rounded-full"></div>
              <StepItem active={step === "done"} label="Sonuç" number="3" />
            </div>

            <Button
              onClick={handleUploadAndAnalyze}
              disabled={loading || !file}
              className="w-full md:w-auto min-w-[200px] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> İşleniyor...
                </>
              ) : (
                "Analizi Başlat"
              )}
            </Button>
          </div>

          {/* Loading Skeleton */}
          {step === "analyzing" && (
            <div className="space-y-4 py-4 px-2">
              <div className="flex items-center gap-2 text-indigo-400 animate-pulse text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                Yapay zeka CV içeriğini tarıyor...
              </div>
              <Skeleton className="h-40 w-full rounded-xl bg-slate-800/50" />
            </div>
          )}

          {/* Analiz Sonucu Tabları */}
          {analysis && (
            <div className="mt-8 border border-slate-800/50 rounded-xl bg-slate-900/30 p-1 animate-in fade-in slide-in-from-bottom-4">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full justify-start bg-transparent p-0 gap-4 border-b border-slate-800/50 px-4 pt-2">
                  <TabTriggerItem value="summary" label="Özet" />
                  <TabTriggerItem value="keywords" label="Anahtar Kelimeler" />
                  <TabTriggerItem value="suggestion" label="AI Önerisi" />
                </TabsList>

                <div className="p-6">
                  <TabsContent
                    value="summary"
                    className="mt-0 text-slate-300 text-sm leading-7"
                  >
                    {analysis?.analysis?.summary}
                  </TabsContent>
                  <TabsContent value="keywords" className="mt-0">
                    <div className="flex flex-wrap gap-2">
                      {analysis?.analysis?.keywords?.map((k, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                        >
                          #{k}
                        </span>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="suggestion"
                    className="mt-0 text-slate-300 text-sm leading-7"
                  >
                    {analysis?.analysis?.suggestion}
                  </TabsContent>
                </div>
              </Tabs>

              {/* Raw Preview Toggle */}
              {rawPreview && (
                <div className="px-6 pb-4">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  >
                    {showPreview ? "Gizle" : "Ham Metni Göster"}
                    <ChevronRight
                      className={`h-3 w-3 transition-transform ${
                        showPreview ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showPreview && (
                    <div className="mt-2 p-4 bg-black/40 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-500 max-h-40 overflow-auto">
                      {rawPreview}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* === BÖLÜM 2: RECENT UPLOADS (PROFESSIONAL LIST) === */}
        <section className="pt-8 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-200">
              <History className="h-5 w-5 text-indigo-400" />
              Son Yüklemeler
            </h3>
            <Button
              variant="link"
              size="sm"
              asChild
              className="text-indigo-400 hover:text-indigo-300 p-0 h-auto font-normal text-xs"
            >
              <Link href="/me/cvs">Tüm Geçmişi Gör</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-slate-800/60 bg-slate-950/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow className="border-slate-800/60 hover:bg-transparent">
                  <TableHead className="text-slate-400 w-[40%] pl-6">
                    Dosya Adı
                  </TableHead>
                  <TableHead className="text-slate-400 w-[30%]">
                    Tarih
                  </TableHead>
                  <TableHead className="text-slate-400 w-[30%] text-right pr-6">
                    İşlem
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fetchingHistory ? (
                  // Skeleton Loading Rows
                  [1, 2, 3].map((i) => (
                    <TableRow key={i} className="border-slate-800/60">
                      <TableCell className="pl-6">
                        <Skeleton className="h-4 w-32 bg-slate-800" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24 bg-slate-800" />
                      </TableCell>
                      <TableCell className="pr-6">
                        <Skeleton className="h-4 w-16 ml-auto bg-slate-800" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : recentAnalyses.length === 0 ? (
                  <TableRow className="hover:bg-transparent border-slate-800/60">
                    <TableCell
                      colSpan={3}
                      className="text-center py-12 text-slate-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-slate-700" />
                        <p>Henüz analiz edilmiş bir CV bulunmuyor.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  recentAnalyses.slice(0, 5).map((a) => (
                    <TableRow
                      key={a.id}
                      className="group border-slate-800/60 hover:bg-slate-800/30 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-300 pl-6 group-hover:text-white transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-indigo-500/70" />
                          {a.title || "İsimsiz Belge"}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(a.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Link
                          href={`/me/cvs/${a.cvId}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline decoration-indigo-500/30 underline-offset-4 transition-all"
                        >
                          Detayları İncele
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

// --- YARDIMCI BİLEŞENLER (Temiz Tutmak İçin) ---

function StepItem({
  active,
  label,
  number,
}: {
  active: boolean;
  label: string;
  number: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 ${
        active ? "text-indigo-400" : "text-slate-600"
      }`}
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 shadow-lg ${
          active
            ? "bg-indigo-600 text-white shadow-indigo-500/25 scale-110"
            : "bg-slate-800 text-slate-500"
        }`}
      >
        {number}
      </div>
      <span className="text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </span>
    </div>
  );
}

function TabTriggerItem({ value, label }: { value: string; label: string }) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-4 pb-3 text-slate-400 hover:text-slate-200 transition-colors bg-transparent border-b-2 border-transparent"
    >
      {label}
    </TabsTrigger>
  );
}
