"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import LevelUpModal from "../../../components/modals/LevelUpModal";
import type { ChatItem } from "./components/InterviewChat";
import InterviewHeader from "./components/InterviewHeader";
import InterviewChat from "./components/InterviewChat";

export default function InterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // State Tanımları
  const [position, setPosition] = useState<string>("Frontend Developer"); // Hedef pozisyon
  const [message, setMessage] = useState<string>(""); // Kullanıcının yazdığı anlık mesaj
  const [history, setHistory] = useState<ChatItem[]>([]); // Chat geçmişi
  const [loading, setLoading] = useState(false); // AI yanıtı bekleniyor mu?
  const [error, setError] = useState<string | null>(null); // Hata durumları
  const [interviewId, setInterviewId] = useState<string | null>(null); // Veritabanındaki mülakat ID'si
  const [analyzing, setAnalyzing] = useState(false); // Analiz yapılıyor mu?
  const [analysisComplete, setAnalysisComplete] = useState(false); // Analiz tamamlandı mı?

  // Level Up State
  const [levelUpInfo, setLevelUpInfo] = useState<{
    isOpen: boolean;
    newLevel: number;
    levelName: string;
  }>({ isOpen: false, newLevel: 0, levelName: "" });

  const { executeRecaptcha } = useGoogleReCaptcha();

  // Mülakatı Başlatma Fonksiyonu
  // İlk mesajı AI'dan almak için tetiklenir ("start: true")
  const startInterview = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

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
          position,
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
  }, [position, history, interviewId, executeRecaptcha]);

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

      // Assistant için boş bir balon ekle
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
        {/* Yükleniyor spinner'ı eklenebilir */}
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
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4">
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
