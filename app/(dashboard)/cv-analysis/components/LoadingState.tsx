"use client";

import { motion } from "framer-motion";
import { Loader2, FileText, Brain, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  { icon: FileText, label: "CV Okunuyor", color: "text-blue-400" },
  { icon: Brain, label: "AI Analiz Yapıyor", color: "text-purple-400" },
  { icon: CheckCircle2, label: "Sonuçlar Hazırlanıyor", color: "text-emerald-400" },
];

export default function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        // Son adıma ulaştıysa orada kal, döngüye girme
        if (prev >= steps.length - 1) return prev;
        return prev + 1;
      });
    }, 2500); // 2.5 saniyede bir adım
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center p-12 rounded-3xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700/50 backdrop-blur-sm space-y-8"
    >
      {/* Animated spinner */}
      <div className="relative">
        <motion.div 
          className="h-32 w-32 rounded-full border-4 border-slate-800 border-t-indigo-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-pulse" />
        </div>
      </div>

      {/* Progress steps */}
      <div className="space-y-4 w-full max-w-sm">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isActive ? 1 : isDone ? 0.8 : 0.4,
                x: 0,
                scale: isActive ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-slate-800/50 border border-slate-700' : ''
              }`}
            >
              <div className={`p-2 rounded-lg transition-all ${
                isDone ? 'bg-emerald-500/20' : isActive ? 'bg-indigo-500/20' : 'bg-slate-800'
              }`}>
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Icon className={`h-5 w-5 ${isActive ? s.color : 'text-slate-500'}`} />
                )}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                isDone ? 'text-emerald-400 line-through' : isActive ? 'text-white' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
              {isDone && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Loading text */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">
          {step === 0 && "CV Okunuyor..."}
          {step === 1 && "AI Analiz Yapıyor..."}
          {step === 2 && "Neredeyse Hazır!"}
        </h3>
        <p className="text-slate-400">
          Yapay zeka CV&apos;nizi inceliyor, lütfen bekleyin...
        </p>
      </div>
    </motion.div>
  );
}
