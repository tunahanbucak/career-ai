"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LevelUpModal from "../../../components/modals/LevelUpModal";
import type { ChatItem } from "./components/InterviewChat";
import InterviewHeader from "./components/InterviewHeader";
import InterviewChat from "./components/InterviewChat";

export default function InterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State Tanımları
  const [position, setPosition] = useState<string>("Frontend Developer");
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Auto-start'ın tekrar tekrar çalışmasını önlemek için ref
  const hasAutoStarted = useRef(false);

  // Auto-Start Transition State
  const [isAutoStarting, setIsAutoStarting] = useState(false);

  // Level Up State
  const [levelUpInfo, setLevelUpInfo] = useState<{
    isOpen: boolean;
    newLevel: number;
    levelName: string;
  }>({ isOpen: false, newLevel: 0, levelName: "" });

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Mülakatı Başlatma Fonksiyonu
  const startInterview = useCallback(
    async (positionOverride?: string) => {
      try {
        setError(null);
        setLoading(true);

        const activePosition = positionOverride || position;

        // reCAPTCHA Token
        let recaptchaToken = "";
        if (executeRecaptcha) {
          recaptchaToken = await executeRecaptcha("start_interview");
        }

        // API isteği gönder
        const res = await fetch("/api/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            position: activePosition,
            history,
            start: true,
            interviewId,
            recaptchaToken,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data?.error || "İstek hatası");
        }

        const newId = res.headers.get("X-Interview-Id");
        if (newId) setInterviewId(newId);

        // AI yanıtını stream olarak oku
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let aiContent = "";

        // Assistant için mesajı başlat
        setHistory((h) => [...h, { role: "assistant", content: "" }]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            aiContent += chunk;

            // Son mesajı güncelle
            setHistory((h) => {
              const next = [...h];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                last.content = aiContent;
              }
              return next;
            });
          }
        }
      } catch (e: unknown) {
        const msg =
          typeof e === "object" && e !== null && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Beklenmeyen bir hata oluştu.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [position, history, interviewId, executeRecaptcha]
  );

  // URL Query Parametrelerini Kontrol Et ve Otomatik Başlat
  useEffect(() => {
    if (!searchParams || hasAutoStarted.current) return;

    const queryPos = searchParams.get("position");
    const autoStart = searchParams.get("autoStart") === "true";

    if (queryPos) {
      setPosition(queryPos); // State'i güncelle (UI için)
    }

    if (autoStart && queryPos) {
      hasAutoStarted.current = true;
      setIsAutoStarting(true);
      // State güncellemesi asenkron olduğu için, direkt queryPos'u gönderiyoruz
      startInterview(queryPos).finally(() => {
        // Mülakat başladığında overlay'i kaldır
        setTimeout(() => setIsAutoStarting(false), 2000); // 2 saniye beklet ki animasyon görünsün
      });
    }
  }, [searchParams, startInterview]);

  const sendMessage = useCallback(async () => {
    const text = message.trim();
    if (!text) return;

    try {
      setError(null);
      setMessage("");
      setHistory((h) => [...h, { role: "user", content: text }]);
      setLoading(true);

      // reCAPTCHA Token
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("send_message");
      }

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          history,
          message: text,
          interviewId,
          recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "İstek hatası");
      }

      const newId = res.headers.get("X-Interview-Id");
      if (newId) setInterviewId(newId);

      // AI yanıtını stream olarak oku
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let aiContent = "";

      // Assistant için mesajı başlat
      setHistory((h) => [...h, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          aiContent += chunk;

          // Son mesajı güncelle
          setHistory((h) => {
            const next = [...h];
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              last.content = aiContent;
            }
            return next;
          });
        }
      }
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Beklenmeyen bir hata oluştu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [message, position, history, interviewId, executeRecaptcha]);

  // Oturum yükleniyorsa bekleme ekranı göster
  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center text-indigo-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Oturum yoksa ana sayfaya yönlendir
  if (!session || !session.user) {
    redirect("/");
  }

  const resetChat = () => {
    setHistory([]);
    setError(null);
    setInterviewId(null);
    setAnalyzing(false);
    setAnalysisComplete(false);
  };

  // Mülakatı Bitir ve Analiz Et
  const completeInterview = async () => {
    if (!interviewId) {
      setError("Mülakat ID bulunamadı.");
      return;
    }

    // Minimum mesaj kontrolü (en az 10 mesaj = 5 soru-cevap)
    if (history.length < 10) {
      setError("Analiz için en az 5 soru-cevap gerekli.");
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);

      // reCAPTCHA Token
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("analyze_interview");
      }

      const res = await fetch("/api/interview/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, recaptchaToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Analiz hatası");
      }

      // Başarılı - mülakat detay sayfasına yönlendir
      setAnalysisComplete(true);
      setTimeout(() => {
        router.push(`/me/interviews/${interviewId}`);
      }, 1500);
    } catch (e: unknown) {
      const msg =
        typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Analiz sırasında bir hata oluştu.";
      setError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 relative">
      {isAutoStarting && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center rounded-3xl animate-in fade-in duration-500">
          <div className="w-20 h-20 mb-6 relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-ping" />
            <div className="relative z-10 w-full h-full bg-slate-900 rounded-full border-2 border-indigo-500 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Mülakat Hazırlanıyor
          </h2>
          <p className="text-indigo-300 font-medium animate-pulse">
            CV&apos;nizdeki yetkinlikler analiz ediliyor...
          </p>
          <div className="mt-8 flex gap-2">
            <Badge
              variant="outline"
              className="text-slate-400 border-slate-700 h-8 px-3"
            >
              {position}
            </Badge>
            <Badge
              variant="outline"
              className="text-emerald-400 border-emerald-900/50 bg-emerald-900/20 h-8 px-3"
            >
              CV Entegre Edildi
            </Badge>
          </div>
        </div>
      )}

      <InterviewHeader
        position={position}
        setPosition={setPosition}
        canReset={history.length > 0}
        onReset={resetChat}
      />
      <InterviewChat
        position={position}
        history={history}
        message={message}
        loading={loading}
        error={error}
        analyzing={analyzing}
        analysisComplete={analysisComplete}
        canComplete={history.length >= 10 && interviewId !== null}
        onChangeMessage={setMessage}
        onStart={startInterview}
        onSend={sendMessage}
        onComplete={completeInterview}
      />
      <LevelUpModal
        isOpen={levelUpInfo.isOpen}
        onClose={() => setLevelUpInfo((p) => ({ ...p, isOpen: false }))}
        newLevel={levelUpInfo.newLevel}
        levelName={levelUpInfo.levelName}
      />
    </div>
  );
}
