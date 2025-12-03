"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

import DashboardHeader from "./components/DashboardHeader";
import StatsGrid from "./components/StatsGrid";
import CvUploadCard, {
  type Step,
  type AnalysisState,
} from "./components/CvUploadCard";
import RecentUploadsCard, {
  type RecentAnalysis,
} from "./components/RecentUploadsCard";
import QuickActionsCard from "./components/QuickActionsCard";
import InterviewPromoCard from "./components/InterviewPromoCard";

const DashboardPage = () => {
  const { data: session, status } = useSession();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLDivElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [rawPreview, setRawPreview] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data Types
  const [analysis, setAnalysis] = useState<AnalysisState>(null);

  type HistoryResponse = {
    analyses: Array<{
      id: string;
      title: string | null;
      keywords: string[];
      createdAt: string;
      cvId: string;
    }>;
    interviews: Array<{
      id: string;
      position: string;
      date: string;
      _count?: { messages?: number };
    }>;
  };
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [recentInterviews, setRecentInterviews] = useState<
    Array<{ id: string; position: string; date: string; count: number }>
  >([]);

  // Fetch Data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/me/history");
        if (res.ok) {
          const json: HistoryResponse = await res.json();
          const ra = (json.analyses || []).map((a) => ({
            id: a.id,
            title: a.title ?? null,
            keywords: a.keywords ?? [],
            createdAt: a.createdAt,
            cvId: a.cvId,
          }));
          const ri = (json.interviews || []).map((i) => ({
            id: i.id,
            position: i.position,
            date: i.date,
            count: i._count?.messages ?? 0,
          }));
          setRecentAnalyses(ra);
          setRecentInterviews(ri);
        }
      } catch {}
    })();
  }, []);

  // Auth Check
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617] text-slate-200">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-indigo-500" />
        <span>Yükleniyor...</span>
      </div>
    );
  }
  if (!session || !session.user) {
    redirect("/");
  }

  // --- ACTIONS ---

  const handleScrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    // Hafif bir highlight efekti verelim
    setTimeout(() => fileInputRef.current?.click(), 800);
  };

  const handleFeedback = () => {
    setToastMessage("Geri bildiriminiz için teşekkürler! Ekibimiz inceliyor.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSupport = () => {
    window.location.href = "mailto:destek@careerai.com?subject=Yardım Talebi";
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleUploadAndAnalyze = async () => {
    try {
      setError(null);
      setAnalysis(null);
      setRawPreview("");
      setStep("idle");
      if (!file) {
        setError("Lütfen bir PDF veya DOCX dosyası seçin.");
        return;
      }
      setLoading(true);
      setStep("uploading");

      const fd = new FormData();
      fd.append("file", file);

      const uploadRes = await fetch("/api/upload-cv", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson?.error || "Yükleme hatası");

      setRawPreview(uploadJson.rawText?.slice(0, 800) || "");
      setStep("analyzing");

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
        throw new Error(analyzeJson?.error || "Analiz hatası");

      setAnalysis(analyzeJson);
      setStep("done");

      // Listeyi güncelle (UX için)
      const newAnalysis = {
        id: Math.random().toString(), // Geçici ID
        title: uploadJson.title,
        keywords: analyzeJson.analysis?.keywords || [],
        createdAt: new Date().toISOString(),
        cvId: uploadJson.cvId,
      };
      setRecentAnalyses((prev) => [newAnalysis, ...prev]);
    } catch (e: unknown) {
      const message =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Hata oluştu.";
      setError(message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden pb-20">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-5">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* ARKA PLAN EFEKTİ */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      <main className="relative z-10 h-full w-full p-4 lg:p-8 max-w-[1920px]">
        <DashboardHeader
          onSupport={handleSupport}
          onScrollToUpload={handleScrollToUpload}
        />

        <StatsGrid
          totalAnalyses={recentAnalyses.length}
          totalInterviews={recentInterviews.length}
        />

        {/* ANA GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <CvUploadCard
              file={file}
              dragOver={dragOver}
              step={step}
              loading={loading}
              error={error ?? ""}
              analysis={analysis}
              rawPreview={rawPreview}
              showPreview={showPreview}
              fileInputRef={fileInputRef}
              uploadSectionRef={uploadSectionRef}
              setFile={setFile}
              setDragOver={setDragOver}
              setShowPreview={setShowPreview}
              onUploadAndAnalyze={handleUploadAndAnalyze}
            />

            <RecentUploadsCard analyses={recentAnalyses} />
          </div>

          <div className="space-y-6">
            <QuickActionsCard
              onFeedback={handleFeedback}
              onSupport={handleSupport}
              onLogout={handleLogout}
            />

            <InterviewPromoCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
