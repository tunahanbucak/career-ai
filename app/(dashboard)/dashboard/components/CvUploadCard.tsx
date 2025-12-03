"use client";

import { RefObject } from "react";
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
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";

export type Step = "idle" | "uploading" | "analyzing" | "done";

export type AnalysisState = {
  success: boolean;
  title?: string;
  analysis?: {
    summary: string;
    keywords: string[];
    suggestion: string;
  };
  error?: string;
} | null;

export type CvUploadCardProps = {
  file: File | null;
  dragOver: boolean;
  step: Step;
  loading: boolean;
  error: string | null;
  analysis: AnalysisState;
  rawPreview: string;
  showPreview: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  uploadSectionRef: RefObject<HTMLDivElement | null>;
  setFile: (file: File | null) => void;
  setDragOver: (v: boolean) => void;
  setShowPreview: (v: boolean) => void;
  onUploadAndAnalyze: () => void;
};

export default function CvUploadCard(props: CvUploadCardProps) {
  const {
    file,
    dragOver,
    step,
    loading,
    error,
    analysis,
    rawPreview,
    showPreview,
    fileInputRef,
    uploadSectionRef,
    setFile,
    setDragOver,
    setShowPreview,
    onUploadAndAnalyze,
  } = props;

  return (
    <Card
      ref={uploadSectionRef}
      className="border-slate-800 bg-slate-900/60 backdrop-blur-sm shadow-xl overflow-hidden transition-all duration-500"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UploadCloud className="h-5 w-5 text-indigo-400" />
          AI Destekli CV Analizi
        </CardTitle>
        <CardDescription>
          CV&apos;ni yükle, Gemini AI saniyeler içinde analiz etsin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className={`relative group cursor-pointer rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ease-out
              ${
                dragOver
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.01]"
                  : "border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/50 bg-slate-950/30"
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
              className={`h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
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
                    Dosyayı buraya bırak
                  </div>
                  <div className="text-slate-500 text-sm">
                    veya seçmek için tıkla (PDF, DOCX)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-500/10 border-red-500/50 text-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hata</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-4 text-xs w-full md:w-auto justify-center">
            <StepIndicator active={step !== "idle"} label="Yükleme" number="1" />
            <div className="h-[1px] w-8 bg-slate-800"></div>
            <StepIndicator
              active={step === "analyzing" || step === "done"}
              label="Analiz"
              number="2"
            />
            <div className="h-[1px] w-8 bg-slate-800"></div>
            <StepIndicator
              active={step === "done"}
              label="Sonuç"
              number="3"
            />
          </div>

          <Button
            onClick={onUploadAndAnalyze}
            disabled={loading || !file}
            className="w-full md:w-auto min-w-[200px] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
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

        {step === "analyzing" && (
          <div className="space-y-4 py-8 animate-pulse px-4">
            <Skeleton className="h-4 w-1/3 bg-slate-800" />
            <Skeleton className="h-32 w-full rounded-xl bg-slate-800" />
          </div>
        )}

        {analysis && (
          <div className="mt-8 border-t border-slate-800 pt-6 animate-in fade-in slide-in-from-bottom-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="w-full justify-start bg-transparent p-0 gap-6 border-b border-slate-800 h-auto pb-2">
                <TabsTrigger
                  value="summary"
                  className="data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-2 pb-2 text-slate-400 bg-transparent"
                >
                  Özet
                </TabsTrigger>
                <TabsTrigger
                  value="keywords"
                  className="data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-2 pb-2 text-slate-400 bg-transparent"
                >
                  Anahtar Kelimeler
                </TabsTrigger>
                <TabsTrigger
                  value="suggestion"
                  className="data-[state=active]:text-indigo-400 data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-2 pb-2 text-slate-400 bg-transparent"
                >
                  Öneri
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 bg-slate-950/30 rounded-xl p-6 border border-slate-800/50">
                <TabsContent
                  value="summary"
                  className="mt-0 text-slate-300 text-sm leading-relaxed"
                >
                  {analysis?.analysis?.summary}
                </TabsContent>
                <TabsContent value="keywords" className="mt-0">
                  <div className="flex flex-wrap gap-2">
                    {analysis?.analysis?.keywords?.map((k, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-200"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent
                  value="suggestion"
                  className="mt-0 text-slate-300 text-sm leading-relaxed"
                >
                  {analysis?.analysis?.suggestion}
                </TabsContent>
              </div>
            </Tabs>

            {rawPreview && (
              <div className="mt-6">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1"
                >
                  {showPreview ? "Gizle" : "Ham Metni Göster"}{" "}
                  <ChevronRight
                    className={`h-3 w-3 transition-transform ${
                      showPreview ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {showPreview && (
                  <div className="mt-3 p-4 bg-black/50 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-500 max-h-40 overflow-auto">
                    {rawPreview}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StepIndicator({
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
      className={`flex flex-col items-center gap-1 ${
        active ? "text-indigo-400" : "text-slate-600"
      }`}
    >
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
          active ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-500"
        }`}
      >
        {number}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
}
