"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 text-center mb-24">
      <Badge
        variant="outline"
        className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 py-1.5 px-4 rounded-full animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        🚀 Kariyer Yolculuğunda Yapay Zeka Devrimi
      </Badge>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-100">
        Geleceğini{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Kodla
        </span>
        , <br />
        Kariyerini Şansa Bırakma.
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-200">
        CV analizinden mülakat simülasyonuna kadar, işe alım süreçlerinde
        seni öne geçirecek akıllı asistanın CareerAI ile tanış.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both delay-300">
        <Link href="/auth/signin">
          <Button
            size="lg"
            className="h-14 px-8 text-lg bg-white text-slate-950 hover:bg-slate-200 transition-all rounded-full font-semibold"
          >
            Hemen Başla <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
        <Link href="#nasil-calisir">
          <Button
            size="lg"
            variant="outline"
            className="h-14 px-8 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full"
          >
            Nasıl Çalışır?
          </Button>
        </Link>
      </div>
    </section>
  );
}
