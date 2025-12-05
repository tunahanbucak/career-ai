"use client";

import { useState, useEffect } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const tips = [
  "Mülakatta 'STAR' tekniğini kullan: Durum, Görev, Eylem, Sonuç.",
  "CV'ni her başvuru için özelleştirmeyi unutma.",
  "LinkedIn profilinde anahtar kelimeleri öne çıkar.",
  "Networking yaparken 'ne alacağın' değil 'ne vereceğin' odaklı ol."
];

export default function DailyTipCard() {
  const [tip, setTip] = useState(tips[0]);

  useEffect(() => {
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <div className="p-6 rounded-2xl bg-slate-900 h-full flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-white" />
        </div>
        
        <div className="flex items-center gap-3 mb-3">
             <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                <Lightbulb size={20} />
             </div>
             <h3 className="font-bold text-white">Günün İpucu</h3>
        </div>
        
        <p className="text-slate-300 relative z-10 italic">
            &quot;{tip}&quot;
        </p>
      </div>
    </motion.div>
  );
}
