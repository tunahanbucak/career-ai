"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  color?: string;
}

export default function ScoreGauge({ score, label = "Skor", color = "#6366f1" }: ScoreGaugeProps) {
  const data = [{ name: "Score", value: score, fill: color }];

  return (
    <div className="relative h-40 w-40 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={10}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
