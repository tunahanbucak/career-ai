"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { RecentAnalysis, HistoryApiResponse } from "@/types";

import UploadZone from "./components/UploadZone";
import AnalysisHistory from "./components/AnalysisHistory";
import AnalysisResultView from "./components/AnalysisResultView";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import LevelUpModal from "../../../components/modals/LevelUpModal";
import { useCvUpload } from "./hooks/useCvUpload";

export default function CvUploadPage() {
  const [fetchingHistory, setFetchingHistory] = useState(true);
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);

  const [levelUpInfo, setLevelUpInfo] = useState<{
    isOpen: boolean;
    newLevel: number;
    levelName: string;
  }>({ isOpen: false, newLevel: 0, levelName: "" });

  // Custom Hook Entegrasyonu
  const {
    file,
    setFile,
    loading,
    step,
    error,
    analysis,
    handleUploadAndAnalyze,
  } = useCvUpload({
    onAnalysisComplete: (result, newEntry) => {
      setRecentAnalyses((prev) => [newEntry, ...prev]);
    },
    onLevelUp: (newLevel, levelName) => {
      setLevelUpInfo({
        isOpen: true,
        newLevel,
        levelName,
      });
    },
  });

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

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-100px)]">
        <div className="w-full xl:w-1/2 space-y-6 lg:space-y-8">
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
    </div>
  );
}
