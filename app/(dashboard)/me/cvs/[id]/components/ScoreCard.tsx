"use client";

import React from "react";

interface ScoreCardProps {
  label: string;
  score: number;
  icon: React.ReactNode;
  color: string;
}

export default function ScoreCard({
  label,
  score,
  icon,
  color,
}: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-amber-400";
    return "text-orange-400";
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl shadow-xl hover:scale-105 transition-transform">
      <div
        className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10 mb-3`}
      >
        {icon}
      </div>
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className={`text-3xl font-black ${getScoreColor(score)}`}>
        {score}
        <span className="text-lg text-slate-500">/100</span>
      </div>
      <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
