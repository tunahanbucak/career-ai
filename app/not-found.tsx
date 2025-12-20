"use client";

import Link from "next/link";
import { MoveLeft, SearchX } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arkaplan Efektleri */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-slate-800/50 rounded-full blur-xl transform scale-110" />
          <div className="relative bg-slate-900 border border-slate-800 p-8 rounded-full shadow-2xl">
            <SearchX className="w-24 h-24 text-slate-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white">
            Sayfa Bulunamadı
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Aradığınız sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
            Yolunuzu kaybettiyseniz endişelenmeyin, sizi ana sayfaya götürelim.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <MoveLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
