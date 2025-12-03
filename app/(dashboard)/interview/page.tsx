"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import type { ChatItem } from "./components/InterviewChat";
import InterviewHeader from "./components/InterviewHeader";
import InterviewChat from "./components/InterviewChat";

export default function InterviewPage() {
  const { data: session, status } = useSession();
  
  const [position, setPosition] = useState<string>("Frontend Developer");
  const [message, setMessage] = useState<string>("");
  const [history, setHistory] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interviewId, setInterviewId] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center text-indigo-500">
        {/* loading spinner */}
      </div>
    );
  }
  
  if (!session || !session.user) {
    redirect("/");
  }

  const startInterview = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, history, start: true, interviewId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "İstek hatası");
      }
      if (data?.reply) {
        setHistory((h) => [...h, { role: "assistant", content: String(data.reply) }]);
      }
      if (data?.interviewId && typeof data.interviewId === "string") {
        setInterviewId(data.interviewId);
      }
    } catch (e: unknown) {
      const msg = typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Beklenmeyen bir hata oluştu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;
    
    try {
      setError(null);
      setMessage("");
      setHistory((h) => [...h, { role: "user", content: text }]);
      setLoading(true);

      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position, history, message: text, interviewId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "İstek hatası");
      }
      setHistory((h) => [...h, { role: "assistant", content: String(data.reply || "") }]);
      if (data?.interviewId && typeof data.interviewId === "string") {
        setInterviewId(data.interviewId);
      }
    } catch (e: unknown) {
      const msg = typeof e === "object" && e !== null && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Beklenmeyen bir hata oluştu.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setHistory([]);
    setError(null);
    setInterviewId(null);
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
        onChangeMessage={setMessage}
        onStart={startInterview}
        onSend={sendMessage}
      />
    </div>
  );
}