"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Zap, Target } from "lucide-react";
import { SkillData } from "@/types";
import Link from "next/link";

type Props = {
  data: SkillData[];
};

export default function SkillsRadarWidget({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -z-10" />

        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
          <Target className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">
          Henüz yetkinlik verisi yok
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          CV analizlerinden yetkinlik verilerini topladıkça burada göreceksin
        </p>
        <Link
          href="/cv-analysis"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          İlk CV&apos;ni Yükle
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-[400px] flex flex-col relative overflow-hidden hover:border-purple-500/20 transition-all duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[80px] -z-10" />

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-purple-400" /> Yetkinlik Analizi
        </h3>
      </div>

      <div className="flex-1 w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <Radar
              name="Senin Profilin"
              dataKey="A"
              stroke="#a855f7"
              strokeWidth={3}
              fill="#a855f7"
              fillOpacity={0.3}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#1e293b",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#a855f7" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center text-xs text-slate-500 mt-2">
        * CV analizlerine göre hesaplanmıştır
      </div>
    </div>
  );
}
