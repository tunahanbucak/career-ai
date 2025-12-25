"use client";

import React from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AnalysisDetailsProps {
  analysis: {
    summary: string | null;
    suggestion: string | null;
    score: number | null;
    impact: number | null;
    brevity: number | null;
    ats: number | null;
    style: number | null;
  };
}

export default function AnalysisDetails({ analysis }: AnalysisDetailsProps) {
  return (
    <div className=" grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Brain className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">AI Özeti</h2>
          </div>
          <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-amber-900/20 rounded-2xl p-6 backdrop-blur-xl shadow-xl relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Gelişim Önerileri</h2>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {analysis.suggestion}
            </div>
          </div>
        </div>
        {(analysis.score !== null ||
          analysis.impact !== null ||
          analysis.brevity !== null) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-emerald-900/20 to-slate-950/90 border border-emerald-900/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Güçlü Yönler</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                {(analysis.brevity ?? 0) >= 80 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Özlü ve anlaşılır ifadeler</span>
                  </li>
                )}
                {(analysis.ats ?? 0) >= 80 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>ATS sistemleriyle uyumlu</span>
                  </li>
                )}
                {(analysis.style ?? 0) >= 80 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Profesyonel dil kullanımı</span>
                  </li>
                )}
                {(analysis.impact ?? 0) >= 80 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>Etkili başarı vurguları</span>
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-900/20 to-slate-950/90 border border-orange-900/20 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  İyileştirilebilir
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                {(analysis.brevity ?? 0) < 70 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Daha kısa ve öz ifadeler kullanılabilir</span>
                  </li>
                )}
                {(analysis.impact ?? 0) < 70 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Ölçülebilir başarılar eklenebilir</span>
                  </li>
                )}
                {(analysis.ats ?? 0) < 70 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Daha fazla sektör anahtar kelimesi</span>
                  </li>
                )}
                {(analysis.style ?? 0) < 70 && (
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span>Dil ve stil iyileştirilebilir</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
