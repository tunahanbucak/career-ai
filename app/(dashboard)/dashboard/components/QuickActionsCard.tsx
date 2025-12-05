"use client";

import { useState } from "react";
import { ThumbsUp, Mail, LogOut, CheckCircle2, Zap } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function QuickActionsCard() {
  const [showFeedbackToast, setShowFeedbackToast] = useState(false);

  const handleFeedback = () => {
    setShowFeedbackToast(true);
    setTimeout(() => setShowFeedbackToast(false), 3000);
  };

  const handleSupport = () => {
    window.location.href = "mailto:destek@careerai.com?subject=Yardım Talebi";
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <>
      {showFeedbackToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-5">
          <CheckCircle2 size={18} /> Geri bildiriminiz alındı!
        </div>
      )}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Zap size={16} className="text-indigo-400" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">Hızlı İşlemler</h3>
        </div>
        
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 gap-3"
        >
            <motion.button
                variants={item}
                onClick={handleFeedback}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all group"
            >
                <ThumbsUp size={20} className="mb-2 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-300">Geri Bildirim</span>
            </motion.button>

            <motion.button
                variants={item}
                onClick={handleSupport}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-indigo-500/30 transition-all group"
            >
                <Mail size={20} className="mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-slate-300">Destek</span>
            </motion.button>
            
            <motion.button
                variants={item}
                onClick={handleLogout}
                className="col-span-2 flex items-center justify-center gap-3 p-3 rounded-xl border border-red-900/20 bg-red-950/10 hover:bg-red-950/30 hover:border-red-800/30 transition-all group"
            >
                <LogOut size={16} className="text-red-400" />
                <span className="text-xs font-medium text-red-300">Güvenli Çıkış</span>
            </motion.button>
        </motion.div>
      </div>
    </>
  );
}
