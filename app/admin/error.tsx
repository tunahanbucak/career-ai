"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-sm"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-3">
          Bir Hata Oluştu
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Admin paneli yüklenirken beklenmedik bir sorunla karşılaştık. Lütfen
          tekrar deneyin veya sistem yöneticisi ile görüşün.
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mb-8 p-4 bg-red-950/30 border border-red-500/20 rounded-lg text-left overflow-auto max-h-40">
            <code className="text-xs font-mono text-red-300">
              {error.message || "Bilinmeyen Hata"}
            </code>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            <RotateCcw className="w-4 h-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors border border-slate-700"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
