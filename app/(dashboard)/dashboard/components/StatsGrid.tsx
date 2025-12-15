"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Activity, FileText, TrendingUp, Zap } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  suffix?: string;
  gradient: string;
  borderColor: string;
  delay: number;
};

function StatCard({
  title,
  value,
  icon,
  suffix,
  gradient,
  borderColor,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative overflow-hidden rounded-2xl border ${borderColor} p-6 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 group`}
    >
      <div
        className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity transform translate-x-8 -translate-y-8">
        {icon}
      </div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 rounded-xl backdrop-blur-md mb-4 ${gradient} border ${borderColor} shadow-lg`}
        >
          {icon}
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-3">
          {title}
        </p>
        <div className="flex items-end gap-2">
          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.2, type: "spring" }}
            className="text-4xl font-black text-white tracking-tight"
          >
            {value}
          </motion.h3>
          {suffix && (
            <span className="text-lg text-slate-400 mb-1 font-semibold">
              {suffix}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1 text-emerald-400 text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          <span>Aktif</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

type Props = {
  totalAnalyses: number;
  totalInterviews: number;
  activityScore: number;
};

export default function StatsGrid({
  totalAnalyses,
  totalInterviews,
  activityScore,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      <StatCard
        title="Toplam CV Analizi"
        value={totalAnalyses}
        icon={<FileText size={24} className="text-blue-400" />}
        gradient="bg-blue-500/10"
        borderColor="border-blue-500/20"
        delay={0.1}
      />
      <StatCard
        title="Mülakat Pratiği"
        value={totalInterviews}
        icon={<Activity size={24} className="text-emerald-400" />}
        gradient="bg-emerald-500/10"
        borderColor="border-emerald-500/20"
        delay={0.2}
      />
      <StatCard
        title="Aktivite Skoru"
        value={activityScore}
        suffix="/100"
        icon={<Zap size={24} className="text-amber-400" />}
        gradient="bg-amber-500/10"
        borderColor="border-amber-500/20"
        delay={0.3}
      />
    </div>
  );
}
