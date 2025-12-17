"use client";

import { motion } from "framer-motion";
import { Award, Target, TrendingUp, Zap, Trophy } from "lucide-react";
import Link from "next/link";

interface ProgressTrackerProps {
  totalAnalyses: number;
  totalInterviews: number;
}

export default function ProgressTracker({
  totalAnalyses,
  totalInterviews,
}: ProgressTrackerProps) {
  // Basit bir level sistemi: Her 3 analiz ve 2 mülakat 1 level
  const totalPoints = totalAnalyses * 10 + totalInterviews * 15;
  const level = Math.floor(totalPoints / 50) + 1;
  const progressToNextLevel = ((totalPoints % 50) / 50) * 100;

  const milestones = [
    {
      title: "İlk CV Analizi",
      completed: totalAnalyses >= 1,
      target: 1,
      points: 10,
    },
    {
      title: "3 CV Analizi",
      completed: totalAnalyses >= 3,
      target: 3,
      points: 30,
    },
    {
      title: "İlk Mülakat",
      completed: totalInterviews >= 1,
      target: 1,
      points: 15,
    },
    {
      title: "5 Mülakat",
      completed: totalInterviews >= 5,
      target: 5,
      points: 75,
    },
  ];

  const isNewUser = totalPoints === 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            {isNewUser ? (
              <Zap className="w-6 h-6 text-amber-400" />
            ) : (
              <Trophy className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">İlerleme Takibi</h3>
            <p className="text-xs text-slate-400">Kariyer yolculuğun</p>
          </div>
        </div>
        {isNewUser ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 mb-4">
                <Award className="w-10 h-10 text-amber-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">
                Maceraya Başla!
              </h4>
              <p className="text-sm text-slate-400 mb-6">
                İlk aktiviteni yap ve puan kazanmaya başla
              </p>
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-sm text-slate-300">CV Analizi</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-400">
                    +10 puan
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-300">Mülakat</span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    +15 puan
                  </span>
                </div>
              </div>
            </div>
            <Link
              href="/cv-analysis"
              className="block w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-center transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/50 hover:scale-[1.02]"
            >
              İlk Adımı At 🚀
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-black text-white">
                  Seviye {level}
                </span>
                <span className="text-sm text-slate-400">
                  ({totalPoints} puan)
                </span>
              </div>
              <div className="relative">
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNextLevel}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Sonraki seviyeye {50 - (totalPoints % 50)} puan kaldı
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-slate-300">
                  Kilometre Taşları
                </span>
              </div>
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    milestone.completed
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-slate-800/30 border-slate-700/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        milestone.completed
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {milestone.completed && (
                        <TrendingUp className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        milestone.completed
                          ? "text-white font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {milestone.title}
                    </span>
                  </div>
                  {milestone.completed ? (
                    <span className="text-xs text-emerald-400 font-bold">
                      ✓ +{milestone.points}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      +{milestone.points}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
