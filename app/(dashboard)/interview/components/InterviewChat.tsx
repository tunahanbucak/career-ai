"use client";

import { useEffect, useRef } from "react";
import {
  Bot,
  Loader2,
  User,
  Send,
  Play,
  AlertCircle,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export type ChatItem = { role: "assistant" | "user"; content: string };

type Props = {
  position: string;
  history: ChatItem[];
  message: string;
  loading: boolean;
  error: string | null;
  analyzing?: boolean;
  analysisComplete?: boolean;
  canComplete?: boolean;
  onChangeMessage: (value: string) => void;
  onStart: () => void;
  onSend: () => void;
  onComplete?: () => void;
};

export default function InterviewChat({
  position,
  history,
  message,
  loading,
  error,
  analyzing = false,
  analysisComplete = false,
  canComplete = false,
  onChangeMessage,
  onStart,
  onSend,
  onComplete,
}: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history, loading]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [loading]);

  return (
    <div className="flex-1 relative rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth"
      >
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full flex flex-col items-center justify-center text-center p-8"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full" />
              <div className="h-28 w-28 relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-2xl">
                <Bot className="h-14 w-14 text-indigo-400" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Hazır mısın?</h2>
            <p className="text-slate-400 max-w-md mb-10 text-lg leading-relaxed">
              <span className="text-indigo-400 font-bold">{position}</span>{" "}
              pozisyonu için teknik mülakat simülasyonu başlatılacak.
            </p>
            <Button
              onClick={onStart}
              disabled={loading}
              size="lg"
              className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-semibold shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all hover:scale-105"
            >
              {loading ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-3 h-5 w-5 fill-current" />
              )}
              Mülakatı Başlat
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((m, i) => {
              const isAI = m.role === "assistant";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-5 ${
                    isAI ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAI && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mt-1 shadow-lg">
                      <Bot size={20} className="text-indigo-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] md:max-w-[75%] space-y-1 ${
                      isAI ? "" : "items-end flex flex-col"
                    }`}
                  >
                    <div
                      className={`px-6 py-4 text-base leading-relaxed shadow-lg whitespace-pre-wrap relative overflow-hidden ${
                        isAI
                          ? "bg-slate-900/80 border border-slate-800 text-slate-200 rounded-3xl rounded-tl-sm backdrop-blur-md"
                          : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-3xl rounded-tr-sm shadow-indigo-500/20"
                      }`}
                    >
                      {isAI && (
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                      )}
                      {m.content}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 px-1 uppercase tracking-wider opacity-60">
                      {isAI ? "AI Mülakatçı" : "Sen"}
                    </span>
                  </div>
                  {!isAI && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500/30 flex items-center justify-center mt-1 shadow-lg">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        {loading &&
          (history.length === 0 ||
            history[history.length - 1].role === "user" ||
            (history[history.length - 1].role === "assistant" &&
              history[history.length - 1].content === "")) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex gap-5 justify-start items-end"
            >
              <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg mb-1">
                <Bot size={20} className="text-indigo-400" />
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5 h-[54px]">
                <span className="text-xs font-semibold text-indigo-400 mr-2 animate-pulse">
                  Yazıyor
                </span>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
      </div>
      {error && (
        <div className="px-6 pb-4">
          <Alert
            variant="destructive"
            className="bg-red-950/30 border-red-900/50 text-red-200 backdrop-blur-sm"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      {history.length > 0 && (
        <div className="p-4 md:p-6 bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-2xl">
          <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => onChangeMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading) onSend();
                  }
                }}
                placeholder="Cevabınızı buraya yazın..."
                className="relative block w-full bg-slate-900 text-slate-100 placeholder:text-slate-500 border border-slate-800 rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-900/80 transition-all shadow-xl"
                disabled={loading}
                autoComplete="off"
              />
            </div>
            <Button
              onClick={onSend}
              disabled={loading || !message.trim()}
              size="icon"
              className="h-[58px] w-[58px] rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 shrink-0 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6 ml-1" />
              )}
            </Button>
          </div>
          {canComplete && onComplete && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                onClick={onComplete}
                disabled={analyzing || analysisComplete}
                className="h-12 px-8 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analiz Yapılıyor...
                  </>
                ) : analysisComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Analiz Tamamlandı!
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Mülakatı Bitir ve Analiz Et
                  </>
                )}
              </Button>
            </div>
          )}
          <div className="text-center mt-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-600">
              AI Powered • Career Simulation
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
