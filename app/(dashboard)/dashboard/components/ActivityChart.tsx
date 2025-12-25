"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { ActivityData } from "@/types";
import { TrendingUp } from "lucide-react";

type Props = {
  data: ActivityData[];
};

export default function ActivityChart({ data }: Props) {
  const hasData = data.some((d) => d.cv > 0 || d.interview > 0);

  if (!hasData) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center"
      >
        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
          <TrendingUp className="w-12 h-12 text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">
          Henüz aktivite verisi yok
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          CV analizi veya mülakat yaptıkça burada aktivite grafiğini göreceksin
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-xl h-full flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white tracking-tight">
          Aktivite Analizi
        </h3>
        <p className="text-sm text-slate-400">
          Son 7 günlük performans grafiğin.
        </p>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorCv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(10px)",
              }}
              itemStyle={{ fontSize: "12px" }}
              cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="cv"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCv)"
              name="CV Analizi"
            />
            <Area
              type="monotone"
              dataKey="interview"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorInt)"
              name="Mülakat"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
