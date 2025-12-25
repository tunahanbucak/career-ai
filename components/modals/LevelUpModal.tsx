"use client";

import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  levelName: string;
}

export default function LevelUpModal({
  isOpen,
  onClose,
  newLevel,
  levelName,
}: LevelUpModalProps) {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          colors={["#6366f1", "#818cf8", "#4f46e5", "#c084fc", "#e879f9"]}
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 50 }}
          className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.3)]"
        >
          <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center relative">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Award className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </motion.div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-black text-white"
              >
                TEBRİKLER! 🎉
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-400 font-medium"
              >
                Azmin meyvelerini veriyor. Seviye Atladın!
              </motion.p>
            </div>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 border border-indigo-500 flex items-center justify-center text-3xl font-black text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                  {newLevel}
                </div>
              </div>
            </div>
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4">
              <p className="text-xs text-indigo-300 uppercase tracking-[0.2em] mb-2 font-bold">
                Yeni Ünvanın
              </p>
              <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                {levelName}
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </h3>
            </div>
            <Button
              onClick={onClose}
              className="w-full h-12 bg-white text-indigo-900 hover:bg-slate-100 font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Maceraya Devam Et!
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
