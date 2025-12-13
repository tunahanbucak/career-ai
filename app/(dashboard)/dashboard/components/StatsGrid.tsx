"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Activity, FileText, Award, UserCheck } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  suffix?: string;
  gradient: string;
  delay: number;
};

function StatCard({
  title,
  value,
  icon,
  suffix,
  gradient,
  delay,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-2xl border border-border p-5 bg-card text-card-foreground shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 text-primary">
        {icon}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="mb-4">
          <div
            className={`p-2.5 w-fit rounded-xl backdrop-blur-md mb-3 ${gradient}`}
          >
            {icon}
          </div>
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </p>
        </div>

        <div className="flex items-end gap-1">
          <h3 className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
          {suffix && (
            <span className="text-sm text-muted-foreground mb-1.5 font-medium">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type Props = {
  totalAnalyses: number;
  totalInterviews: number;
  activityScore: number;
};

export default function StatsGrid({ totalAnalyses, totalInterviews, activityScore }: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatCard
        title="Toplam CV Analizi"
        value={totalAnalyses}
        icon={
          <FileText size={24} className="text-blue-500 dark:text-blue-400" />
        }
        gradient="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        delay={0.1}
      />
      <StatCard
        title="Mülakat Pratiği"
        value={totalInterviews}
        icon={
          <Activity
            size={24}
            className="text-emerald-500 dark:text-emerald-400"
          />
        }
        gradient="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        delay={0.2}
      />
      <StatCard
        title="Aktivite Skoru"
        value={activityScore}
        suffix="/100"
        icon={
          <Award size={24} className="text-amber-500 dark:text-amber-400" />
        }
        gradient="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        delay={0.3}
      />
      <StatCard
        title="Üyelik Tipi"
        value="PRO"
        icon={
          <UserCheck
            size={24}
            className="text-purple-500 dark:text-purple-400"
          />
        }
        gradient="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        delay={0.4}
      />
    </div>
  );
}
