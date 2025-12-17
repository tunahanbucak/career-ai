"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityData {
  date: string;
  cvs: number;
  interviews: number;
}

interface GlobalActivityChartProps {
  data: ActivityData[];
}

export default function GlobalActivityChart({
  data,
}: GlobalActivityChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm p-5 shadow-xl relative overflow-hidden group">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_16px]"></div>
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Sistem Aktivitesi
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Son 30 günlük işlem hacmi (CV & Mülakat)
          </p>
        </div>
      </div>

      <div className="h-[300px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCvs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: "12px",
                border: "1px solid #1e293b",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
              }}
              itemStyle={{ fontSize: "12px", fontWeight: 600 }}
              labelStyle={{
                fontSize: "11px",
                color: "#94a3b8",
                marginBottom: "4px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cvs"
              name="CV Yükleme"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCvs)"
            />
            <Area
              type="monotone"
              dataKey="interviews"
              name="Mülakat Oturumu"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInterviews)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
