"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  description,
  accent,
}: StatCardProps) {
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
