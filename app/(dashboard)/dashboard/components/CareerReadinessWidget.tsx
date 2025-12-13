"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CareerReadinessWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 shadow-2xl"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp size={100} className="text-emerald-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Target className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">İşe Hazırlık Seviyesi</h3>
            <p className="text-xs text-slate-400">Genel profil analizi</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-white">65%</span>
            <span className="text-emerald-500 text-sm font-bold mb-1.5">+5% bu hafta</span>
          </div>
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" 
                style={{ width: "65%" }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Hedeflediğin pozisyonlar için profilin güçleniyor.
          </p>
        </div>

        <div className="space-y-3">
             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-sm text-slate-300">Teknik Yetkinlikler</span>
                <span className="text-sm font-bold text-emerald-400">8/10</span>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <span className="text-sm text-slate-300">Mülakat Performansı</span>
                <span className="text-sm font-bold text-amber-400">5/10</span>
             </div>
        </div>
        
        <Link 
            href="/cv-analysis"
            className="mt-6 flex items-center justify-center w-full py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-colors"
        >
            Gelişimi Hızlandır <ChevronRight size={16} className="ml-1" />
        </Link>
      </div>
    </motion.div>
  );
}
