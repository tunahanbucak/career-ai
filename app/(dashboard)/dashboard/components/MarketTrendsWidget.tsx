"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MarketTrendsWidget() {
  const trends = [
    { title: "Full Stack Developer", growth: "+%24", type: "Yüksek Talep" },
    { title: "AI Engineer", growth: "+%45", type: "Patlama Yaşıyor" },
    { title: "Data Analyst", growth: "+%18", type: "Stabil Artış" },
  ];

  const popularSkills = ["React", "Next.js", "Python", "AWS", "TypeScript"];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -z-10" />

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Pazar Trendleri
        </h3>
      </div>

      <div className="space-y-6">
        {/* Top Roles */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Öne Çıkan Pozisyonlar
          </p>
          {trends.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-emerald-500/20 transition-colors cursor-default"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  {i + 1}
                </div>
                <span className="font-medium text-slate-200">{t.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-sm font-bold">
                  {t.growth}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Skills */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Aranan Yetkinlikler
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSkills.map((s, i) => (
              <Badge
                key={i}
                variant="outline"
                className="bg-slate-950/50 border-slate-700 text-slate-400 hover:text-white hover:border-emerald-500/50 transition-colors cursor-default"
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
