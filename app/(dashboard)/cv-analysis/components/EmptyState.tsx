"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/20"
    >
      <div className="h-40 w-40 rounded-full bg-slate-800/30 flex items-center justify-center mb-6">
        <TrendingUp className="h-20 w-20 text-slate-700" />
      </div>
      <h3 className="text-xl font-bold text-slate-300 mb-2">
        Analiz Sonucu Bekleniyor
      </h3>
      <p className="text-slate-500 max-w-sm">
        Sol taraftan CV dosyanı yükleyerek detaylı yetenek analizi, skorlama ve
        geliştirme önerileri al.
      </p>
    </motion.div>
  );
}
