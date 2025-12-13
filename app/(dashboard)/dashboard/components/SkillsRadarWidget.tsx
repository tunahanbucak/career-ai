"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Zap } from "lucide-react";
import { SkillData } from "@/types";

type Props = {
  data: SkillData[];
};

export default function SkillsRadarWidget({ data }: Props) {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-[400px] flex flex-col relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] -z-10" />

        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Yetkinlik Analizi
             </h3>
        </div>

        <div className="flex-1 w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Radar
                        name="Senin Profilin"
                        dataKey="A"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fill="#6366f1"
                        fillOpacity={0.3}
                    />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                        itemStyle={{ color: '#6366f1' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
        
        <div className="text-center text-xs text-slate-500 mt-2">
            * Analiz edilen CV ve mülakat sonuçlarına göre hesaplanmıştır.
        </div>
    </div>
  );
}
