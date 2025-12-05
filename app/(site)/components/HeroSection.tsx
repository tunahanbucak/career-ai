"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 text-center mb-20 lg:mb-32 pt-10">
      
      {/* Abstract Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="inline-flex items-center justify-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)]"
      >
        <Sparkles size={14} className="text-indigo-400" />
        <span className="text-sm font-medium tracking-wide">Yapay Zeka Destekli Kariyer Koçu</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 drop-shadow-2xl leading-[1.1]"
      >
        Geleceğini <br className="hidden md:block" />
        <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          Tasarlamaya
        </span>
        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse-slow">
           Başla.
        </span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Sıradan başvurulardan sıyrıl. <span className="text-white font-medium">CareerAI</span>, CV&apos;ni analiz eder, mülakatlara hazırlar ve sana özel kariyer rotası çizer.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
      >
        <Link href="/auth/signin">
          <Button
            size="lg"
            className="group relative h-14 px-8 text-lg bg-white text-slate-950 hover:bg-indigo-50 transition-all rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] hover:scale-105"
          >
            <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            Ücretsiz Başla 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="#nasil-calisir">
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg border-slate-700 bg-slate-950/50 backdrop-blur-sm text-slate-300 hover:bg-slate-900 hover:text-white rounded-full hover:border-slate-500 transition-all"
          >
            <Star size={18} className="mr-2 text-yellow-400/80" />
            Nasıl Çalışır?
          </Button>
        </Link>
      </motion.div>
      
      {/* Trust Indicators / Stats */}
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 1, duration: 1 }}
         className="mt-16 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-8 md:gap-16 opacity-70"
      >
          <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Kullanıcı</div>
          </div>
          <div className="text-center">
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Analiz</div>
          </div>
          <div className="text-center">
              <div className="text-2xl font-bold text-white">%95</div>
              <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Memnuniyet</div>
          </div>
      </motion.div>
    </section>
  );
}
