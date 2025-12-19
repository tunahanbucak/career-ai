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

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "?";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export default function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-950 p-4 md:p-5 shadow-lg shadow-indigo-500/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Zaman İçinde Aktivite
          </h3>
          <p className="text-xs text-slate-500">
            Son dönemlerde ne kadar aktif olduğunu gösterir.
          </p>
        </div>
      </div>
      <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: -20, right: 0, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="interviewActivity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#1f2937" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={{ stroke: "#1f2937" }}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                borderRadius: 12,
                border: "1px solid #1f2937",
                padding: "8px 10px",
              }}
              labelFormatter={(v) => formatDateLabel(String(v))}
              formatter={(value) => [value, "Mülakat Sayısı"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#interviewActivity)"
              dot={{ r: 3, fill: "#22c55e", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0, fill: "#bbf7d0" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
