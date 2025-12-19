"use client";

import Link from "next/link";
import { History, FileText, Calendar, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentAnalysis } from "@/types";

interface AnalysisHistoryProps {
  recentAnalyses: RecentAnalysis[];
  fetchingHistory: boolean;
}

export default function AnalysisHistory({
  recentAnalyses,
  fetchingHistory,
}: AnalysisHistoryProps) {
  const formatDate = (dateString: Date | string) => {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "short",
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-400" />
          Son Yüklemeler
        </h3>
        <Link
          href="/me/cvs"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>
      <div className="space-y-3">
        {fetchingHistory ? (
          [1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-16 w-full rounded-xl bg-slate-800/50"
            />
          ))
        ) : recentAnalyses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Henüz kayıt yok.</div>
        ) : (
          recentAnalyses.slice(0, 4).map((item) => (
            <Link
              href={`/me/cvs/${item.cvId}`}
              key={item.id}
              className="block group"
            >
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-800/30 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <div className="text-slate-200 font-medium truncate group-hover:text-white">
                      {item.title || "İsimsiz CV"}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{" "}
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
