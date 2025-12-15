"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Target,
  User,
  Zap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function RecommendedActionsWidget() {
  const actions = [
    {
      title: "Profilini Tamamla",
      desc: "İşverenlerin seni daha iyi tanıması için",
      icon: User,
      href: "/settings",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-400",
      bgGradient: "bg-blue-500/5",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Mülakat Pratiği Yap",
      desc: "AI ile gerçekçi mülakat simülasyonu",
      icon: Zap,
      href: "/interview",
      color: "from-amber-500 to-orange-500",
      iconColor: "text-amber-400",
      bgGradient: "bg-amber-500/5",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Yeni CV Yükle",
      desc: "Eksiklerini hemen öğren",
      icon: FileText,
      href: "/cv-analysis",
      color: "from-emerald-500 to-teal-500",
      iconColor: "text-emerald-400",
      bgGradient: "bg-emerald-500/5",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/50 to-slate-950/50 backdrop-blur-xl p-6 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/20">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Önerilen Adımlar</h3>
            <p className="text-xs text-slate-400">Kariyerinde ilerle</p>
          </div>
        </div>
        <div className="space-y-3">
          {actions.map((action, idx) => (
            <Link href={action.href} key={idx} className="block group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`relative p-4 rounded-xl border ${action.borderColor} ${action.bgGradient} backdrop-blur-sm transition-all duration-300 hover:shadow-lg overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`p-2.5 rounded-xl bg-slate-900/50 border ${action.borderColor} ${action.iconColor}`}
                  >
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors mb-0.5">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {action.desc}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                    <ArrowRight size={18} className="text-slate-400" />
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-50 transition-opacity`}
                />
              </motion.div>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex items-start gap-2 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
          <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-indigo-400 font-semibold">İpucu:</span> Her
            aktivite seni hedefinize bir adım daha yaklaştırıyor!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
