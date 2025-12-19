"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompetenciesProps {
  keywords: string[] | null;
}

export default function Competencies({ keywords }: CompetenciesProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <Tag className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Yetkinlikler</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords && keywords.length > 0 ? (
          keywords.map((k, i) => (
            <Badge
              key={i}
              className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/20 text-sm font-normal transition-colors"
            >
              #{k}
            </Badge>
          ))
        ) : (
          <span className="text-slate-500 text-sm">
            Yetkinlik tespit edilemedi
          </span>
        )}
      </div>
    </div>
  );
}
