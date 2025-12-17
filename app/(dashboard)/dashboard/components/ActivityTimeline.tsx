"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, TrendingUp, Zap } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface ActivityTimelineProps {
  activities: Array<{
    type: "cv" | "interview";
    title: string;
    date: Date;
  }>;
}

export default function ActivityTimeline({
  activities,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
          <Clock className="w-8 h-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">
          Henüz aktivite yok
        </h3>
        <p className="text-sm text-slate-500">
          CV analizi veya mülakat yaptığında burada göreceksin
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Son Aktiviteler</h3>
          <p className="text-xs text-slate-400">Yakın zamandaki işlemler</p>
        </div>
      </div>
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 pb-4 border-b border-slate-800/50 last:border-0 last:pb-0"
          >
            <div
              className={`p-2 rounded-lg ${
                activity.type === "cv"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-purple-500/10 text-purple-400"
              }`}
            >
              {activity.type === "cv" ? (
                <Zap className="w-4 h-4" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {activity.title}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {format(activity.date, "d MMMM yyyy, HH:mm", { locale: tr })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
