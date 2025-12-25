"use client";

import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

interface WelcomeCardProps {
  userName?: string | null;
  hasAnalyses: boolean;
  hasInterviews: boolean;
}

export default function WelcomeCard({
  userName,
  hasAnalyses,
  hasInterviews,
}: WelcomeCardProps) {
  const isNewUser = !hasAnalyses && !hasInterviews;

  if (!isNewUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 shadow-2xl"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Hoş geldin{userName ? `, ${userName}` : ""}! 👋
          </h2>
        </div>
        <p className="text-white/90 mb-6 leading-relaxed">
          CareerAI&apos;ya katıldığın için teşekkürler! Kariyerini bir üst
          seviyeye taşımak için hazır mısın?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                1. CV Analizi
              </span>
            </div>
            <p className="text-xs text-white/80">
              CV&apos;ni yükle ve AI koçundan detaylı geri bildirim al
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                2. Mülakat Pratiği
              </span>
            </div>
            <p className="text-xs text-white/80">
              Gerçekçi mülakat simülasyonuyla kendini test et
            </p>
          </div>
        </div>
        <Link
          href="/cv-analysis"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-slate-100 transition-all hover:scale-105 shadow-lg"
        >
          İlk Adımı At
          <TrendingUp className="w-5 h-5" />
        </Link>
      </div>
    </motion.div>
  );
}
