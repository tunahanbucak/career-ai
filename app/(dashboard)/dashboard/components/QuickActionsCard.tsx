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
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <Zap size={16} className="text-white" />
            </div>
            <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Hızlı İşlemler</h3>
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
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group backdrop-blur-sm shadow-sm hover:shadow-indigo-500/10"
            >
                <div className="p-2 mb-2 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                    <ThumbsUp size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Geri Bildirim</span>
            </motion.button>

            <motion.button
                variants={item}
                onClick={handleSupport}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all group backdrop-blur-sm shadow-sm hover:shadow-indigo-500/10"
            >
                 <div className="p-2 mb-2 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Mail size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                 </div>
                <span className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">Destek</span>
            </motion.button>
            
            <motion.button
                variants={item}
                onClick={handleLogout}
                className="col-span-2 flex items-center justify-center gap-3 p-3 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/20 transition-all group"
            >
                <LogOut size={16} className="text-red-400 group-hover:translate-x-1 transition-transform" />
                <span className="text-xs font-medium text-red-300 group-hover:text-red-200">Güvenli Çıkış</span>
            </motion.button>
        </motion.div>
      </div>
    </>
  );
}
