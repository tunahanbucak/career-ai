"use client";

import Link from "next/link";
import { RecentAnalysis } from "@/types";
import { FileText, ArrowRight, Sparkles, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  analyses: RecentAnalysis[];
};

export default function RecentUploadsCard({ analyses }: Props) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-[80px]" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
              <FileText className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Son CV Analizleri</h3>
              <p className="text-xs text-slate-400">Yüklediğin son dosyalar</p>
            </div>
          </div>
          
          <Link 
            href="/me/cvs" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20 transition-all"
          >
            Tümü
            <ArrowRight size={14} />
          </Link>
        </div>
        
        {/* Content */}
        <div className="space-y-3">
          {analyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20"
            >
              <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                <FileText size={32} className="text-slate-600" />
              </div>
              <h4 className="text-base font-semibold text-slate-300 mb-2">
                Henüz CV analizi yok
              </h4>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                İlk CV&apos;ni yükleyerek yapay zeka destekli analizini başlat
              </p>
              <Link 
                href="/cv-analysis"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/50 hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                İlk CV&apos;ni Yükle
              </Link>
            </motion.div>
          ) : (
            analyses.slice(0, 5).map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 p-4 hover:border-indigo-500/30 hover:bg-slate-900/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate">
                      {a.title || "İsimsiz CV Analizi"}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(a.createdAt).toLocaleDateString("tr-TR", { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/me/cvs/${a.cvId}`}
                  className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex-shrink-0"
                >
                  İncele
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
