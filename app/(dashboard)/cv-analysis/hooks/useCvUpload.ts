import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";
import { Step, AnalysisResult, RecentAnalysis } from "@/types";

interface UseCvUploadProps {
  onAnalysisComplete?: (
    result: AnalysisResult,
    newEntry: RecentAnalysis
  ) => void;
  onLevelUp?: (newLevel: number, levelName: string) => void;
}

export function useCvUpload({
  onAnalysisComplete,
  onLevelUp,
}: UseCvUploadProps = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleUploadAndAnalyze = useCallback(async () => {
    try {
      setError(null);
      setAnalysis(null);
      setStep("idle");

      if (!file) {
        const msg = "Lütfen geçerli bir PDF veya DOCX dosyası seçin.";
        setError(msg);
        toast.error(msg);
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

      if (!uploadRes.ok) {
        throw new Error(
          uploadJson?.error || "Dosya yüklenirken bir hata oluştu."
        );
      }

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

      if (!analyzeRes.ok) {
        throw new Error(
          analyzeJson?.error || "Analiz sırasında bir sorun oluştu."
        );
      }

      setAnalysis(analyzeJson);
      setStep("done");

      if (analyzeJson.isCached) {
        toast.info("Kayıtlı Analiz Bulundu", {
          description:
            "Bu CV daha önce işlendiği için mevcut sonuçlar yüklendi.",
          duration: 4000,
        });
      } else {
        toast.success("CV Analizi Başarıyla Tamamlandı!");
      }

      if (analyzeJson.levelUp && onLevelUp) {
        onLevelUp(analyzeJson.newLevel, analyzeJson.levelName);
      }

      if (onAnalysisComplete) {
        const newEntry: RecentAnalysis = {
          id: crypto.randomUUID(),
          title: uploadJson.title,
          keywords: analyzeJson.analysis?.keywords || [],
          createdAt: new Date().toISOString(),
          cvId: uploadJson.cvId,
        };
        onAnalysisComplete(analyzeJson, newEntry);
      }
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Beklenmedik bir hata oluştu.";
      setError(message);
      toast.error(message);
      setStep("idle");
    } finally {
      setLoading(false);
    }
  }, [file, executeRecaptcha, onAnalysisComplete, onLevelUp]);

  const resetState = useCallback(() => {
    setFile(null);
    setError(null);
    setAnalysis(null);
    setStep("idle");
  }, []);

  return {
    file,
    setFile,
    loading,
    step,
    error,
    analysis,
    handleUploadAndAnalyze,
    resetState,
  };
}
