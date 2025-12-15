"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar } from "lucide-react";
import Link from "next/link";

interface DashboardHeaderProps {
  userName?: string | null;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Günaydın"
      : currentHour < 18
      ? "İyi günler"
      : "İyi akşamlar";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        {" "}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-black text-white">
              {greeting}
              {userName && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  , {userName}
                </span>
              )}
              ! 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-1">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{formattedDate}</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Link
            href="/cv-analysis"
            className="group px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Yeni CV Analizi
            </span>
          </Link>

          <Link
            href="/interview"
            className="px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white font-semibold transition-all backdrop-blur-sm"
          >
            Mülakat Başlat
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent origin-left"
      />
    </div>
  );
}
