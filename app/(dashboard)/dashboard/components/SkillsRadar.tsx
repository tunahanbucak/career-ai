"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { subject: "Teknik", A: 120, fullMark: 150 },
  { subject: "İletişim", A: 98, fullMark: 150 },
  { subject: "Liderlik", A: 86, fullMark: 150 },
  { subject: "Problem Çözme", A: 99, fullMark: 150 },
  { subject: "Analitik", A: 85, fullMark: 150 },
  { subject: "Dil", A: 65, fullMark: 150 },
];

export default function SkillsRadar() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Yetenek Haritası</h3>
          <p className="text-sm text-slate-400">Analizlere göre profilin</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="65%" 
            data={data}
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
          >
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Radar
              name="My Skills"
              dataKey="A"
              stroke="#818cf8"
              strokeWidth={3}
              fill="#6366f1"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
