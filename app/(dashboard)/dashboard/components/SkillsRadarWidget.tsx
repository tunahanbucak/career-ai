"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
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
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="60%"
            data={data}
            margin={{ top: 15, right: 35, bottom: 15, left: 35 }}
          >
            <PolarGrid
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth={0.5}
            />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <Radar
              name="Yetkinlikler"
              dataKey="A"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="#8b5cf6"
              fillOpacity={0.5}
              dot={{ r: 3, fill: "#a78bfa", strokeWidth: 0 }}
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
