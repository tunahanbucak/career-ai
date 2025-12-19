"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm space-y-8"
    >
      <div className="relative">
        <div className="h-32 w-32 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-white">Analiz Yapılıyor</h3>
        <p className="text-slate-400">
          Yapay zeka CV&apos;nizi inceliyor, lütfen bekleyin...
        </p>
      </div>
    </motion.div>
  );
}
