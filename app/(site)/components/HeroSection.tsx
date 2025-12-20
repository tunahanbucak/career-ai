"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Ana Sayfa Karşılama Bölümü (Hero Section)
// Kullanıcının ilk gördüğü ekran. Ürünü tanıtır ve kayıt olmaya teşvik eder.
// Framer Motion ile animasyonlu giriş efektleri ve gradient arka plan içerir.
export default function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center mb-16 sm:mb-20 lg:mb-32 pt-6 sm:pt-10">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[300px] sm:w-[600px] h-[200px] sm:h-[400px] bg-indigo-600/20 blur-[80px] sm:blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="inline-flex items-center justify-center gap-2 mb-6 sm:mb-8 px-3 sm:px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.3)]"
      >
        <Sparkles size={14} className="text-indigo-400" />
        <span className="text-xs sm:text-sm font-medium tracking-wide">
          Yapay Zeka Destekli Kariyer Koçu
        </span>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 sm:mb-8 drop-shadow-2xl leading-[1.1] px-4 sm:px-0"
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
        className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-4 sm:px-0"
      >
        Sıradan başvurulardan sıyrıl.{" "}
        <span className="text-white font-medium">CareerAI</span>, CV&apos;ni
        analiz eder, mülakatlara hazırlar ve sana özel kariyer rotası çizer.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center px-4 sm:px-0"
      >
        <Link href="/auth/signin" className="w-full sm:w-auto">
          <Button
            size="lg"
            aria-label="Ücretsiz hesap oluştur ve başla"
            className="group relative h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-white text-slate-950 hover:bg-indigo-50 transition-all rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] hover:scale-105 w-full sm:w-auto"
          >
            <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            Ücretsiz Başla
            <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="#nasil-calisir" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            aria-label="Nasıl çalıştığını öğren"
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-slate-700 bg-slate-950/50 backdrop-blur-sm text-slate-300 hover:bg-slate-900 hover:text-white rounded-full hover:border-slate-500 transition-all w-full sm:w-auto"
          >
            <Star
              size={16}
              className="mr-2 text-yellow-400/80 sm:w-[18px] sm:h-[18px]"
            />
            Nasıl Çalışır?
          </Button>
        </Link>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-4 sm:mt-6 text-xs text-slate-500 text-center px-4"
      >
        Kredi kartı gerekmez • 2 dakikada başla • Dilediğin zaman iptal et
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-6 sm:gap-8 md:gap-16 opacity-70 px-4"
      >
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">5+</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">
            AI Özellik
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">Anında</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Analiz
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">7/24</div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Erişim
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-white">
            Ücretsiz
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-semibold">
            Başlangıç
          </div>
        </div>
      </motion.div>
    </section>
  );
}
