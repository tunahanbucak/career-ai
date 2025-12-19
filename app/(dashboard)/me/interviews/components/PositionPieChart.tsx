"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#06b6d4",
  "#a855f7",
  "#facc15",
];

interface PositionPieChartProps {
  data: { name: string; value: number }[];
}

export default function PositionPieChart({ data }: PositionPieChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5 shadow-lg shadow-emerald-500/10 flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Pozisyona Göre Dağılım
        </h3>
        <p className="text-xs text-slate-500">
          Hangi pozisyonlara daha çok odaklandığını gösterir.
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        {data.length === 0 ? (
          <p className="text-xs text-slate-600">Veri yetersiz.</p>
        ) : (
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  borderRadius: 12,
                  border: "1px solid #1f2937",
                  padding: "8px 10px",
                }}
                formatter={(value, _name, entry) => [
                  value,
                  (entry.payload as { name: string })?.name ?? "",
                ]}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                stroke="#020617"
                strokeWidth={1}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-3 space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] text-slate-400">
        {data.map((p, i) => (
          <div key={p.name} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="truncate" title={p.name}>
                {p.name}
              </span>
            </div>
            <span className="text-slate-500 flex-shrink-0">{p.value}x</span>
          </div>
        ))}
      </div>
    </div>
  );
}
