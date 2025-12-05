"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function InterviewPromoCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-1 text-white shadow-2xl group"
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      
      <div className="relative h-full bg-slate-900/20 backdrop-blur-sm rounded-xl p-5 flex flex-col justify-between">
        <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Mülakat Simülasyonu</h3>
            <p className="mt-2 text-sm text-indigo-100/90 leading-relaxed">
            Yapay zeka ile gerçekçi teknik mülakat deneyimi yaşa. Eksiklerini öğren, rakiplerinin önüne geç.
            </p>
        </div>
        
        <Button
          asChild
          className="mt-6 w-full bg-white text-indigo-700 hover:bg-indigo-50 border-0 font-bold shadow-lg group-hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
        >
          <Link href="/interview" className="flex items-center justify-center gap-2">
            Simülasyonu Başlat <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}
