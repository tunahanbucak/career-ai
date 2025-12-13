"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Calendar, Search, ArrowUpRight, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisData {
  summary: string;
  keywords: string[];
  createdAt: Date;
}

interface CvItem {
  id: string;
  title: string | null;
  uploadDate: string | Date;
  analysis?: AnalysisData | null;
}

interface CvHistoryListProps {
  cvs: CvItem[];
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CvHistoryList({ cvs }: CvHistoryListProps) {
  const [term, setTerm] = useState("");

  const filtered = cvs.filter((c) =>
    (c.title?.toLowerCase() || "").includes(term.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Dosya adı ile ara..."
            className="w-full h-12 bg-transparent text-sm text-slate-200 pl-11 pr-4 focus:outline-none placeholder:text-slate-600 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 text-xs text-slate-500 border-t sm:border-t-0 sm:border-l border-slate-800 w-full sm:w-auto justify-center sm:justify-start">
          <Clock className="h-3 w-3" />
          <span>{filtered.length} Kayıt</span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
          <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Sonuç bulunamadı.</p>
          <p className="text-slate-600 text-sm">
            Arama teriminizi değiştirmeyi deneyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((cv, i) => (
              <motion.div
                key={cv.id}
                variants={item}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Link href={`/me/cvs/${cv.id}`} className="group block h-full">
                  <div className="relative h-full bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/60 p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/80 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between overflow-hidden">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-lg">
                          <FileText className="h-6 w-6" />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-bold text-slate-200 mb-1 line-clamp-1 group-hover:text-white transition-colors"
                            title={cv.title || ""}
                          >
                            {cv.title || "İsimsiz Doküman"}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                            <Calendar className="h-3 w-3" />
                            {new Date(cv.uploadDate).toLocaleDateString(
                              "tr-TR",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-slate-600 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Summary & Tags */}
                    {cv.analysis && (
                      <div className="relative z-10 space-y-4">
                        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {cv.analysis.summary}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {cv.analysis.keywords.slice(0, 3).map((k, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-300 text-[10px] font-medium border border-indigo-500/20"
                            >
                              #{k}
                            </span>
                          ))}
                          {cv.analysis.keywords.length > 3 && (
                            <span className="px-2 py-1 rounded-md bg-slate-800/50 text-slate-500 text-[10px] font-medium border border-slate-800">
                              +{cv.analysis.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {!cv.analysis && (
                      <div className="relative z-10 mt-4 p-3 rounded-xl bg-slate-800/30 border border-slate-800/50 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs text-slate-400">
                          Analiz verisi bekleniyor veya yok.
                        </span>
                      </div>
                    )}

                    {/* Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
