"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { cn } from "@/lib/utils";

type InterviewItem = {
  id: string;
  position: string;
  date: string | Date;
  _count: { messages: number };
};

type Props = {
  interviews: InterviewItem[];
};

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#e11d48",
  "#06b6d4",
  "#a855f7",
  "#facc15",
]; // Tailwind renkleri

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "?";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export default function InterviewAnalytics({ interviews }: Props) {
  const stats = useMemo(() => {
    if (!interviews || interviews.length === 0) {
      return {
        totalInterviews: 0,
        totalMessages: 0,
        avgMessages: 0,
        byDate: [] as { date: string; count: number }[],
        byInterviewMessages: [] as { label: string; messages: number }[],
        byPosition: [] as { name: string; value: number }[],
      };
    }

    let totalMessages = 0;

    const byDateMap = new Map<string, number>();
    const byPositionMap = new Map<string, number>();
    const byInterviewMessagesRaw: {
      id: string;
      label: string;
      messages: number;
      date: string;
    }[] = [];

    for (const it of interviews) {
      const messages: number = it._count?.messages ?? 0;
      totalMessages += messages;

      const d = new Date(it.date);
      const key = !Number.isNaN(d.getTime())
        ? d.toISOString().slice(0, 10)
        : "unknown";
      byDateMap.set(key, (byDateMap.get(key) ?? 0) + 1);

      const pos = it.position || "Diğer";
      byPositionMap.set(pos, (byPositionMap.get(pos) ?? 0) + 1);

      byInterviewMessagesRaw.push({
        id: it.id,
        label: it.position || "Mülakat",
        messages,
        date: key,
      });
    }

    const totalInterviews = interviews.length;
    const avgMessages =
      totalInterviews > 0
        ? Math.round((totalMessages / totalInterviews) * 10) / 10
        : 0;

    const byDate = Array.from(byDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    const byInterviewMessages = byInterviewMessagesRaw
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(-10)
      .map((it, index) => ({
        label: `${index + 1}.`,
        messages: it.messages,
      }));

    const byPosition = Array.from(byPositionMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      totalInterviews,
      totalMessages,
      avgMessages,
      byDate,
      byInterviewMessages,
      byPosition,
    };
  }, [interviews]);

  if (stats.totalInterviews === 0) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Toplam Mülakat"
          value={stats.totalInterviews.toString()}
          description="AI ile gerçekleştirdiğin tüm simülasyonlar."
          accent="from-indigo-500/40 via-indigo-500/10 to-transparent"
        />
        <StatCard
          label="Toplam Mesaj"
          value={stats.totalMessages.toString()}
          description="Sorduğun ve cevapladığın tüm mesajlar."
          accent="from-emerald-500/40 via-emerald-500/10 to-transparent"
        />
        <StatCard
          label="Ortalama Mesaj / Mülakat"
          value={stats.avgMessages.toString()}
          description="Bir mülakattaki ortalama derinliğin."
          accent="from-fuchsia-500/40 via-fuchsia-500/10 to-transparent"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                data={stats.byDate}
                margin={{ left: -20, right: 0, top: 10, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="interviewActivity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
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
                  labelFormatter={(v: string | number) =>
                    formatDateLabel(String(v))
                  }
                  formatter={(value: number | string) => [
                    value,
                    "Mülakat Sayısı",
                  ]}
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
            {stats.byPosition.length === 0 ? (
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
                    formatter={(
                      value: number | string,
                      _name: string,
                      entry: { payload?: { name?: string } }
                    ) => [value, entry.payload?.name ?? ""]}
                  />
                  <Pie
                    data={stats.byPosition}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    stroke="#020617"
                    strokeWidth={1}
                  >
                    {stats.byPosition.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-3 space-y-1 max-h-24 overflow-y-auto pr-1 text-[11px] text-slate-400">
            {stats.byPosition.map((p, i) => (
              <div
                key={p.name}
                className="flex items-center justify-between gap-2"
              >
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
      </div>
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
          {stats.byInterviewMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-600">
              Veri yetersiz.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.byInterviewMessages}
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
                  formatter={(value: number | string) => [
                    value,
                    "Mesaj Sayısı",
                  ]}
                  labelFormatter={(label: string | number) =>
                    `Mülakat ${String(label).replace(".", "")}`
                  }
                />
                <Bar dataKey="messages" radius={[0, 6, 6, 0]} fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  description?: string;
  accent?: string;
};

function StatCard({ label, value, description, accent }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 p-4 md:p-5 shadow-lg shadow-slate-900/60">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-70 bg-gradient-to-br",
          accent ?? "from-indigo-500/20 via-slate-900/80 to-slate-950"
        )}
      />
      <div className="relative space-y-1">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </div>
        <div className="text-2xl font-semibold text-slate-50">{value}</div>
        {description && (
          <p className="text-[11px] text-slate-400 max-w-xs">{description}</p>
        )}
      </div>
    </div>
  );
}
