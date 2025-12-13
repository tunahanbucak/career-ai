"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, User, Zap } from "lucide-react";
import Link from "next/link";

export default function RecommendedActionsWidget() {
  const actions = [
    {
      title: "Profilini Tamamla",
      desc: "İşverenlerin seni daha iyi tanıması için bilgilerini güncelle.",
      icon: User,
      href: "/settings",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      title: "Mülakat Pratiği Yap",
      desc: "Yapay zeka ile gerçekçi bir mülakat simülasyonu başlat.",
      icon: Zap,
      href: "/interview",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    },
    {
      title: "Yeni CV Yükle",
      desc: "CV'ni analiz ederek eksiklerini hemen öğren.",
      icon: FileText,
      href: "/cv-analysis",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
           <Target className="w-5 h-5 text-indigo-400" /> Önerilen Adımlar
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        {actions.map((action, idx) => (
          <Link href={action.href} key={idx} className="block group">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className={`relative p-4 rounded-xl border ${action.border} ${action.bg} transition-all duration-300 hover:shadow-lg`}
            >
                <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg bg-slate-950/50 ${action.color}`}>
                        <action.icon size={20} />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                            {action.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {action.desc}
                        </p>
                    </div>
                    <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                        <ArrowRight size={16} className="text-slate-400" />
                    </div>
                </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
