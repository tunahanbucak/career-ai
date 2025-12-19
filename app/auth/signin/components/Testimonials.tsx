"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Logo from "@/components/shared/Logo";

const testimonials = [
  {
    quote:
      "CareerAI sayesinde mülakatlara olan güvenim 10 kat arttı. Eksiklerimi nokta atışı tespit etmesi inanılmazdı. Hayalimdeki işe kabul edildim.",
    author: "Ahmet Yılmaz",
    role: "Yazılım Mühendisi @ TechCorp",
    initial: "A",
  },
  {
    quote:
      "CV'mi yükledim ve 2 dakika içinde detaylı analiz aldım. ATS uyumluluğumu artırdım ve daha fazla geri dönüş almaya başladım.",
    author: "Zeynep Demir",
    role: "Ürün Yöneticisi @ StartupXYZ",
    initial: "Z",
  },
  {
    quote:
      "Mülakat simülasyonu gerçek mülakatlara çok benziyordu. AI koçumun geri bildirimleri sayesinde kendimi çok daha iyi ifade ediyorum.",
    author: "Mehmet Kaya",
    role: "Veri Analisti @ DataCo",
    initial: "M",
  },
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      <div className="relative z-10">
        <Logo textSize="2xl" />
      </div>

      <div className="relative z-10 max-w-lg">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-2xl font-medium text-white mb-6 leading-relaxed">
                <Quote className="w-8 h-8 text-indigo-500 mb-4 opacity-50 absolute -left-10 -top-2" />
                &quot;{testimonials[currentTestimonial].quote}&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                  {testimonials[currentTestimonial].initial}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-sm text-slate-400">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={prevTestimonial}
              aria-label="Önceki referans"
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <div className="flex gap-2 flex-1 justify-center">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  aria-label={`Referans ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentTestimonial
                      ? "w-8 bg-indigo-500"
                      : "w-1.5 bg-slate-700"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              aria-label="Sonraki referans"
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-xs text-slate-500">
        © 2024 CareerAI Inc. Tüm hakları saklıdır.
      </div>
    </div>
  );
}
