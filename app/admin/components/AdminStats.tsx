"use client";

import {
  Users,
  FileText,
  Activity,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatsProps {
  counts: {
    users: number;
    cvs: number;
    analyses: number;
    interviews: number;
    messages: number;
  };
}

export default function AdminStats({ counts }: AdminStatsProps) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Kullanıcılar"
        value={counts.users}
        icon={<Users size={20} />}
        color="text-sky-400"
        bg="bg-sky-500/10"
        border="border-sky-500/20"
        glow="shadow-sky-500/20"
      />
      <StatCard
        title="CV Sayısı"
        value={counts.cvs}
        icon={<FileText size={20} />}
        color="text-emerald-400"
        bg="bg-emerald-500/10"
        border="border-emerald-500/20"
        glow="shadow-emerald-500/20"
      />
      <StatCard
        title="Analizler"
        value={counts.analyses}
        icon={<Activity size={20} />}
        color="text-purple-400"
        bg="bg-purple-500/10"
        border="border-purple-500/20"
        glow="shadow-purple-500/20"
      />
      <StatCard
        title="Mülakatlar"
        value={counts.interviews}
        icon={<LayoutGrid size={20} />}
        color="text-amber-400"
        bg="bg-amber-500/10"
        border="border-amber-500/20"
        glow="shadow-amber-500/20"
      />
      <StatCard
        title="Mesajlar"
        value={counts.messages}
        icon={<MessageSquare size={20} />}
        color="text-rose-400"
        bg="bg-rose-500/10"
        border="border-rose-500/20"
        glow="shadow-rose-500/20"
      />
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  bg,
  border,
  glow,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  glow: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border backdrop-blur-md p-5 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer",
        border,
        bg,
        glow
      )}
    >
      <div
        className={cn(
          "absolute top-0 right-0 p-3 opacity-20 transition-transform group-hover:scale-110",
          color
        )}
      >
        <div className="absolute inset-0 blur-xl opacity-50 bg-current"></div>
      </div>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            {title}
          </p>
          <h3
            className="text-3xl font-black text-white tabular-nums tracking-tighter"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}
          >
            {value}
          </h3>
        </div>
        <div
          className={cn(
            "rounded-lg bg-slate-950/40 p-2.5 border border-white/5",
            color
          )}
        >
          {icon}
        </div>
      </div>
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-700 group-hover:w-full bg-current opacity-50",
          color
        )}
      />
    </div>
  );
}
