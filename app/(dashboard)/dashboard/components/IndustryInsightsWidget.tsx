"use client";

import {
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { month: "Oca", value: 2400 },
  { month: "Şub", value: 3200 },
  { month: "Mar", value: 2800 },
  { month: "Nis", value: 3600 },
  { month: "May", value: 4200 },
  { month: "Haz", value: 4800 },
  { month: "Tem", value: 5400 },
];

export default function IndustryInsightsWidget() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 shadow-xl shadow-indigo-500/5 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-500">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-700" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Sektör Analizleri
            </h3>
            <p className="text-xs text-slate-400">
              Yazılım sektörü genel görünümü
            </p>
          </div>
        </div>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors bg-indigo-500/5 px-2 py-1 rounded-lg border border-indigo-500/10 hover:bg-indigo-500/10">
          Detaylar <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 hover:border-indigo-500/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">
              Talep Artışı
            </span>
          </div>
          <div className="text-xl font-bold text-white">+%24</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">
            Geçen yıla göre
          </div>
        </div>
        <div className="bg-slate-950/50 rounded-2xl p-4 border border-slate-800/50 hover:border-indigo-500/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-slate-400 font-medium">
              Ort. Maaş
            </span>
          </div>
          <div className="text-xl font-bold text-white">₺65K+</div>
          <div className="text-[10px] text-amber-400 font-medium mt-1">
            Mid-Level Dev
          </div>
        </div>
      </div>

      <div className="h-32 w-full relative z-10">
        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> İstihdam Trendi (2024)
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
