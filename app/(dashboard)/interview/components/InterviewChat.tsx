"use client";

import { useEffect, useRef } from "react";
import { Bot, Loader2, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send, Play } from "lucide-react";

export type ChatItem = { role: "assistant" | "user"; content: string };

type Props = {
  position: string;
  history: ChatItem[];
  message: string;
  loading: boolean;
  error: string | null;
  onChangeMessage: (value: string) => void;
  onStart: () => void;
  onSend: () => void;
};

export default function InterviewChat({
  position,
  history,
  message,
  loading,
  error,
  onChangeMessage,
  onStart,
  onSend,
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
    <div className="flex-1 relative rounded-2xl border border-slate-800 bg-slate-950/50 backdrop-blur-sm overflow-hidden flex flex-col shadow-inner">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
      >
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80 animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/10">
              <Bot className="h-12 w-12 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Hazır mısın?</h2>
            <p className="text-slate-400 max-w-md mb-8">
              <span className="text-indigo-400 font-semibold">{position}</span>{" "}
              pozisyonu için simüle edilmiş bir mülakat başlatılacak. Teknik
              sorulara hazırlıklı ol.
            </p>
            <Button
              onClick={onStart}
              disabled={loading}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 rounded-full shadow-lg shadow-indigo-500/25 transition-all hover:scale-105"
            >
              {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Play className="mr-2 h-5 w-5 fill-current" />
              )}
              Mülakatı Başlat
            </Button>
          </div>
        ) : (
          <>
            {history.map((m, i) => {
              const isAI = m.role === "assistant";
              return (
                <div
                  key={i}
                  className={`flex gap-4 ${
                    isAI ? "justify-start" : "justify-end"
                  } animate-in slide-in-from-bottom-2 duration-300`}
                >
                  {isAI && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mt-1">
                      <Bot size={16} className="text-indigo-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] md:max-w-[75%] space-y-1 ${
                      isAI ? "" : "items-end flex flex-col"
                    }`}
                  >
                    <div
                      className={`px-5 py-3.5 text-sm leading-relaxed shadow-md whitespace-pre-wrap ${
                        isAI
                          ? "bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none"
                          : "bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-indigo-500/10"
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-slate-500 px-1">
                      {isAI ? "Mülakatçı" : "Sen"}
                    </span>
                  </div>

                  {!isAI && (
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mt-1">
                      <User size={16} className="text-indigo-400" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-4 justify-start animate-pulse">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Bot size={16} className="text-indigo-400" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="px-6 pb-2">
          <Alert
            variant="destructive"
            className="bg-red-950/50 border-red-900/50 text-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {history.length > 0 && (
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-xl">
          <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
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
              className="flex-1 bg-slate-900 text-slate-100 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-lg"
              disabled={loading}
              autoComplete="off"
            />
            <Button
              onClick={onSend}
              disabled={loading || !message.trim()}
              size="icon"
              className="h-[46px] w-[46px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 shrink-0 transition-transform active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5 ml-0.5" />
              )}
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-slate-600">
              Enter tuşu ile gönder
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
