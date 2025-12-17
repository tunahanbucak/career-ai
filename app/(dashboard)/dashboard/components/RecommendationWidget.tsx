"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RecommendationWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-orange-500/20"
    >
      <div className="bg-slate-950/90 backdrop-blur-xl rounded-[22px] p-6 h-full flex flex-col justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Lightbulb className="h-5 w-5 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-white">Sıradaki Adım</h3>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Son CV analizine göre, <strong>&quot;Liderlik&quot;</strong>{" "}
            yeteneklerini vurgulamak için mülakat pratiği yapman öneriliyor.
          </p>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold shadow-lg shadow-orange-500/25"
          asChild
        >
          <Link href="/interview">
            Mülakata Başla <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
    </motion.div>
  );
}
