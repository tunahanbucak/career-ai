"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Step,
  AnalysisResult,
  RecentAnalysis,
  HistoryApiResponse,
} from "@/types";

import UploadZone from "./components/UploadZone";
import AnalysisHistory from "./components/AnalysisHistory";
import AnalysisResultView from "./components/AnalysisResultView";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import LevelUpModal from "../../../components/modals/LevelUpModal";

export default function CvUploadPage() {
  // State Tanımları
  const [file, setFile] = useState<File | null>(null); // Seçilen dosya
  const [loading, setLoading] = useState(false); // Yükleme durumu
  const [fetchingHistory, setFetchingHistory] = useState(true); // Geçmiş çekiliyor mu?
  const [error, setError] = useState<string | null>(null); // Hata mesajı
  const [step, setStep] = useState<Step>("idle"); // İşlem adımı (idle/uploading/analyzing/done)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null); // AI analiz sonucu
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]); // Geçmiş analizler

  const [levelUpInfo, setLevelUpInfo] = useState<{
    isOpen: boolean;
    newLevel: number;
    levelName: string;
  }>({ isOpen: false, newLevel: 0, levelName: "" });

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Kullanıcının daha önce yaptığı analizleri API'den çek
  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/me/history");
        if (!res.ok) throw new Error("Geçmiş yüklenemedi");
        const json = (await res.json()) as HistoryApiResponse;
        if (isMounted) {
          setRecentAnalyses(json.analyses || []);
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

  const handleUploadAndAnalyze = useCallback(async () => {
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

      const uploadRes = await fetch("/api/upload-cv", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(uploadJson?.error || "Yükleme hatası.");

      setStep("analyzing");

      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("analyze_cv");
      }

      const analyzeRes = await fetch("/api/analyze-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText: uploadJson.rawText,
          title: uploadJson.title,
          cvId: uploadJson.cvId,
          recaptchaToken,
        }),
      });
      const analyzeJson = await analyzeRes.json();
      if (!analyzeRes.ok)
        throw new Error(analyzeJson?.error || "Analiz hatası.");

      setAnalysis(analyzeJson);
      setStep("done");

      if (analyzeJson.levelUp) {
        setLevelUpInfo({
          isOpen: true,
          newLevel: analyzeJson.newLevel,
          levelName: analyzeJson.levelName,
        });
      }
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
  }, [file, executeRecaptcha]);

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-100px)]">
      <div className="w-full xl:w-1/2 space-y-8 ">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">CV Analizi</h2>
          <p className="text-slate-400">
            Yapay zeka ile CV&apos;ni saniyeler içinde analiz et ve geliştir.
          </p>
        </div>
        <UploadZone
          file={file}
          setFile={setFile}
          loading={loading}
          error={error}
          onAnalyze={handleUploadAndAnalyze}
        />
        <AnalysisHistory
          recentAnalyses={recentAnalyses}
          fetchingHistory={fetchingHistory}
        />
      </div>
      <div className="w-full xl:w-1/2">
        <AnimatePresence mode="wait">
          {!analysis && !loading && step !== "analyzing" ? (
            <EmptyState key="empty" />
          ) : loading || step === "analyzing" ? (
            <LoadingState key="loading" />
          ) : analysis ? (
            <AnalysisResultView key="result" analysis={analysis} />
          ) : null}
        </AnimatePresence>
      </div>
      <LevelUpModal
        isOpen={levelUpInfo.isOpen}
        onClose={() => setLevelUpInfo((p) => ({ ...p, isOpen: false }))}
        newLevel={levelUpInfo.newLevel}
        levelName={levelUpInfo.levelName}
      />
    </div>
  );
}
