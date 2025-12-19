"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MessageBarChartProps {
  data: { label: string; messages: number }[];
}

export default function MessageBarChart({ data }: MessageBarChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5 shadow-lg shadow-sky-500/10">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">
            Mülakata Göre Mesaj Sayısı
          </h3>
          <p className="text-xs text-slate-500">
            Son mülakatlarındaki etkileşim yoğunluğunu gösterir.
          </p>
        </div>
      </div>
      <div className="h-52 md:h-60">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-600">
            Veri yetersiz.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 40, right: 10, top: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#111827"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={{ stroke: "#1f2937" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={{ stroke: "#1f2937" }}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: 12,
                  border: "1px solid #1f2937",
                  padding: "8px 10px",
                }}
                formatter={(value) => [value, "Mesaj Sayısı"]}
                labelFormatter={(label) =>
                  `Mülakat ${String(label).replace(".", "")}`
                }
              />
              <Bar dataKey="messages" radius={[0, 6, 6, 0]} fill="#38bdf8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
