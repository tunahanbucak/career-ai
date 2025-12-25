"use client";

import { useRef, useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// CV Dosya Yükleme Alanı
// Kullanıcıların PDF veya DOCX formatında CV yüklemesi için sürükle-bırak destekli arayüz
interface UploadZoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
}

// Dosya yükleme ve analiz başlatma component'i
// Drag & drop ile dosya seçimi, dosya tipi kontrolü ve hata gösterimi içerir
export default function UploadZone({
  file,
  setFile,
  loading,
  error,
  onAnalyze,
}: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-slate-700 to-slate-800">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 space-y-8 overflow-hidden">
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
                  <div className="text-slate-500 text-sm mt-1">PDF max 5MB</div>
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
          onClick={onAnalyze}
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
  );
}
