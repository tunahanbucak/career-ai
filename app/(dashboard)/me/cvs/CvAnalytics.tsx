"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

type CvItem = {
  id: string;
  title: string | null;
  uploadDate: string | Date;
};

type Props = {
  cvs: CvItem[];
};

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "?";
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

export default function CvAnalytics({ cvs }: Props) {
  const stats = useMemo(() => {
    if (!cvs || cvs.length === 0) {
      return {
        totalCvs: 0,
        firstUpload: null as string | null,
        lastUpload: null as string | null,
        byDate: [] as { date: string; count: number }[],
        latestCvs: [] as { id: string; title: string; uploadDate: string }[],
      };
    }

    const byDateMap = new Map<string, number>();

    let minDate: string | null = null;
    let maxDate: string | null = null;

    cvs.forEach((cv) => {
      const d = new Date(cv.uploadDate);
      const key = !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : "unknown";
      byDateMap.set(key, (byDateMap.get(key) ?? 0) + 1);

      if (!minDate || key < minDate) minDate = key;
      if (!maxDate || key > maxDate) maxDate = key;
    });

    const byDate = Array.from(byDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => (a.date > b.date ? 1 : -1));

    const latestCvs = [...cvs]
      .sort((a, b) => {
        const da = new Date(a.uploadDate).getTime();
        const db = new Date(b.uploadDate).getTime();
        return db - da; // en güncel en üstte
      })
      .slice(0, 6)
      .map((cv) => ({
        id: cv.id,
        title: cv.title || "İsimsiz Doküman",
        uploadDate:
          typeof cv.uploadDate === "string"
            ? cv.uploadDate
            : (cv.uploadDate as Date).toISOString(),
      }));

    return {
      totalCvs: cvs.length,
      firstUpload: minDate,
      lastUpload: maxDate,
      byDate,
      latestCvs,
    };
  }, [cvs]);

  if (stats.totalCvs === 0) return null;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Toplam CV"
          value={stats.totalCvs.toString()}
          description="Sisteme yüklediğin tüm özgeçmişler."
          accent="from-indigo-500/40 via-indigo-500/10 to-transparent"
        />
        <StatCard
          label="İlk Yükleme"
          value={
            stats.firstUpload
              ? formatDateLabel(stats.firstUpload)
              : "-"
          }
          description="Bu platformdaki ilk CV yükleme tarihin."
          accent="from-emerald-500/40 via-emerald-500/10 to-transparent"
        />
        <StatCard
          label="Son Yükleme"
          value={
            stats.lastUpload
              ? formatDateLabel(stats.lastUpload)
              : "-"
          }
          description="En güncel CV yükleme tarihin."
          accent="from-fuchsia-500/40 via-fuchsia-500/10 to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-950 p-4 md:p-5 shadow-lg shadow-indigo-500/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Zaman İçinde Yüklemeler</h3>
              <p className="text-xs text-slate-500">Hangi dönemlerde daha aktif CV yüklediğini gösterir.</p>
            </div>
          </div>
          <div className="h-52 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.byDate} margin={{ left: -20, right: 0, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cvUploads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
                  labelFormatter={(v: string | number) => formatDateLabel(String(v))}
                  formatter={(value: number | string) => [value, "Yükleme Sayısı"]}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#cvUploads)"
                  dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: "#a5b4fc" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5 shadow-lg shadow-sky-500/10 flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Son Yüklenen CV’ler</h3>
              <p className="text-xs text-slate-500">En güncel belgelerini tarih sırasına göre gör.</p>
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 max-h-60">
            {stats.latestCvs.map((cv, index) => (
              <div
                key={cv.id}
                className="relative flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 hover:border-sky-500/60 hover:bg-slate-900/90 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 text-[11px] font-semibold">
                      {index + 1}
                    </span>
                    <span className="truncate text-[11px] uppercase tracking-wide text-slate-500">
                      {new Date(cv.uploadDate).toLocaleDateString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-100 truncate" title={cv.title}>
                    {cv.title}
                  </div>
                </div>

                {index === 0 && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                    En Güncel
                  </span>
                )}
              </div>
            ))}

            {stats.latestCvs.length === 0 && (
              <div className="text-xs text-slate-600">Görüntülenecek CV bulunamadı.</div>
            )}
          </div>
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
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-2xl font-semibold text-slate-50">{value}</div>
        {description && <p className="text-[11px] text-slate-400 max-w-xs">{description}</p>}
      </div>
    </div>
  );
}
